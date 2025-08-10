import { useState } from "react";
import logo from "../../assets/images/logo_login.png";
import backgroundImg from "../../assets/images/pattern_1.jpg";
import { MdMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Button from "@mui/material/Button";
import { FaCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Signup = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = data;

    // Frontend validation for confirmPassword
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        style: { background: "#f44336", color: "#fff" },
      });
      return;
    }

    try {
      const { data } = await axios.post(
        "https://taskflowpro-exop.vercel.app/api/users/signup",
        { username, email, password }
      );

      if (data.error) {
        toast.error(data.error, {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        });
      } else {
        setData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        toast.success("User Registration Successful", {
          position: "top-right",
          style: { background: "#4caf50", color: "#fff" },
        });
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Server error. Please try again.",
        {
          position: "top-right",
          style: { background: "#f44336", color: "#fff" },
        }
      );
    }
  };

  return (
    <>
      <img src={backgroundImg} alt="background-image" className="loginBG" />
      <section className="loginSection signUpSection">
        <div className="row">
          <div className="col-md-8 d-flex align-items-center flex-column justify-content-center part1">
            <h1>Get it Done, Get it Right, Get it Fast</h1>
            <p>Solution for Service Center Operations</p>
          </div>

          <div className="col-md-4 pr-0">
            <div className="loginBox">
              <div className="logo text-center">
                <img src={logo} alt="logo" />
                <h5 className="font-weight-bold">Register a new account</h5>
              </div>

              <div className="wrapper mt-3 card border">
                <form onSubmit={handleSubmit}>
                  <div
                    className={`form-group position-relative ${
                      inputIndex === 0 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <FaCircleUser />
                    </span>
                    <input
                      type="text"
                      name="username"
                      value={data.username || ""}
                      className="form-control"
                      placeholder="Enter Your Username"
                      onFocus={() => focusInput(0)}
                      onBlur={() => setInputIndex(null)}
                      onChange={(e) =>
                        setData({ ...data, username: e.target.value })
                      }
                    />
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 1 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <MdMail />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      className="form-control"
                      placeholder="Enter Your Email"
                      onFocus={() => focusInput(1)}
                      onBlur={() => setInputIndex(null)}
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                    />
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 2 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <RiLockPasswordFill />
                    </span>
                    <input
                      type={`${isShowPassword === true ? "text" : "password"}`}
                      name="password"
                      className="form-control"
                      placeholder="Enter Your Password"
                      value={data.password}
                      onFocus={() => focusInput(2)}
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

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 3 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <IoShieldCheckmarkSharp />
                    </span>
                    <input
                      type={`${
                        isShowConfirmPassword === true ? "text" : "password"
                      }`}
                      name="confirmPassword"
                      className="form-control"
                      value={data.confirmPassword}
                      placeholder="Confirm Password"
                      onFocus={() => focusInput(3)}
                      onBlur={() => setInputIndex(null)}
                      onChange={(e) =>
                        setData({ ...data, confirmPassword: e.target.value })
                      }
                    />

                    <span
                      className="toggleShowPassword"
                      onClick={() =>
                        setIsShowConfirmPassword(!isShowConfirmPassword)
                      }
                    >
                      {isShowConfirmPassword === true ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </span>
                  </div>

                  <div className="form-group">
                    <Button
                      type="submit"
                      className="btn-blue btn-lg w-100 btn-big"
                    >
                      Sign Up
                    </Button>
                  </div>
                </form>
                <span className="text-center d-block mt-3">
                  Already have an account?
                  <Link to={"/login"} className="link color ml-2">
                    Sign In
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
