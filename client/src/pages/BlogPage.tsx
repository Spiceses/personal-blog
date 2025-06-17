import { Typography, Stack } from "@mui/material";
import Blog from "../components/Blog/Blog.tsx";
import BlogUploader from "../components/BlogUploader/BlogUploader.tsx";

const BlogPage = () => {
  return (
    // Stack 默认是垂直排列 (flex-direction: column)
    // alignItems="center" 会让所有子项在交叉轴上（即水平方向）居中
    <Stack alignItems="center">
      <Typography
        variant="h3"
        align="center"
        sx={{
          marginTop: 4,
          marginBottom: 4, // 调整一下间距，因为 Stack 自带 spacing
        }}
      >
        博客
      </Typography>
      <BlogUploader />
      <Blog />
    </Stack>
  );
};

export default BlogPage;
