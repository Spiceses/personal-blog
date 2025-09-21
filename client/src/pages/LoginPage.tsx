import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
// 引入 useAuth Hook
import { useAuth } from "@contexts/AuthContext.tsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // 获取重定向前用户想访问的路径, 如果没有则默认为 /profile
  const from = location.state?.from?.pathname || "/profile";

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      // 直接调用 context 中的 login 方法
      await login(credentialResponse);

      // 登录成功后，跳转到之前的页面或默认页面
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      alert((error as Error).message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 80px)",
      }}
    >
      <h1>登录页面</h1>
      <p>请使用您的谷歌账户登录</p>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {
          console.log("Login Failed");
          alert("谷歌登录失败，请稍后重试。");
        }}
        useOneTap
      />
    </div>
  );
};

export default LoginPage;
