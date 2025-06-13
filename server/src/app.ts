// src/app.ts

import express from "express";
import Post from "./models/post.js";

// 创建 Express 应用实例
const app = express();

// --- 中间件 ---
app.use(express.json()); // 用于解析 JSON 请求体

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

// 导出 app 实例，以便在 server.ts 和测试文件中使用
export default app;
