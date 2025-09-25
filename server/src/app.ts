// src/app.ts

import express from "express";
import postsRouter from "../src/api/posts.routes.js";
import authRouter from "../src/api/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// --- 中间件 ---

// 为 CORS 设置更严格的选项
const corsOptions = {
  // 仅允许你的前端应用的源访问
  origin: "http://localhost:3000", // 开发环境地址
  // origin: 'https://your-frontend-domain.com', // 生产环境地址

  // 允许浏览器发送凭证 (如 cookie)
  credentials: true,
};

// 使用配置好的 cors 选项
app.use(cors(corsOptions)); // [gS]

app.use(express.json());
app.use(cookieParser());

// --- 路由 ---
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);

// --- 错误处理 ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("全局错误捕获:", err.stack); // 建议在开发中打印 err.stack 获取更详细信息
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || "服务器发生了一个意外错误。",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

export default app;
