import { React, useState, useRef, createContext, useContext } from "react";
import logo from "../../assets/images/logo.png";
import userImg from "../../assets/images/userImg.png";
import { Link } from "react-router-dom";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import SearchBar from "../SearchBar/Searchbar";
import { MdOutlineLightMode } from "react-icons/md";
import { MdNightlight } from "react-icons/md";

import Button from "@mui/material/Button";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { IoMdPerson } from "react-icons/io";
import { IoShieldHalfOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { MyContext } from "../../pages/Dashboard/Dashboard";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [isLogin, setISLogin] = useState(false);

  const context = useContext(MyContext);

  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };
  const anchorRef = useRef(null);
  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
            {/* {logo wrapper} */}
            <div className="col-sm-2 part1">
              <Link to={"/"} className="d-flex align-items-center logo">
                <img src={logo} alt="logo" />
              </Link>
            </div>

            <div className="col-sm-3 d-flex align-items-center part2">
              <Button
                className="rounded-circle"
                onClick={() =>
                  context.setIsToggleSidebar(!context.isTogglesidebar)
                }
              >
                {context.isTogglesidebar === false ? (
                  <MdMenuOpen />
                ) : (
                  <MdOutlineMenu />
                )}
              </Button>
              <SearchBar />
            </div>
            <div className="col-sm-6 d-flex align-items-center justify-content-end part3">
              <Button className="rounded-circle">
                <MdOutlineLightMode />
              </Button>
            </div>

            {/* {isLogin !== true ? (
              <Link to={'/login'}><Button className="btn-blue btn-lg btn-round">Sign In</Button>
              </Link> 
            ) :  */}
            
              <div className="myAccWrapper">
                {/* <button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
                  
                {/* <div className="userImg">
                  <span className="rounded-circle">
                    <img src={userImg} alt="userimg" />
                  </span>
                </div>
                <div className="userInfo">
                  <h5>Admin</h5>
                  <p className="mb-0">@admin</p>
                </div> */}

                {/* </button> */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <IconButton
                      onClick={handleOpenMyAccDrop}
                      size="small"
                      sx={{ width: 110, height: 45, borderRadius: 2 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <Avatar
                        src={userImg}
                        sx={{ width: 45, height: 45 }}
                      ></Avatar>
                      {"Admin"}
                    </IconButton>
                  </Stack>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleCloseMyAccDrop}
                  onClick={handleCloseMyAccDrop}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 36,
                          height: 36,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleCloseMyAccDrop}>
                    <ListItemIcon>
                      <IoMdPerson />
                    </ListItemIcon>
                    My account
                  </MenuItem>
                  <MenuItem onClick={handleCloseMyAccDrop}>
                    <ListItemIcon>
                      <IoShieldHalfOutline />
                    </ListItemIcon>
                    Reset password
                  </MenuItem>
                  <MenuItem onClick={handleCloseMyAccDrop}>
                    <ListItemIcon>
                      <MdOutlineLogout />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
