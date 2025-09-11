import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// 这是一个模拟的身份验证 hook。
// 在您的实际应用中，您应该替换这里的逻辑，
// 以便它能真实地检查用户的登录状态（例如，通过检查 Context, Redux store, localStorage 或 cookie）。
const useAuth = () => {
  // 假设我们从某个地方获取用户信息
  const user = null; // 将此更改为对象（例如 { name: "John" }）以模拟登录状态

  if (user) {
    return { isLoggedIn: true };
  } else {
    return { isLoggedIn: false };
  }
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // 如果用户未登录，则重定向到登录页面。
    // 我们还传递了用户最初想访问的页面路径（`location.pathname`）
    // 这样在登录成功后，可以将他们重定向回来。
    // `replace` 属性会替换掉历史记录中的当前条目，防止用户通过“后退”按钮回到这个受保护的路由。
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 如果用户已登录，则正常渲染子组件。
  return <>{children}</>;
};

export default ProtectedRoute;
