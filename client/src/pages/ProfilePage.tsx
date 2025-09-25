import { useAuth } from "@contexts/AuthContext.tsx";

const ProfilePage = () => {
  // 从 AuthContext 中获取用户信息和登出方法
  const { user, logout } = useAuth();

  // ProtectedRoute 会确保在访问此页面时 user 对象总是存在的
  // 但作为一个好的实践，我们仍然可以做一个检查
  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>加载中...</h1>
        <p>正在获取用户信息...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>用户主页</h1>
      <p>欢迎回来！只有已登录的用户才能看到此页面。</p>

      <div
        style={{
          marginTop: "30px",
          padding: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2>{user.name}</h2>
        <p style={{ color: "#555", margin: "10px 0" }}>邮箱: {user.email}</p>
      </div>

      <button
        onClick={logout}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          fontSize: "16px",
          color: "white",
          backgroundColor: "#d9534f",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        登出
      </button>
    </div>
  );
};

export default ProfilePage;
