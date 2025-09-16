// testsservices/post.service.test.ts

import { describe, test, expect, beforeAll, afterAll, afterEach } from "@jest/globals";
import { postService } from "../../src/services/post.service";
import Post from "../../src/models/Post"; // 直接导入真实的 Mongoose 模型
import * as dbHandler from "../db-handler"; // 导入我们的数据库辅助模块

// 描述 PostService 的测试套件
describe("PostService Tests", () => {
  // 在所有测试开始前，连接到内存数据库
  beforeAll(async () => await dbHandler.connect());

  // 在每个测试结束后，清空数据库
  afterEach(async () => await dbHandler.clearDatabase());

  // 在所有测试结束后，关闭数据库连接
  afterAll(async () => await dbHandler.closeDatabase());

  /**
   * 测试 getAllPosts 方法
   */
  describe("getAllPosts", () => {
    test("当数据库中有文章时，应该返回文章列表", async () => {
      // 1. 准备 (Arrange)
      // 直接使用 Post 模型在测试数据库中创建两条真实数据
      await Post.create([
        { title: "title 1", markdownContent: "content1" },
        { title: "title 2", markdownContent: "content2" },
      ]);

      // 2. 执行 (Act)
      // 调用我们要测试的服务方法
      const posts = await postService.getAllPosts();

      // 3. 断言 (Assert)
      // 确认返回了正确数量的文章
      expect(posts).toHaveLength(2);
      // 对返回的文章进行排序，以便进行确定性断言
      posts.sort((a, b) => (a.title as string).localeCompare(b.title as string));
      // 确认返回的数据包含了我们期望的字段和值
      expect(posts[0].title).toBe("title 1");
      expect(posts[0].slug).toBe("title-1"); // 验证 slug 是否自动生成
      expect(posts[1].title).toBe("title 2");
      expect(posts[1].slug).toBe("title-2");
    });

    test("当数据库为空时，应该返回空数组", async () => {
      // 1. 准备 (Arrange) - 无需准备，因为 afterEach 会清空数据库

      // 2. 执行 (Act)
      const posts = await postService.getAllPosts();

      // 3. 断言 (Assert)
      // 确认返回的是一个空数组
      expect(posts).toEqual([]);
      expect(posts).toHaveLength(0);
    });
  });

  describe("getPostBySlug", () => {
    test("当存在匹配的 slug 时，应该返回正确的文章", async () => {
      // 1. 准备 (Arrange)
      const postData = { title: "Test Post", markdownContent: "This is some content." };
      const createdPost = await Post.create(postData);

      // 2. 执行 (Act)
      const foundPost = await postService.getPostBySlug(createdPost.slug);

      // 3. 断言 (Assert)
      expect(foundPost).not.toBeNull();
      expect(foundPost?.title).toBe(postData.title);
      expect(foundPost?.slug).toBe(createdPost.slug);
      expect(foundPost?.markdownContent).toBe(postData.markdownContent);
    });

    test("当不存在匹配的 slug 时，应该返回 null", async () => {
      const foundPost = await postService.getPostBySlug("non-existent-slug");
      expect(foundPost).toBeNull();
    });
  });
});
