// src/server.ts

import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import cors from "cors";

// 加载 .env 文件中的环境变量
dotenv.config();
const PORT = process.env.PORT || 5000; // 从环境变量获取端口，或默认为5000
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("错误：未在 .env 文件中定义 MONGODB_URI");
  process.exit(1); // 如果没有定义URI，则退出程序
}

// 允许所有来源的跨域请求
app.use(cors());

// 定义一个异步函数来连接数据库
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB 连接成功!");
  } catch (err) {
    // 类型断言，确保 err 是 Error 类型或具有 message 属性
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("MongoDB 连接失败:", errorMessage);
    process.exit(1); // 连接失败时退出程序
  }
};

// 先连接数据库，成功后再启动服务器
const startServer = async () => {
  await connectDB(); // 等待数据库连接成功

  app.listen(PORT, () => {
    console.log(`服务器正在端口 http://localhost:${PORT}/ 上运行`);
  });
};

// 启动服务器
startServer();
