import { Box, Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3">页面不存在</Typography>
    </Box>
  );
};

export default NotFoundPage;
