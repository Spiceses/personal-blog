// src/app.ts

import express from "express";
import dotenv from "dotenv";
import Post from "./models/post.js";
import multer from "multer";
import OSS from "ali-oss";
import AdmZip from "adm-zip";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import matter from "gray-matter";

// 辅助函数：转义正则表达式中的特殊字符
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 创建 Express 应用实例
const app = express();

// --- 中间件 ---
app.use(express.json()); // 用于解析 JSON 请求体

const upload = multer({ storage: multer.memoryStorage() });

dotenv.config();
const ossClient = new OSS({
  region: process.env.OSS_REGION!,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.OSS_BUCKET!,
});

// --- 路由定义 ---
app.get("/", (req, res) => {
  console.log("调用/");
  res.send("你好，服务器正在运行!");
});

app.get("/api/posts", async (req, res) => {
  console.log("调用 get api/posts");
  try {
    const data = await Post.find({}, "title slug createdAt updatedAt");
    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("获取文章列表失败:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "服务器发生了一个意外错误。",
      },
    });
  }
});

app.get("/api/posts/:slug", async (req, res) => {
  console.log(`调用 get api/posts/${req.params.slug}`);
  try {
    const data = await Post.findOne({ slug: req.params.slug }, "title slug markdownContent createdAt updatedAt");

    if (!data) {
      res.status(404).json({
        success: false,
        error: {
          message: "文章未找到。",
        },
      });
      return;
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error(`获取文章 ${req.params.slug} 失败:`, error);
    res.status(500).json({
      success: false,
      error: {
        message: "服务器发生了一个意外错误。",
      },
    });
  }
});

app.post("/api/posts", async (req, res) => {
  console.log("调用 post api/posts");
  try {
    const { title, markdownContent } = req.body;

    if (!title || !markdownContent) {
      res.status(400).json({
        success: false,
        error: {
          message: "请求数据不符合要求（标题或内容缺失）。",
        },
      });
      return;
    }

    const post = new Post({
      title: title,
      markdownContent: markdownContent,
    });

    const savedPost = await post.save();

    res.status(201).json({
      success: true,
      data: savedPost,
    });
  } catch (error) {
    console.error("创建文章失败:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "服务器发生了一个意外错误。",
      },
    });
  }
});

app.post("/api/posts/zip", upload.single("blogPackage"), async (req, res) => {
  console.log("调用 post /api/upload/zip");

  if (!req.file) {
    res.status(400).json({ success: false, message: "No zip file uploaded." });
    return;
  }

  try {
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();
    const imagePathMap = new Map<string, string>();

    // 上传图片，并构建“文件名 -> OSS URL”的映射
    const uploadPromises = zipEntries
      .filter((entry) => /\.(jpg|jpeg|png|gif|svg)$/i.test(entry.entryName) && !entry.isDirectory)
      .map(async (entry) => {
        // 简化点: 使用 path.basename() 只获取文件名作为键
        const filename = path.basename(entry.entryName);
        const fileExt = path.extname(entry.entryName);
        const uniqueFileName = `${uuidv4()}${fileExt}`;
        const ossKey = `blog/images/${uniqueFileName}`;

        const result = await ossClient.put(ossKey, entry.getData());

        // 因为我们假设文件名唯一，所以可以直接用文件名作为 key
        imagePathMap.set(filename, result.url);
        console.log(`映射文件名 "${filename}" 到 OSS URL "${result.url}"`);
      });

    await Promise.all(uploadPromises);

    // 找到 .md 文件并处理
    const markdownEntry = zipEntries.find((e) => e.entryName.endsWith(".md") && !e.isDirectory);
    if (!markdownEntry) {
      res.status(400).json({
        success: false,
        error: { message: "在 ZIP 包中未找到 .md 文件。" },
      });
      return;
    }
    const rawMarkdownContent = markdownEntry.getData().toString("utf8");

    // 解析元数据和正文
    const { data: metadata, content: markdownBody } = matter(rawMarkdownContent);
    if (!metadata.title) {
      res.status(400).json({
        success: false,
        error: { message: "Markdown 文件必须在元数据中包含标题 (title)。" },
      });
      return;
    }

    // 替换 Markdown 内容中的图片路径
    let finalContent = markdownBody;
    for (const [filename, ossUrl] of imagePathMap.entries()) {
      // 简化点: 使用一个更通用的正则表达式来查找文件名
      const escapedFilename = escapeRegExp(filename);
      // 这个正则表达式会匹配 ![任意文字](任意路径/文件名)
      // `[^)]*?` 会非贪婪地匹配括号内、文件名之前的任何字符（即路径部分）
      const regex = new RegExp(`!\\[(.*?)\\]\\([^)]*?${escapedFilename}\\s*\\)`, "g");

      finalContent = finalContent.replace(regex, `![$1](${ossUrl})`);
    }

    // 将处理好的数据存入数据库
    const post = new Post({
      title: metadata.title,
      markdownContent: finalContent,
    });
    const savedPost = await post.save();

    // 返回成功响应
    res.status(201).json({
      success: true,
      data: savedPost,
    });
  } catch (error) {
    console.error("处理 ZIP 文件失败:", error);
    res.status(500).json({ success: false, error: { message: "处理上传的 ZIP 文件时发生错误。" } });
  }
});

// 统一错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("全局错误捕获:", err); // 记录详细错误信息
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || "服务器发生了一个意外错误。",
      // 在开发环境中可以包含堆栈信息，生产环境应避免
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

// 导出 app 实例，以便在 server.ts 和测试文件中使用
export default app;
