// tests/controllers/auth.controller.test.ts

import { describe, test, expect, jest, afterEach, beforeAll } from "@jest/globals";
import request from "supertest";
import type { Express } from "express";
import type { IUserDocument } from "../../src/models/User.js";

// 声明我们将在 beforeAll 中填充的变量
describe("AuthController Tests", () => {
    let app: Express;
    let mockedAuthService: jest.Mocked<typeof import("../../src/services/auth.service.js").authService>;
    let mockedUserModel: jest.Mocked<typeof import("../../src/models/User.js")>;

    // 在所有测试开始前，设置我们的模拟环境
    beforeAll(async () => {
        // 模拟 auth.service.ts
        jest.unstable_mockModule("../../src/services/auth.service.js", () => ({
            authService: {
                verifyGoogleTokenAndFindOrCreateUser: jest.fn(),
                generateJwtToken: jest.fn(),
                verifyJwtToken: jest.fn(),
            },
        }));

        // 模拟 User.ts 模型，因为 protect 中间件会调用 User.findById
        jest.unstable_mockModule("../../src/models/User.js", () => ({
            __esModule: true, // ES Module 模拟需要这个
            default: {
                findById: jest.fn<(id: string) => Promise<IUserDocument | null>>(),
            },
        }));

        // 在注册完所有 mock 之后，动态导入模块
        const authServiceModule = await import("../../src/services/auth.service.js");
        mockedAuthService = authServiceModule.authService as jest.Mocked<typeof authServiceModule.authService>;

        const userModelModule = await import("../../src/models/User.js");
        mockedUserModel = userModelModule as jest.Mocked<typeof userModelModule>;

        // 导入我们的 Express 应用，它现在会使用上面定义的 mock 版本
        const testAppModule = await import("../test-app");
        app = testAppModule.default;
    });

    // 每个测试结束后，重置所有 mock 的调用历史
    afterEach(() => {
        jest.clearAllMocks();
    });

    // --- 测试 Google 登录 ---
    describe("POST /api/auth/google/login", () => {
        const mockUser = {
            _id: "user-123",
            id: "user-123", // service 和 controller 可能使用 id 或 _id
            name: "Test User",
            email: "test@example.com",
            picture: "http://example.com/pic.jpg",
        } as IUserDocument;

        test("当提供有效的 Google token 时，应该返回 200 OK，设置 cookie 并返回用户信息", async () => {
            // 1. 准备 (Arrange)
            const googleToken = "valid-google-token";
            const sessionToken = "mock-session-jwt-token";
            mockedAuthService.verifyGoogleTokenAndFindOrCreateUser.mockResolvedValue(mockUser);
            mockedAuthService.generateJwtToken.mockReturnValue(sessionToken);

            // 2. 执行 (Act)
            const response = await request(app).post("/api/auth/google/login").send({ token: googleToken });

            // 3. 断言 (Assert)
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user._id).toBe(mockUser._id);
            expect(mockedAuthService.verifyGoogleTokenAndFindOrCreateUser).toHaveBeenCalledWith(googleToken);
            expect(mockedAuthService.generateJwtToken).toHaveBeenCalledWith(mockUser.id);

            // 验证 cookie 是否被正确设置
            const cookieHeader = response.headers["set-cookie"][0];
            expect(cookieHeader).toContain(`session-token=${sessionToken}`);
            expect(cookieHeader).toContain("HttpOnly");
            expect(cookieHeader).toContain("Path=/");
            expect(cookieHeader).toContain("SameSite=Strict");
        });

        test("当 service 验证 token 失败并抛出错误时，应该返回 401 Unauthorized", async () => {
            // 1. 准备 (Arrange)
            const errorMessage = "无效的凭证。";
            mockedAuthService.verifyGoogleTokenAndFindOrCreateUser.mockRejectedValue(new Error(errorMessage));

            // 2. 执行 (Act)
            const response = await request(app).post("/api/auth/google/login").send({ token: "invalid-token" });

            // 3. 断言 (Assert)
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe(errorMessage);
        });

        test("当请求 body 中缺少 token 时，应该返回 400 Bad Request", async () => {
            // 2. 执行 (Act) & 3. 断言 (Assert)
            const response = await request(app).post("/api/auth/google/login").send({});

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe("缺少 Google token。");
            expect(mockedAuthService.verifyGoogleTokenAndFindOrCreateUser).not.toHaveBeenCalled();
        });
    });

    // --- 测试获取当前用户信息 (依赖 protect 中间件) ---
    describe("GET /api/auth/me", () => {
        const mockUser = {
            _id: "user-123",
            name: "Test User",
            email: "test@example.com",
            picture: "http://example.com/pic.jpg",
        } as IUserDocument;

        test("当提供了有效的 session-token cookie 时，应该返回 200 OK 和用户信息", async () => {
            // 1. 准备 (Arrange) - 我们需要模拟 protect 中间件的行为
            const validSessionToken = "valid-jwt";
            // 模拟 JWT 验证成功
            mockedAuthService.verifyJwtToken.mockReturnValue({ id: mockUser._id });
            // 模拟数据库查找用户成功
            mockedUserModel.default.findById.mockResolvedValue(mockUser);

            // 2. 执行 (Act)
            const response = await request(app)
                .get("/api/auth/me")
                .set("Cookie", [`session-token=${validSessionToken}`]);

            // 3. 断言 (Assert)
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(mockUser.email);
            expect(mockedAuthService.verifyJwtToken).toHaveBeenCalledWith(validSessionToken);
            expect(mockedUserModel.default.findById).toHaveBeenCalledWith(mockUser._id);
        });

        test("当没有提供 session-token cookie 时，应该返回 401 Unauthorized", async () => {
            // 2. 执行 (Act)
            const response = await request(app).get("/api/auth/me");

            // 3. 断言 (Assert)
            expect(response.status).toBe(401);
            expect(response.body.error.message).toBe("请先登录。");
        });

        test("当提供了无效的 session-token cookie 时，应该返回 401 Unauthorized", async () => {
            // 1. 准备 (Arrange)
            mockedAuthService.verifyJwtToken.mockReturnValue(null);

            // 2. 执行 (Act)
            const response = await request(app)
                .get("/api/auth/me")
                .set("Cookie", ["session-token=invalid-jwt"]);

            // 3. 断言 (Assert)
            expect(response.status).toBe(401);
            expect(response.body.error.message).toBe("无效的凭证。");
        });
    });

    // --- 测试登出 ---
    describe("POST /api/auth/logout", () => {
        test("应该返回 200 OK 并发送一个过期的 cookie 来清除它", async () => {
            // 2. 执行 (Act)
            const response = await request(app).post("/api/auth/logout");

            // 3. 断言 (Assert)
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            // 验证 cookie 是否被设置为一个过去的时间
            const cookieHeader = response.headers["set-cookie"][0];
            expect(cookieHeader).toContain("session-token=;");
            expect(cookieHeader).toContain("Expires=Thu, 01 Jan 1970");
        });
    });
});
