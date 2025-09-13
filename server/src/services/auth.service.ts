// src/services/auth.service.ts

import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.js";

// 强烈建议将这些值存储在环境变量中
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";
const JWT_EXPIRES_IN = "7d";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

interface GoogleUserPayload {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

class AuthService {
  /**
   * 验证 Google token 并返回或创建用户
   * @param token - 从 Google 登录获取的 credential token
   * @returns - 数据库中的用户信息
   */
  public async verifyGoogleTokenAndFindOrCreateUser(token: string): Promise<IUser> {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload() as GoogleUserPayload;
      if (!payload) {
        throw new Error("Invalid Google token.");
      }

      // 使用 email 或 googleId (sub) 作为唯一标识符查找用户
      const user = await User.findOneAndUpdate(
        { googleId: payload.sub },
        {
          $setOnInsert: {
            googleId: payload.sub,
            email: payload.email,
          },
          $set: {
            name: payload.name,
            picture: payload.picture,
          },
        },
        {
          upsert: true, // 如果用户不存在，则创建
          new: true, // 返回更新或创建后的文档
          runValidators: true,
        }
      );

      return user;
    } catch (error) {
      console.error("Error verifying Google token:", error);
      throw new Error("无效的凭证。");
    }
  }

  /**
   * 为用户生成 JWT
   * @param userId - 用户的 MongoDB _id
   * @returns - 生成的 JWT 字符串
   */
  public generateJwtToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  /**
   * 验证 JWT
   * @param token - 从 cookie 中获取的 JWT
   * @returns - 解码后的 payload
   */
  public verifyJwtToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
