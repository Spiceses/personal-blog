import { describe, test, expect, jest, afterEach } from "@jest/globals";
import request from "supertest"; // 导入 supertest
import app from "../test-app"; // 导入我们为测试创建的 Express 应用实例
import { postService } from "../../src/services/post.service.js"; // 导入真实的 service

// ---------------- Mocking the Service ----------------
// 我们将模拟整个 postService 模块
// 这样，controller 调用 service 方法时，实际上会调用我们的模拟实现
jest.mock("../../src/services/post.service.js");

// 创建一个类型安全的模拟对象引用，方便在测试用例中修改其行为
const mockedPostService = postService as jest.Mocked<typeof postService>;

// 描述 PostsController 的测试套件
describe("PostsController Tests", () => {
    // 在每个测试后，重置所有模拟
    afterEach(() => {
        jest.resetAllMocks();
    });

    /**
     * 测试 GET /api/posts (getAllPosts)
     */
    describe("GET /api/posts", () => {
        test("当 service 返回文章列表时，应该返回 200 OK 和文章数据", async () => {
            // 1. 准备 (Arrange)
            const mockPosts = [
                { title: "Post 1", slug: "post-1", markdownContent: "Content 1" },
                { title: "Post 2", slug: "post-2", markdownContent: "Content 2" },
            ];
            // 让 postService.getAllPosts 在被调用时返回模拟数据
            mockedPostService.getAllPosts.mockResolvedValue(mockPosts as any);

            // 2. 执行 (Act) & 3. 断言 (Assert)
            const response = await request(app).get("/api/posts");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: mockPosts,
            });
            // 确认 service 的方法被正确调用了一次
            expect(mockedPostService.getAllPosts).toHaveBeenCalledTimes(1);
        });

        test("当 service 抛出错误时，应该返回 500 Internal Server Error", async () => {
            // 1. 准备 (Arrange)
            const errorMessage = "数据库连接失败";
            mockedPostService.getAllPosts.mockRejectedValue(new Error(errorMessage));

            // 2. 执行 (Act) & 3. 断言 (Assert)
            const response = await request(app).get("/api/posts");

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe(errorMessage);
        });
    });

    /**
     * 测试 GET /api/posts/:slug (getPostBySlug)
     */
    describe("GET /api/posts/:slug", () => {
        test("当找到文章时，应该返回 200 OK 和该文章的数据", async () => {
            // 1. 准备 (Arrange)
            const mockPost = { title: "Found Post", slug: "found-post", markdownContent: "Content" };
            mockedPostService.getPostBySlug.mockResolvedValue(mockPost as any);

            // 2. 执行 (Act) & 3. 断言 (Assert)
            const response = await request(app).get("/api/posts/found-post");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, data: mockPost });
            // 确认 service 方法被以正确的参数调用
            expect(mockedPostService.getPostBySlug).toHaveBeenCalledWith("found-post");
        });

        test("当文章未找到时 (service 返回 null)，应该返回 404 Not Found", async () => {
            // 1. 准备 (Arrange)
            mockedPostService.getPostBySlug.mockResolvedValue(null);

            // 2. 执行 (Act) & 3. 断言 (Assert)
            const response = await request(app).get("/api/posts/not-found-slug");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                error: { message: "文章未找到。" },
            });
        });
    });

    /**
     * 测试 POST /api/posts (createPost)
     */
    describe("POST /api/posts", () => {
        test("当提供有效的标题和内容时，应该返回 201 Created 和新文章的数据", async () => {
            // 1. 准备 (Arrange)
            const requestBody = { title: "New Post", markdownContent: "Awesome content" };
            const createdPost = { id: "some-id", slug: "new-post", ...requestBody };
            mockedPostService.createPost.mockResolvedValue(createdPost as any);

            // 2. 执行 (Act) & 3. 断言 (Assert)
            const response = await request(app)
                .post("/api/posts")
                .send(requestBody);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ success: true, data: createdPost });
            // 确认 service 方法被以正确的参数调用
            expect(mockedPostService.createPost).toHaveBeenCalledWith(requestBody);
        });

        test("当缺少标题时，应该返回 400 Bad Request", async () => {
            // 1. 准备 (Arrange)
            const requestBody = { markdownContent: "Some content" }; // 缺少 title

            // 2. 执行 (Act) & 3. 断言 (Assert)
            const response = await request(app)
                .post("/api/posts")
                .send(requestBody);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: { message: "请求数据不符合要求（标题或内容缺失）。" },
            });
            // 确认 service 方法未被调用
            expect(mockedPostService.createPost).not.toHaveBeenCalled();
        });
    });

    /**
     * 测试 POST /api/posts/zip (createPostFromZip)
     */
    describe("POST /api/posts/zip", () => {
        test("当上传有效的 zip 文件时，应该返回 201 Created", async () => {
            // 1. 准备 (Arrange)
            const createdPost = { id: "zip-id", title: "From Zip", slug: "from-zip" };
            // 模拟 service 返回创建好的文章
            mockedPostService.createPostFromZip.mockResolvedValue(createdPost as any);
            // 创建一个假的 buffer 来模拟文件内容
            const fakeFileBuffer = Buffer.from("this is a fake zip file");

            // 2. 执行 (Act) & 3. 断言 (Assert)
            const response = await request(app)
                .post("/api/posts/zip")
                // 使用 supertest 的 .attach() 方法来模拟文件上传
                // 第一个参数是 form field 的名字 (例如 'upload' 或 'zipfile')
                // !!你需要根据你的 multer 配置来确定这个名字
                .attach("file", fakeFileBuffer, "test.zip");

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ success: true, data: createdPost });
            // 确认 service 方法被调用，并且接收到的是一个 Buffer
            expect(mockedPostService.createPostFromZip).toHaveBeenCalledWith(expect.any(Buffer));
        });

        test("当没有上传文件时，应该返回 400 Bad Request", async () => {
            // 2. 执行 (Act) & 3. 断言 (Assert)
            const response = await request(app).post("/api/posts/zip"); // 不附加任何文件

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                message: "No zip file uploaded.",
            });
            // 确认 service 方法未被调用
            expect(mockedPostService.createPostFromZip).not.toHaveBeenCalled();
        });
    });
});
