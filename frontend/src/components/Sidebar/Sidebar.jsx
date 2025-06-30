import './Sidebar.css';
import Button from "@mui/material/Button";
import { MdDashboard, MdLocalShipping } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { MdEngineering } from "react-icons/md";
import { GiAutoRepair } from "react-icons/gi";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from 'react-hot-toast';
import { SessionManager } from '../Utils/SessionManager';

const Sidebar = () => {

    const [activeTab, setactiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    const navigate = useNavigate();

    const isOpenSubmenu = (index) => {
       setactiveTab(index);
       setIsToggleSubmenu(!isToggleSubmenu);
    }

    const handleLogout = () => {
      SessionManager.clearSession();
      toast.success("Logged out successfully!");
      navigate("/login");
    };
   
  return (
    <>
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/dashboard">
              <Button
                className={`w-100 ${activeTab === 0 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(0)}
              >
                <span className="icon">
                  <MdDashboard />
                </span>
                <div className="icon-text">Dashboard</div>
                <span className="arrow">
                  <MdArrowForwardIos />
                </span>
              </Button>
            </Link>
          </li>
          <li>
            <Button
              className={`w-100 ${
                activeTab === 1 && isToggleSubmenu === true ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(1)}
            >
              <span className="icon">
                <MdLock />
              </span>
              <div className="icon-text">Authentication</div>
              <span className="arrow">
                <MdArrowForwardIos />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 1 && isToggleSubmenu === true
                  ? "colapse"
                  : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Register</Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Link to="/customers">
              <Button
                className={`w-100 ${activeTab === 2 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(2)}
              >
                <span className="icon">
                  <FaUsers />
                </span>
                <div className="icon-text">Customers</div>
                <span className="arrow">
                  <MdArrowForwardIos />
                </span>
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/employees">
              <Button
                className={`w-100 ${activeTab === 3 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(3)}
              >
                <span className="icon">
                  <MdEngineering />
                </span>
                <div className="icon-text">Employees</div>
                <span className="arrow">
                  <MdArrowForwardIos />
                </span>
              </Button>
            </Link>
          </li>
           <li>
            <Link to="/suppliers">
              <Button
                className={`w-100 ${activeTab === 4 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(4)}
              >
                <span className="icon">
                  <MdLocalShipping />
                </span>
                <div className="icon-text">Suppliers</div>
                <span className="arrow">
                  <MdArrowForwardIos />
                </span>
              </Button>
            </Link>
          </li>
           <li>
            <Link to="/warranty">
              <Button
                className={`w-100 ${activeTab === 5 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(5)}
              >
                <span className="icon">
                  <IoShieldCheckmarkSharp />
                </span>
                <div className="icon-text">Warranty</div>
                <span className="arrow">
                  <MdArrowForwardIos />
                </span>
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/repair">
              <Button
                className={`w-100 ${activeTab === 6 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(6)}
              >
                <span className="icon">
                  <GiAutoRepair />
                </span>
                <div className="icon-text">Repair</div>
                <span className="arrow">
                  <MdArrowForwardIos />
                </span>
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/tasks">
              <Button
                className={`w-100 ${activeTab === 7 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(7)}
              >
                <span className="icon">
                  <FaTasks />
                </span>
                <div className="icon-text">Tasks</div>
                <span className="arrow">
                  <MdArrowForwardIos />
                </span>
              </Button>
            </Link>
          </li>
        </ul>

        <br />

        <div className="logoutWrapper">
          <div className="logoutBox">
            <Button variant="contained" onClick={handleLogout}>
              <MdOutlineLogout />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;