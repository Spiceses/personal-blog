// src/controllers/posts.controller.ts

import { Request, Response, NextFunction } from "express";
import { postService } from "../services/post.service.js";

// 使用一个辅助函数来捕获异步错误，避免在每个函数里都写try/catch
// 这不是必须的，但能让代码更干净
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

class PostsController {
  public getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const posts = await postService.getAllPosts();
    res.status(200).json({ success: true, data: posts });
  });

  public getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
    const post = await postService.getPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ success: false, error: { message: "文章未找到。" } });
    }
    res.status(200).json({ success: true, data: post });
  });

  public createPost = asyncHandler(async (req: Request, res: Response) => {
    const { title, markdownContent } = req.body;
    if (!title || !markdownContent) {
      return res.status(400).json({ success: false, error: { message: "请求数据不符合要求（标题或内容缺失）。" } });
    }
    const newPost = await postService.createPost({ title, markdownContent });
    res.status(201).json({ success: true, data: newPost });
  });

  public createPostFromZip = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No zip file uploaded." });
    }
    const savedPost = await postService.createPostFromZip(req.file.buffer);
    res.status(201).json({ success: true, data: savedPost });
  });
}

export const postsController = new PostsController();
