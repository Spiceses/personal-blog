// tests/services/auth.service.test.ts

import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals";
import { LoginTicket } from "google-auth-library";
import mongoose from "mongoose";
// 删除了这里的静态导入: import { authService } from "../../src/services/auth.service";
import User from "../../src/models/User"; // 直接导入真实的 Mongoose 模型
import * as dbHandler from "../db-handler"; // 导入数据库辅助模块

// #region Mocks
// 模拟 google-auth-library 模块
// 我们不希望在测试中进行真实的网络调用
const mockVerifyIdToken = jest.fn<() => Promise<LoginTicket>>();
console.log("!!! Preparing to mock google-auth-library !!!");
jest.mock("google-auth-library", () => {
  console.log("!!! MOCKING google-auth-library is executing !!!");
  return {
    // 模拟 OAuth2Client 类
    OAuth2Client: jest.fn().mockImplementation(() => {
      console.log("!!! MOCKED new OAuth2Client() was called !!!");
      return {
        // 模拟 verifyIdToken 方法，使其返回我们预设的值
        verifyIdToken: mockVerifyIdToken,
      };
    }),
  };
});
// #endregion

// 描述 AuthService 的测试套件
describe("AuthService Tests", () => {
  // 定义一个变量来持有动态导入的服务实例
  // 为了类型安全，我们可以使用 typeof 和 ReturnType 结合的方式，或者直接用 any
  let authService: typeof import("../../src/services/auth.service").authService;

  // 在所有测试开始前，连接到内存数据库并动态导入服务
  beforeAll(async () => {
    // 动态导入 auth.service 模块
    // 这会确保在导入它之前，上面的 jest.mock 已经执行
    const authModule = await import("../../src/services/auth.service");
    authService = authModule.authService;

    await dbHandler.connect();
  });

  // 在每个测试结束后，清空数据库并重置所有模拟
  afterEach(async () => {
    await dbHandler.clearDatabase();
    jest.clearAllMocks(); // 重置 mock 函数的调用记录
  });

  // 在所有测试结束后，关闭数据库连接
  afterAll(async () => await dbHandler.closeDatabase());

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

      iss: "https://accounts.google.com", // Issuer (签发者)
      aud: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Audience (受众)
      iat: Math.floor(Date.now() / 1000), // Issued At (签发时间戳, 秒)
      exp: Math.floor(Date.now() / 1000) + 3600, // Expiration Time (过期时间戳, 秒)
    };

    test("当一个新用户通过 Google 登录时，应该在数据库中创建该用户", async () => {
      // 1. 准备 (Arrange)
      // 设置 mock 函数，模拟 Google 返回有效的用户信息
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => googlePayload,
      } as LoginTicket); // 使用类型断言来简化 mock 对象的创建

      // 2. 执行 (Act)
      const user = await authService.verifyGoogleTokenAndFindOrCreateUser(googleToken);

      // 3. 断言 (Assert)
      // 确认 verifyIdToken 被正确调用
      expect(mockVerifyIdToken).toHaveBeenCalledTimes(1);
      // 确认返回的用户信息与 Google payload 匹配
      expect(user).toBeDefined();
      expect(user.googleId).toBe(googlePayload.sub);
      expect(user.email).toBe(googlePayload.email);
      expect(user.name).toBe(googlePayload.name);

      // 确认数据库中确实创建了该用户
      const dbUser = await User.findById(user._id);
      expect(dbUser).not.toBeNull();
      expect(dbUser?.email).toBe(googlePayload.email);
    });

    test("当一个已存在的用户通过 Google 登录时，应该返回该用户信息并更新", async () => {
      // 1. 准备 (Arrange)
      // 先在数据库中创建一个老用户
      await User.create({
        googleId: googlePayload.sub,
        email: googlePayload.email,
        name: "Old Name",
        picture: "https://example.com/old-avatar.jpg",
      });

      // 模拟 Google 返回更新后的用户信息 (例如，用户改了名字)
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
      // 确认没有创建新用户
      expect(userCount).toBe(1);
      // 确认用户的姓名和头像已被更新
      expect(user.name).toBe(updatedGooglePayload.name);
      expect(user.picture).toBe(updatedGooglePayload.picture);
      // 确认 googleId 和 email 这种不应改变的字段没有改变
      expect(user.googleId).toBe(googlePayload.sub);
    });

    test("当 Google token 无效时，应该抛出错误", async () => {
      // 1. 准备 (Arrange)
      // 模拟 Google 验证失败，getPayload 返回 undefined
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => undefined,
      } as LoginTicket);

      // 2. 执行 & 3. 断言 (Act & Assert)
      // 确认调用该方法会抛出指定的错误
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
      // 检查 payload 是否包含iat(issued at)和exp(expiration)字段
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