import React from "react";
import { Navigate, useLocation } from "react-router-dom";
// 从我们新建的 Context 文件中引入 useAuth
import { useAuth } from "@contexts/AuthContext.tsx";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 当正在检查认证状态时，显示加载中...
  if (isLoading) {
    return <div>Loading...</div>; // 或者一个更复杂的加载动画组件
  }

  // 检查完毕后，如果用户不存在，则重定向到登录页
  if (!user) {
    // 将用户原本想访问的页面路径记录下来，登录后可以跳回
    return <Navigate to="/login" replace state={{ from: location }} />; //
  }

  // 如果用户存在，则渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;
