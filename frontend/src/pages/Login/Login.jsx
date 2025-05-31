import { useState } from "react";
import logo from "../../assets/images/logo_login.png";
import backgroundImg from "../../assets/images/pattern_1.jpg";
import { MdMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "../../assets/images/google_icon.png";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Login = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  //const [email, setEmail] = useState();
  //const [password, setPassword] = useState();

  const navigate = useNavigate();

  const [data, setData] = useState({ email: " ", password: " " });
  const [open, setOpen] = useState({ open: false, message: "", severity: "" });

  const handleChange = (event) => {
    if (event.target.id === "email") {
      setData({ ...data, email: event.target.value });
    }
    if (event.target.id === "password") {
      setData({ ...data, password: event.target.value });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        data
      );

      if (response.status === 200) {

        console.log(response.data);
        setOpen({open: true,message: response.data.message || "Login Successful! Redirecting...",severity: "success",});
        navigate("/dashboard");

      } else {

        setOpen({open: true,message: "Login failed. Invalid credentials.",severity: "error",});
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";

      if (error.response) {
        // Server responded with a status code outside 2xx
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (error.response.status === 400) {
          errorMessage = "Bad request. Check your input.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try later.";
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error. Check your connection.";
      }

      setOpen({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
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
            <form onSubmit={handleLogin}>
              <div
                className={`form-group position-relative ${
                  inputIndex === 0 && "focus"
                }`}
              >
                <span className="icon">
                  <MdMail />
                </span>
                <input
                  id="email"
                  type="text"
                  name="email"
                  //value={data.email}
                  className="form-control"
                  placeholder="Enter Your Email"
                  onFocus={() => focusInput(0)}
                  onBlur={() => setInputIndex(null)}
                  onChange={handleChange}
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
                  id="password"
                  type={`${isShowPassword === true ? "text" : "password"}`}
                  name="password"
                  //value={data.password}
                  className="form-control"
                  placeholder="Enter Your Password"
                  onFocus={() => focusInput(1)}
                  onBlur={() => setInputIndex(null)}
                  onChange={handleChange}
                />

                <span
                  className="toggleShowPassword"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword === true ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="form-group">
                <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
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

                <Button
                  variant="outlined"
                  className="w-100 btn-lg btn-big loginwithGoogle"
                >
                  <img src={googleIcon} width="25px" alt="google_icon" /> &nbsp;
                  Sign In with Google
                </Button>
              </div>
            </form>
          </div>

          <div className="wrapper mt-3 card border footer p-2">
            <span className="text-center">
              Don't have an account?
              <Link to={"/signup"} className="link color ml-2">
                Register
              </Link>
            </span>
          </div>
        </div>
      </section>

      <Snackbar
        open={open.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={open.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {open.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
