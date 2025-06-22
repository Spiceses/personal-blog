// src/app.ts

import express from "express";
import postRoutes from "./api/posts.routes.js"; // 引入路由

// 创建 Express 应用实例
const app = express();

// --- 中间件 ---
app.use(express.json()); // 用于解析 JSON 请求体

// --- 路由定义 ---
app.get("/", (req, res) => {
  res.send("你好，服务器正在运行!");
});

// 挂载文章API路由
app.use("/api/posts", postRoutes);

// 统一错误处理中间件 (保持不变)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("全局错误捕获:", err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || "服务器发生了一个意外错误。",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

// 导出 app 实例
export default app;
