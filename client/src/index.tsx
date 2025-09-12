import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google"; // 1. 导入 Provider

import App from "./App.tsx";
import theme from "./theme.ts";

// 获取 HTML 中的 root 元素
const rootElement = document.querySelector("#root");

// 确保 rootElement 存在再进行渲染
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {/* 2. 使用 Provider 包裹您的应用，并传入 Client ID */}
      <GoogleOAuthProvider clientId="37467435893-cnhpjakv3tbkvc3t13ca1bk66us4hjgg.apps.googleusercontent.com">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Check your public/index.html file.");
}
