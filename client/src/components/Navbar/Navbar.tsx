import { AppBar, Avatar, Box, Button, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import avatar from "../../assets/avatar.jpg";

const Navbar = () => {
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <Avatar alt="my avatar" src={avatar} />
        <Box
          sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}
        ></Box>
        <Button color="inherit" component={Link} to="/">
          主页
        </Button>
        <Button color="inherit" component={Link} to="/blog">
          博客
        </Button>
        <Button color="inherit" component={Link} to="/about">
          关于
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
