import { Box, Typography } from "@mui/material";

const HomePage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3">Hi, 我是Spices!</Typography>
    </Box>
  );
};

export default HomePage;
