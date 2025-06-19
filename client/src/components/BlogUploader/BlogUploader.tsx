import { Button, styled } from "@mui/material";
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
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const newPost = await createPostWithImages(file);

      console.log("上传成功! 文章标题:", newPost.title);

      // 重置 input 的值，以便用户可以再次上传同一个文件
      event.target.value = "";
    }
  };

  return (
    <Button component="label" variant="contained" startIcon={<CloudUpload />}>
      上传博客 (.zip)
      <VisuallyHiddenInput type="file" onChange={handleFileChange} accept=".zip" />
    </Button>
  );
};

export default BlogUploader;
