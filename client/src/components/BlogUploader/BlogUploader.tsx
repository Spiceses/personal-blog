import { useState } from "react";
import { Button, styled, Alert } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { createPostWithImages } from "@api/posts.ts";

const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1, // 更通用地处理可能占用的空间
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const BlogUploader = () => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null); // 清除之前的错误

    if (file) {
      try {
        const newPost = await createPostWithImages(file);
        console.log("上传成功! 文章标题:", newPost.title);
      } catch (err) {
        console.error("上传失败:", err);
        setError("文件上传失败。请稍后再试。");
      } finally {
        // 重置 input 的值，以便用户可以再次上传同一个文件
        event.target.value = "";
      }
    }
  };

  return (
    <>
      {" "}
      {/* 使用 React.Fragment 作为根元素 */}
      <Button component="label" variant="contained" startIcon={<CloudUpload />}>
        上传博客 (.zip)
        <VisuallyHiddenInput name="" type="file" onChange={handleFileChange} accept=".zip" />
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </>
  );
};

export default BlogUploader;
