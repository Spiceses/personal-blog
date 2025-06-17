// src/components/PostDetail.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 1. 导入 useParams
import { getPost, Post } from "@api/posts.ts"; // 假设你有一个根据 slug 获取单篇文章的 API 函数
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer.tsx";

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        return;
      }

      const post = await getPost(slug);
      setPost(post);
    };

    fetchPost();
  }, [slug]);

  if (!post) {
    return <div>Post not found.</div>;
  }

  return <MarkdownRenderer content={post.markdownContent}></MarkdownRenderer>;
};

export default PostDetail;
