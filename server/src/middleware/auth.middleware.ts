// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import User from "../models/User.js";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.["session-token"];

  if (!token) {
    res.status(401).json({ success: false, error: { message: "请先登录。" } });
    return;
  }

  const decoded = authService.verifyJwtToken(token);
  if (!decoded) {
    res.status(401).json({ success: false, error: { message: "无效的凭证。" } });
    return;
  }

  try {
    const user = await User.findById(decoded.id); // 假设未来可能有密码字段
    if (!user) {
      res.status(401).json({ success: false, error: { message: "用户不存在。" } });
      return;
    }
    req.user = user; // 将用户信息附加到请求对象上
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: { message: "未授权。" } });
    return;
  }
};
