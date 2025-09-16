// tests/services/auth.service.test.ts

import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals";
import { LoginTicket } from "google-auth-library";
import mongoose from "mongoose";
import User from "../../src/models/User";
import * as dbHandler from "../db-handler";

// 关键改动：我们完全移除了文件顶部的 jest.mock("google-auth-library", ...)

describe("AuthService Tests", () => {
  // 定义一个变量来持有动态导入的服务实例
  let authService: typeof import("../../src/services/auth.service").authService;
  // 定义一个变量来持有我们模拟的函数，以便在测试用例中控制它
  let mockVerifyIdToken: jest.Mock<(token: string) => Promise<LoginTicket>>;

  // 在所有测试开始前，设置模拟、动态导入模块并连接到数据库
  beforeAll(async () => {
    // 创建 mock 函数的实例
    mockVerifyIdToken = jest.fn<() => Promise<LoginTicket>>();

    // 关键改动：使用 jest.unstable_mockModule 在运行时精确控制模拟
    jest.unstable_mockModule("google-auth-library", () => ({
      // 模拟 OAuth2Client 类
      OAuth2Client: jest.fn().mockImplementation(() => ({
        // 模拟 verifyIdToken 方法，使其返回我们上面创建的 mock 函数实例
        verifyIdToken: mockVerifyIdToken,
      })),
    }));

    // 在注册完 mock 之后，我们再动态导入 auth.service 模块。
    // 这确保了它在加载时会获取到上面定义的 mock 版本的 "google-auth-library"。
    const authModule = await import("../../src/services/auth.service");
    authService = authModule.authService;

    // 连接到内存数据库
    await dbHandler.connect();
  });

  // 在每个测试结束后，清空数据库并重置所有模拟
  afterEach(async () => {
    await dbHandler.clearDatabase();
    jest.clearAllMocks(); // 重置 mock 函数的调用记录
  });

  // 在所有测试结束后，关闭数据库连接
  afterAll(async () => await dbHandler.closeDatabase());

  // --- 所有测试用例保持不变，它们现在应该可以正常工作了 ---

  /**
   * 测试 verifyGoogleTokenAndFindOrCreateUser 方法
   */
  describe("verifyGoogleTokenAndFindOrCreateUser", () => {
    const googleToken = "mock-google-token";
    const googlePayload = {
      sub: "123456789",
      name: "Test User",
      email: "test.user@example.com",
      picture: "https://example.com/avatar.jpg",
      iss: "https://accounts.google.com",
      aud: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    test("当一个新用户通过 Google 登录时，应该在数据库中创建该用户", async () => {
      // 1. 准备 (Arrange)
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => googlePayload,
      } as LoginTicket);

      // 2. 执行 (Act)
      const user = await authService.verifyGoogleTokenAndFindOrCreateUser(googleToken);

      // 3. 断言 (Assert)
      expect(mockVerifyIdToken).toHaveBeenCalledTimes(1);
      expect(user).toBeDefined();
      expect(user.googleId).toBe(googlePayload.sub);
      expect(user.email).toBe(googlePayload.email);
      expect(user.name).toBe(googlePayload.name);

      const dbUser = await User.findById(user._id);
      expect(dbUser).not.toBeNull();
      expect(dbUser?.email).toBe(googlePayload.email);
    });

    test("当一个已存在的用户通过 Google 登录时，应该返回该用户信息并更新", async () => {
      // 1. 准备 (Arrange)
      await User.create({
        googleId: googlePayload.sub,
        email: googlePayload.email,
        name: "Old Name",
        picture: "https://example.com/old-avatar.jpg",
      });

      const updatedGooglePayload = {
        ...googlePayload,
        name: "Updated Name",
        picture: "https://example.com/new-avatar.jpg",
      };
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => updatedGooglePayload,
      } as LoginTicket);

      // 2. 执行 (Act)
      const user = await authService.verifyGoogleTokenAndFindOrCreateUser(googleToken);
      const userCount = await User.countDocuments();

      // 3. 断言 (Assert)
      expect(userCount).toBe(1);
      expect(user.name).toBe(updatedGooglePayload.name);
      expect(user.picture).toBe(updatedGooglePayload.picture);
      expect(user.googleId).toBe(googlePayload.sub);
    });

    test("当 Google token 无效时，应该抛出错误", async () => {
      // 1. 准备 (Arrange)
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => undefined,
      } as LoginTicket);

      // 2. 执行 & 3. 断言 (Act & Assert)
      await expect(authService.verifyGoogleTokenAndFindOrCreateUser(googleToken)).rejects.toThrow("无效的凭证。");
    });
  });

  /**
   * 测试 JWT 的生成与验证
   */
  describe("JWT Generation and Verification", () => {
    test("应该能为一个用户 ID 生成一个 JWT, 并且能够成功验证", () => {
      // 1. 准备 (Arrange)
      const userId = new mongoose.Types.ObjectId().toHexString();

      // 2. 执行 (Act)
      const token = authService.generateJwtToken(userId);
      const decodedPayload = authService.verifyJwtToken(token) as { id: string; iat: number; exp: number };

      // 3. 断言 (Assert)
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(decodedPayload).not.toBeNull();
      expect(decodedPayload.id).toBe(userId);
      expect(decodedPayload.iat).toBeDefined();
      expect(decodedPayload.exp).toBeDefined();
    });

    test("当验证一个无效的 token 时，应该返回 null", () => {
      // 1. 准备 (Arrange)
      const invalidToken = "this.is.an.invalid.token";

      // 2. 执行 (Act)
      const decodedPayload = authService.verifyJwtToken(invalidToken);

      // 3. 断言 (Assert)
      expect(decodedPayload).toBeNull();
    });
  });
});
