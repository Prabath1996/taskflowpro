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
import googleIcon from "../../assets/images/google_icon.png";
import axios from "axios";
import { Alert,Snackbar } from "@mui/material";

const Signup = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const focusInput = (index) => {
    setInputIndex(index);
  };

 const [open, setOpen] = useState({open:false,message:"",severity:""});
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };


const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
const navigate = useNavigate();


const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value});
    };


const handleSubmit = async (e) => {
e.preventDefault()

   if (formData.password !== formData.confirmPassword) {
            setOpen({open: true,message: "Passwords do not match",severity: "error",});
            console.log('Passwords do not match')
            return;
        }

      try {
            const response = await axios.post('http://localhost:5000/api/users/signup', formData)
           
            if(response.status === 409) {
                setOpen({open: true,message: "User with this email already exists",severity: "error",});
                console.log('User with this email already exists')
            } else {
                setOpen({open: true,message: "User registration Successful",severity: "success",});
                console.log('User registration Successful')
                navigate('/login')
            }
        } catch(err) {
            setOpen({open: true,message: "An error occured during user registration" ,severity: "error",});
        }

    }


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
                      value={formData.username}
                      className="form-control"
                      placeholder="Enter Your Username"
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
                      <MdMail />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="form-control"
                      placeholder="Enter Your Email"
                      onFocus={() => focusInput(1)}
                      onBlur={() => setInputIndex(null)}
                      onChange={handleChange}
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
                      value={formData.password}
                      onFocus={() => focusInput(2)}
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
                      value={formData.confirmPassword}
                      placeholder="Confirm Password"
                      onFocus={() => focusInput(3)}
                      onBlur={() => setInputIndex(null)}
                      onChange={handleChange}
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
                    <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
                      Sign Up
                    </Button>
                  </div>

                  <div className="form-group text-center mb-0">
                    <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                      <span className="line"></span>
                      <span className="txt">or</span>
                      <span className="line"></span>
                    </div>

                    <Button
                      variant="outlined"
                      className="w-100 btn-lg btn-big loginwithGoogle"
                    >
                      <img src={googleIcon} width="25px" alt="google_icon" />{" "}
                      &nbsp; Sign In with Google
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

        <Snackbar open={open.open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
              <Alert
                onClose={handleClose}
                severity={open.severity}
                variant="filled"
                sx={{ width: '100%' }}
              >
                {open.message}
              </Alert>
        </Snackbar> 
    </>
  );
};

export default Signup;
