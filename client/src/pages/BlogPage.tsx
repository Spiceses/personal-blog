import { Typography } from "@mui/material";
import Blog from "../components/Blog/Blog.tsx";
import BlogUploader from "../components/BlogUploader/BlogUploader.tsx";

const BlogPage = () => {
  return (
    <>
      <Typography
        variant="h3"
        align="center" // 水平居中
        sx={{
          marginTop: 4, // 上边距，数字代表 theme.spacing() 的倍数，例如 4 * 8px = 32px
          marginBottom: 4, // 下边距
        }}
      >
        博客
      </Typography>
      <BlogUploader />
      <Blog />
    </>
  );
};

export default BlogPage;
