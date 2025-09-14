// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { IUserDocument } from "../models/User.js";

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

class AuthController {
  public googleLogin = asyncHandler(async (req: Request, res: Response) => {
    // 获取 google 的一次性凭证
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: { message: "缺少 Google token。" } });
    }

    try {
      // 验证 google 的一次性凭证, 如果验证成功, 则获取用户信息(如果用户不存在则创建用户).
      const user = await authService.verifyGoogleTokenAndFindOrCreateUser(token);
      // 使用用户的 id 生成 sessionToken, 这个 token 用于用户的浏览器向服务器展示 Who am I?
      const sessionToken = authService.generateJwtToken(user.id);

      res.cookie("session-token", sessionToken, {
        httpOnly: true, // 防止客户端 JS 读取 cookie
        secure: process.env.NODE_ENV === "production", // 在生产环境中只通过 HTTPS 发送
        sameSite: "strict", // 防止 CSRF
        path: "/",
        maxAge: 1000 * 60 * 60 * 24, // 设置为 1 天
      });

      res.status(200).json({
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
          },
        },
      });
    } catch (error: any) {
      res.status(401).json({ success: false, error: { message: error.message || "无效的凭证。" } });
    }
  });

  public getMe = asyncHandler(async (req: Request, res: Response) => {
    // protect 中间件已经验证了用户，并将用户信息附加到了 req.user
    const user = req.user;
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user?._id,
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
        },
      },
    });
  });

  public logout = asyncHandler(async (req: Request, res: Response) => {
    res.cookie("session-token", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration to a past date
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ success: true, data: {} });
  });
}

export const authController = new AuthController();
