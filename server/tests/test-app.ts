import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import postsRouter from "../src/api/posts.routes.js";
import authRouter from "../src/api/auth.routes.js";

const app = express();

// 加载测试需要的中间件
app.use(express.json());
app.use(cookieParser());

// 允许所有来源的跨域请求
app.use(cors());

// 加载你要测试的路由
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);

// !! 重要：添加一个错误处理中间件，以便我们能捕获 asyncHandler 传递过来的错误
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: { message: err.message || "服务器内部错误。" } });
});

export default app;
