import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  createTheme,
  LinearProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import MySnackbar from "./mysnackbar";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import CloseIcon from "../icons/close.svg";
import { IconButton } from "./button";
import { ThemeProvider } from "@emotion/react";
import DataGridDemo from "./orderlist";
import { getMenberInfo, getUserInfo } from "../api/restapi/restapi";
import { isUserLogin } from "../api/restapi/authuser";

const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const UserCenter = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const navigate = useNavigate();
  const defaultTheme = createTheme();
  const [progress, setProgress] = React.useState(0);
  //调用后端接口获取用户信息
  const [username, setUsername] = useState("");
  //调用isuserlogin函数判断用户是否登录，未登录跳转到登录页面
  React.useEffect(() => {
    async function fetchData() {
      const islogin = await isUserLogin();
      console.log(islogin);
      if (!islogin) {
        navigate(Path.Login);
      }
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    async function fetchData1() {
      const myuserInfo = await getUserInfo();
      console.log(myuserInfo);
      setUsername(myuserInfo.name);
    }
    async function fetchData2() {
      const memberInfo = await getMenberInfo();
      console.log(memberInfo);
    }

    fetchData1();
    fetchData2();
  }, []); // 依赖数组为空，只在组件加载时调用异步函数

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 1;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleLogout = () => {
    // 实现退出登录逻辑
    //点击按钮时清除本地存储中的jwt_token，然后跳转到登录页
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_info");
    // setOpen(true);
    // setMessage("已退出登录");
    // setSeverity("message");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="window-header">
        <div className="window-header-title">
          <div className="window-header-main-title">个人中心</div>
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
            />
          </div>
        </div>
      </div>
      <StyledContainer maxWidth="md">
        <UserInfo>
          <Avatar alt="User Avatar" src="/path/to/avatar.jpg" />
          <Typography variant="h6" component="div" marginLeft={2}>
            User_{username}
          </Typography>
        </UserInfo>
        <ProgressContainer>
          <Typography variant="body1">到期时间</Typography>
          <Box sx={{ width: "60%" }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Typography variant="body1">剩余13天</Typography>
        </ProgressContainer>
        <DataGridDemo />
        <Button variant="contained" onClick={handleLogout} sx={{ mt: 0 }}>
          退出登录
        </Button>
        <MySnackbar
          open={open}
          handleClose={handleClose}
          severity={severity}
          message={message}
        />
      </StyledContainer>
    </ThemeProvider>
  );
};

export default UserCenter;
