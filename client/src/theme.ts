import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark", // 关键！将模式设置为 'dark'
  },
  typography: {
    fontFamily: [
      // 首先列出你想要的Serif中文字体
      "Noto Serif SC", // 如果你使用了Google Fonts的Noto Serif SC
    ].join(","),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;
