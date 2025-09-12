import { useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"; // 1. 导入 GoogleLogin 组件
import { jwtDecode } from "jwt-decode";

// 定义用户对象类型接口 (可选，但推荐)
interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

const LoginPage = () => {
  const navigate = useNavigate();

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

      {/* 2. 直接使用 GoogleLogin 组件 */}
      <GoogleLogin
        onSuccess={(credentialResponse: CredentialResponse) => {
          console.log("Login Success:", credentialResponse);
          // credentialResponse.credential 是一个 JWT 字符串
          if (credentialResponse.credential) {
            const userObject: GoogleUser = jwtDecode(credentialResponse.credential);
            console.log("Decoded User Object:", userObject);
            alert(`欢迎, ${userObject.name}!`);
            navigate("/profile");
          }
        }}
        onError={() => {
          console.log("Login Failed");
          alert("谷歌登录失败，请稍后重试。");
        }}
        useOneTap // (可选) 启用 Google One Tap 登录，体验更流畅
      />
    </div>
  );
};

export default LoginPage;
