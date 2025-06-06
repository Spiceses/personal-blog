import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

// 获取 HTML 中的 root 元素
const rootElement = document.querySelector("#root");

// 确保 rootElement 存在再进行渲染
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  );
} else {
  console.error(
    "Failed to find the root element. Check your public/index.html file."
  );
}
