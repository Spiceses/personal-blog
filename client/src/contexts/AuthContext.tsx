import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CredentialResponse } from "@react-oauth/google";

// 1. 定义类型
interface User {
  _id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentialResponse: CredentialResponse) => Promise<void>;
  logout: () => Promise<void>;
}

// 2. 创建 AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. 创建 AuthProvider 组件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查用户登录状态 (GET /api/auth/me)
  const checkUserStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/me"); //
      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user); //
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user status:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  // 登录方法 (POST /api/auth/google/login)
  const login = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      throw new Error("Google login failed, credential not found.");
    }

    const res = await fetch("/api/auth/google/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credentialResponse.credential }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error?.message || "Backend validation failed.");
    }

    // 登录成功后, 后端已设置 HttpOnly cookie
    // 我们需要更新前端的 user 状态, 并可以触发一次状态检查来同步最新信息
    setUser(data.data.user); //
  };

  // 登出方法 (POST /api/auth/logout)
  const logout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" }); //

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error?.message || "Logout failed.");
    }

    // 登出成功后, 后端已清除 cookie, 我们需要清除前端的 user 状态
    setUser(null);
  };

  // 暴露给子组件的值
  const value = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. 创建自定义 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
