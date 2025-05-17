import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { MdEngineering } from "react-icons/md";
import { GiAutoRepair } from "react-icons/gi";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {

    const [activeTab, setactiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const isOpenSubmenu = (index) => {
       setactiveTab(index);
       setIsToggleSubmenu(!isToggleSubmenu);
    }


  return (
    <>
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/dashboard">
              <Button className={`w-100 ${activeTab===0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                <span className="icon">
                  <MdDashboard />
                </span>
                Dashboard
                <span className="arrow">
                  <MdArrowForwardIos />
                </span>
              </Button>
            </Link>
          </li>
           <li>
            <Button className={`w-100 ${activeTab===1 && isToggleSubmenu===true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                <span className="icon">
                <MdLock />
              </span>
              Authentication
              <span className="arrow">
                <MdArrowForwardIos />
              </span>
            </Button>
           <div className={`submenuWrapper ${activeTab===1 && isToggleSubmenu===true ? 'colapse' : 'colapsed'}`}>
             <ul className="submenu">
                <li><Link to="#">Login</Link></li>
                <li><Link to="#">Register</Link></li>
            </ul>
           </div>
          </li>

          <li>
            <Link to="#">
            <Button className={`w-100 ${activeTab===2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
              <span className="icon">
                <FaUsers />
              </span>
              Customers
              <span className="arrow">
                <MdArrowForwardIos />
              </span>
            </Button>
            </Link>
          </li>
          <li>
            <Link to="#">
            <Button className={`w-100 ${activeTab===3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
              <span className="icon">
                <MdEngineering />
              </span>
              Employees
              <span className="arrow">
                <MdArrowForwardIos />
              </span>
            </Button>
            </Link>
          </li>
          <li>
            <Button className={`w-100 ${activeTab===4 && isToggleSubmenu===true ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                <span className="icon">
                <IoShieldCheckmarkSharp />
              </span>
              Warranty
              <span className="arrow">
                <MdArrowForwardIos />
              </span>
            </Button>
           <div className={`submenuWrapper ${activeTab===4 && isToggleSubmenu===true ? 'colapse' : 'colapsed'}`}>
             <ul className="submenu">
                <li><Link to="#">Warranty In</Link></li>
                <li><Link to="#">Warranty Out</Link></li>
            </ul>
           </div>
          </li>
          <li>
            <Link to="#">
            <Button className={`w-100 ${activeTab===5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
              <span className="icon">
                <GiAutoRepair />
              </span>
              Repair
              <span className="arrow">
                <MdArrowForwardIos />
              </span>
            </Button>
            </Link>
          </li>
          <li>
            <Link to="#">
            <Button className={`w-100 ${activeTab===6 ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
              <span className="icon">
                <FaTasks />
              </span>
              Tasks
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
            <Button variant="contained"><MdOutlineLogout/>Logout</Button>
        </div>
    </div>
    
      </div>
    </>
  );
};

export default Sidebar;
