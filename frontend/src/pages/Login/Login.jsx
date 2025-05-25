// import React from "react";
// import { TextField, Button, Typography, Link, Box, Paper, colors } from "@mui/material";
// import backgroundImage from "../../assets/images/background.jpeg";

// export default function Login() {

//   return (
//     <Box
//       sx={{
//     width: "auto",
//     height: "100vh",
//     backgroundImage: `url(${backgroundImage})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     display: "flex",
//     flexDirection: "column",
//       }}
//     >

//       {/* <Box sx={{ backgroundColor: "#2c3550", padding: 2, color: "#fff" }}>
//         <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//           <span style={{ color: "#54d2eb" }}>Task</span>
//           <span style={{ color: "#f4e04d" }}>Flow</span>
//           <span style={{ color: "#fff" }}> Pro</span>
//         </Typography>
//       </Box> */}

//       <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "right", alignItems: "ceter" }}>
//         <Paper
//           elevation={6}
//           sx={{
//             padding: 4,
//             margin: 10,
//             width: 320,
//             backgroundColor: "rgba(0,0,0,0.6)",
//             color: "white",
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//             borderRadius: 2,
//           }}
//         >
//           <Typography variant="h6" align="center">
//             Sign In
//           </Typography>

//           <TextField
//             label="Email"
//             variant="outlined"
//             fullWidth
//             InputLabelProps={{ style: { color: "#ccc" } }}
//             InputProps={{ style: { color: "#fff" } }}
//             sx={{ backgroundColor: "#333" }}
//           />

//           <TextField
//             label="Password"
//             variant="outlined"
//             type="password"
//             fullWidth
//             InputLabelProps={{ style: { color: "#ccc" } }}
//             InputProps={{ style: { color: "#fff" } }}
//             sx={{ backgroundColor: "#333" }}
//           />

//           <Button variant="contained" color="primary" fullWidth>
//             Sign In
//           </Button>

//           <Typography variant="body2" align="center">
//             <Link href="#" underline="hover" color="inherit">
//               Forgot password?
//             </Link>
//           </Typography>
//         </Paper>
//       </Box>
//     </Box>
//   );
// }
import { useState } from "react";
import logo from "../../assets/images/logo_login.png";
import backgroundImg from "../../assets/images/pattern_1.jpg";
import { MdMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import googleIcon from "../../assets/images/google_icon.png";

const Login = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  return (
    <>
      <img src={backgroundImg} alt="background-image" className="loginBG" />
      <section className="loginSection">
        <div className="loginBox">
          <div className="logo text-center">
            <img src={logo} alt="logo" />
            <h5 className="font-weight-bold">Login to TaskFlow Pro</h5>
          </div>

          <div className="wrapper mt-3 card border">
            <form>
              <div
                className={`form-group position-relative ${
                  inputIndex === 0 && "focus"
                }`}
              >
                <span className="icon">
                  <MdMail />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Your Email"
                  onFocus={() => focusInput(0)}
                  onBlur={() => setInputIndex(null)}
                />
              </div>

              <div
                className={`form-group position-relative ${
                  inputIndex === 1 && "focus"
                }`}
              >
                <span className="icon">
                  <RiLockPasswordFill />
                </span>
                <input
                  type={`${isShowPassword === true ? "text" : "password"}`}
                  className="form-control"
                  placeholder="Enter Your Password"
                  onFocus={() => focusInput(1)}
                  onBlur={() => setInputIndex(null)}
                />

                <span
                  className="toggleShowPassword"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword === true ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="form-group">
                <Button className="btn-blue btn-lg w-100 btn-big">
                  Sign In
                </Button>
              </div>

              <div className="form-group text-center mb-0">
                <Link to={"/forgot-password"} className="link">
                  FORGOT PASSWORD ?
                </Link>
                <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                  <span className="line"></span>
                  <span className="txt">or</span>
                  <span className="line"></span>
                </div>

                <Button variant="outlined" className="w-100 btn-lg btn-big loginwithGoogle">
                 <img src={googleIcon} width="25px" alt="google_icon" /> &nbsp; Sign In with Google
                </Button>
              </div>
            </form>
          </div>

          <div className="wrapper mt-3 card border footer p-2">
                <span className="text-center">
                  Don't have an account?
                  <Link to={'/signup'} className="link color ml-2">Register</Link>
                </span>
          </div>

        </div>
      </section>
    </>
  );
};

export default Login;
