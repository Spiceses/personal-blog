import { AppBar, Avatar, Box, Button, Toolbar, IconButton } from "@mui/material";
import { Link } from "react-router-dom"; // 只需 Link
import AccountCircle from "@mui/icons-material/AccountCircle";
import avatar from "../../assets/avatar.jpg";

const Navbar = () => {
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <Avatar alt="my avatar" src={avatar} />
        <Box sx={{ flexGrow: 1 }} />

        <Button color="inherit" component={Link} to="/">
          主页
        </Button>
        <Button color="inherit" component={Link} to="/blog">
          博客
        </Button>
        <Button color="inherit" component={Link} to="/about">
          关于
        </Button>

        {/* 直接链接到用户主页，无需任何点击事件处理 */}
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          component={Link} // 使用 Link 组件
          to="/profile" // 直接指向目标地址
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
