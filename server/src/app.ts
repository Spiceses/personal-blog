// src/app.ts

import express from "express";
import Post from "./models/post.js";
import multer from "multer";
import OSS from "ali-oss";
import AdmZip from "adm-zip";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import matter from "gray-matter";

// 创建 Express 应用实例
const app = express();

// --- 中间件 ---
app.use(express.json()); // 用于解析 JSON 请求体

const upload = multer({ storage: multer.memoryStorage() });

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
  const data = await Post.find({}, "title slug createdAt updatedAt");
  res.json({
    success: true,
    data: data,
  });
});

app.get("/api/posts/:slug", async (req, res) => {
  console.log(`调用 get api/posts/${req.params.slug}`);

  const data = await Post.findOne(
    { slug: req.params.slug },
    "title slug markdownContent createdAt updatedAt"
  );

  if (!data) {
    const error = {
      code: "NOT_FOUND",
      message: "文章未找到。",
      timestamp: new Date().getTime(),
    };
    res.status(404).json({ success: false, error: error });
    return;
  }

  res.json({
    success: true,
    data: data,
  });
});

app.post("/api/posts", async (req, res) => {
  console.log("调用 post api/posts");

  const post = new Post({
    title: req.body.title,
    markdownContent: req.body.markdownContent,
  });

  const savedPost = await post.save();

  res.status(201).json({
    success: true,
    data: savedPost,
  });
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

    const uploadPromises = zipEntries
      .filter(
        (entry) =>
          /\.(jpg|jpeg|png|gif|svg)$/i.test(entry.entryName) &&
          !entry.isDirectory
      )
      .map(async (entry) => {
        const fileExt = path.extname(entry.entryName);
        const uniqueFileName = `${uuidv4()}${fileExt}`;
        const ossKey = `blog/images/${uniqueFileName}`;
        // 执行上传
        const result = await ossClient.put(ossKey, entry.getData());
        // 记录映射关系
        imagePathMap.set(entry.entryName, result.url);
      });

    await Promise.all(uploadPromises);

    // 找到 .md 文件并处理内容
    const markdownEntry = zipEntries.find(
      (entry) => entry.entryName.endsWith(".md") && !entry.isDirectory
    );
    if (!markdownEntry) {
      throw new Error("No .md file found in the zip package.");
    }
    const rawMarkdownContent = markdownEntry.getData().toString("utf8");

    // 使用 gray-matter 解析元数据
    const { data: metadata, content: markdownBody } =
      matter(rawMarkdownContent);

    // 替换 Markdown 内容中的本地图片路径为 OSS URL
    let finalContent = markdownBody;
    for (const [localPath, ossUrl] of imagePathMap.entries()) {
      const regex = new RegExp(`\\(\\s*\\.?/?${localPath}\\s*\\)`, "g");
      finalContent = finalContent.replace(regex, `(${ossUrl})`);
    }

    // 将处理好的数据存入数据库 (直接使用您的 Post 模型)
    const post = new Post({
      title: metadata.title || "no title",
      markdownContent: finalContent,
    });
    const savedPost = await post.save();

    // 返回成功响应
    res.status(201).json({
      success: true,
      data: savedPost,
    });
  } catch (error) {
    console.error("Error processing zip file:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ success: false, message: errorMessage });
  }
});

// 导出 app 实例，以便在 server.ts 和测试文件中使用
export default app;
