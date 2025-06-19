import { React, useState, useRef, useContext } from "react";
import logo from "../../assets/images/logo.png";
import userImg from "../../assets/images/userImg.png";
import { Link, useNavigate } from "react-router-dom";
import { MdMenuOpen, MdOutlineMenu, MdSearch } from "react-icons/md";
import { MdOutlineLightMode, MdNightlight } from "react-icons/md";
import SearchBar from "../SearchBar/Searchbar";
import Button from "@mui/material/Button";
import { Avatar, Box, Stack } from "@mui/material";
import { IconButton } from "@mui/material";
import { IoMdPerson } from "react-icons/io";
import { IoShieldHalfOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { MyContext } from "../../App";
import toast from "react-hot-toast";
import { SessionManager } from "../Utils/SessionManager";
  

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  // Get current user info
  const currentUser = SessionManager.getCurrentUser();


  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };

 const handleLogout = () => {
    SessionManager.clearSession()
    toast.success("Logged out successfully!")
    navigate("/login")
    handleCloseMyAccDrop()
  }

  const handleMyAccount = () => {
    navigate("/profile")
    handleCloseMyAccDrop()
  }

  const handleResetPassword = () => {
    navigate("/forgot-password")
    handleCloseMyAccDrop()
  }


  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* Logo Section */}
          <div className="col-6 col-md-3 col-lg-2">
            <Link to={"/"} className="d-flex align-items-center logo">
              <img src={logo} alt="logo" className="logo-img" />
            </Link>
          </div>

          {/* Desktop Search & Toggle */}
          {context.windowWidth > 768 && (
            <div className="col-md-5 col-lg-3 d-none d-md-flex align-items-center">
              <Button
                className="rounded-circle toggle-btn"
                onClick={() =>
                  context.setIsToggleSidebar(!context.isTogglesidebar)
                }
              >
                {context.isTogglesidebar ? <MdMenuOpen /> : <MdOutlineMenu />}
              </Button>
              <SearchBar />
            </div>
          )}

          {/* Right Controls */}
          <div className="col-6 col-md-4 col-lg-7 d-flex justify-content-end align-items-center">
            
             {/* Sidebar Toggle */}
          {context.windowWidth >= 320 && (
            <Button
                className="rounded-circle toggle-btn mr-2 hide-btn"
                onClick={() =>
                  context.setIsToggleSidebar(!context.isTogglesidebar)
                }
              >
                {context.isTogglesidebar ? <MdMenuOpen /> : <MdOutlineMenu />}
              </Button>
          )}

            {/* Theme Toggle */}
            <Button className="rounded-circle theme-toggle">
              <MdOutlineLightMode />
            </Button>

            {/* User Account */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={handleOpenMyAccDrop}
                  size="small"
                  sx={{
                    width: { xs: 45, sm: 110 },
                    height: 45,
                    borderRadius: 2,
                  }}
                >
                  <Avatar
                    className="userImg"
                    src={userImg}
                    sx={{ width: 45, height: 45 }}
                  />
                  <div className="d-none d-sm-block ms-2 userInfo">
                    <h6 className="mb-0">{currentUser?.name}</h6>
                    {console.log(currentUser)}
                  </div>
                </IconButton>
              </Stack>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMyAccDrop}
              onClick={handleCloseMyAccDrop}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                sx: {
                  width: 200,
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <MenuItem onClick={handleMyAccount}>
                <ListItemIcon>
                  <IoMdPerson />
                </ListItemIcon>
                My account
              </MenuItem>
              <MenuItem onClick={handleResetPassword}>
                <ListItemIcon>
                  <IoShieldHalfOutline />
                </ListItemIcon>
                Reset password
              </MenuItem>
              <MenuItem onClick={handleLogout}>
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
  );
};

export default Header;