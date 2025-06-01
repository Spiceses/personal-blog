// server.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// 加载 .env 文件中的环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // 从环境变量获取端口，或默认为3000
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("错误：未在 .env 文件中定义 MONGODB_URI");
  process.exit(1); // 如果没有定义URI，则退出程序
}

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

// Express 中间件和其他路由可以放在这里
app.use(express.json()); // 用于解析 JSON 请求体

app.get("/", (req, res) => {
  res.send("你好，服务器正在运行!");
});

// 先连接数据库，成功后再启动服务器
const startServer = async () => {
  await connectDB(); // 等待数据库连接成功

  app.listen(PORT, () => {
    console.log(`服务器正在端口 http://localhost:${PORT}/ 上运行`);
  });
};

// 启动服务器
startServer();

// 监听 Mongoose 连接事件 (可选)
mongoose.connection.on("connected", () => {
  console.log("Mongoose 已连接到数据库");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose 连接错误:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose 连接已断开");
});

// (可选) 优雅地关闭 MongoDB 连接
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB 连接因应用终止而关闭");
  process.exit(0);
});
