// src/services/post.service.ts

import Post, { IPost } from "../models/Post.js";
import AdmZip from "adm-zip";
import matter from "gray-matter";
import { ossService } from "./oss.service.js";
// import { escapeRegExp } from "../utils/escapeRegExp.js"; // 假设你把它移到了utils
import path from "path";

// 辅助函数：转义正则表达式中的特殊字符
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface PostCreationData {
  title: string;
  markdownContent: string;
}

export class PostService {
  public async getAllPosts(): Promise<Partial<IPost>[]> {
    // 只选择需要的字段
    return Post.find({}, "title slug createdAt updatedAt");
  }

  public async getPostBySlug(slug: string): Promise<IPost | null> {
    return Post.findOne({ slug }, "title slug markdownContent createdAt updatedAt");
  }

  public async createPost(data: PostCreationData): Promise<IPost> {
    const post = new Post(data);
    return post.save();
  }

  public async createPostFromZip(fileBuffer: Buffer): Promise<IPost> {
    const zip = new AdmZip(fileBuffer);
    const zipEntries = zip.getEntries();
    const imagePathMap = new Map<string, string>();

    // 1. 上传所有图片
    const uploadPromises = zipEntries
      .filter((entry) => /\.(jpg|jpeg|png|gif|svg)$/i.test(entry.entryName) && !entry.isDirectory)
      .map(async (entry) => {
        const filename = path.basename(entry.entryName);
        const ossUrl = await ossService.uploadImageFromBuffer(entry.getData(), filename);
        imagePathMap.set(filename, ossUrl);
      });

    await Promise.all(uploadPromises);

    // 2. 找到并处理 Markdown 文件
    const markdownEntry = zipEntries.find((e) => e.entryName.endsWith(".md") && !e.isDirectory);
    if (!markdownEntry) {
      throw new Error("在 ZIP 包中未找到 .md 文件。");
    }

    const rawMarkdownContent = markdownEntry.getData().toString("utf8");
    const { data: metadata, content: markdownBody } = matter(rawMarkdownContent);

    if (!metadata.title) {
      throw new Error("Markdown 文件必须在元数据中包含标题 (title)。");
    }

    // 3. 替换内容中的图片链接
    let finalContent = markdownBody;
    for (const [filename, ossUrl] of imagePathMap.entries()) {
      const escapedFilename = escapeRegExp(filename);
      const regex = new RegExp(`!\\[(.*?)\\]\\([^)]*?${escapedFilename}\\s*\\)`, "g");
      finalContent = finalContent.replace(regex, `![$1](${ossUrl})`);
    }

    // 4. 创建并保存文章
    return this.createPost({
      title: metadata.title,
      markdownContent: finalContent,
    });
  }
}

export const postService = new PostService();
