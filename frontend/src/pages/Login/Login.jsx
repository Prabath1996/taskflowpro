import { useState } from "react";
import logo from "../../assets/images/logo_login.png";
import backgroundImg from "../../assets/images/pattern_1.jpg";
import { MdMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { SessionManager } from "../../components/Utils/SessionManager";

const Login = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });

const handleLogin = async (e) => {
  e.preventDefault();
  const { email, password } = data;
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/users/login",
      { email, password }
    );
    console.log("Login response:", data); // Debug line

    if (data.error) {
      toast.error(data.error, {
        position: "top-right",
        style: { background: "#f44336", color: "#fff" },
      });
    } else if (data.success && data.token) {
      localStorage.setItem("authToken", data.token);

      SessionManager.setUserSession({
        email: data.user.email,
        name: data.user.username || data.user.email.split("@")[0],
        userId: data.user._id,
        token: data.token,
        ...data.user,
      });

      setData({ email: "", password: "" });
      toast.success("Login Successful. Welcome!", {
        position: "top-center",
        style: { background: "#4caf50", color: "#fff" },
      });
      navigate("/dashboard");
    } else {
      toast.error("Unexpected error. Please try again.");
    }
  } catch (error) {
    console.error(error);
    toast.error("Server error. Please try again.");
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
                  value={data.email}
                  className="form-control"
                  placeholder="Enter Your Email"
                  onFocus={() => focusInput(0)}
                  onBlur={() => setInputIndex(null)}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
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
                  value={data.password}
                  className="form-control"
                  placeholder="Enter Your Password"
                  onFocus={() => focusInput(1)}
                  onBlur={() => setInputIndex(null)}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
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

              {/* <div className="form-group text-center mb-0">
                <Link to={"/forgot-password"} className="link">
                  FORGOT PASSWORD ?
                </Link>
              </div> */}
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
    </>
  );
};

export default Login;
