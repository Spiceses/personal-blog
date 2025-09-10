import { Box, Typography } from "@mui/material";

const AboutPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5">Hi, 我是Spices! 如你所见, 这是我的个人博客网站, 我将在这里向你讲述我的故事!</Typography>
    </Box>
  );
};
export default AboutPage;
