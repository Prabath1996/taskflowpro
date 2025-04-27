import logo from '../../assets/images/logo.png';
import userImg from '../../assets/images/userImg.png';
import {Link} from "react-router-dom";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import SearchBar from '../SearchBar/Searchbar';
import { MdOutlineLightMode } from "react-icons/md";
import { MdNightlight } from "react-icons/md";


const Header = () => {
  return(
    <>
    <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
            <div className="row d-flex align-items-center w-100">
                {/* {logo wrapper} */}
                <div className="col-sm-2 part1">
                    <Link to={'/'} className="d-flex align-items-center logo">
                    <img src={logo} alt="logo" />
                    </Link>
                </div>


            <div className="col-sm-3 d-flex align-items-center part2 pl-4">
                <button className="rounded-circle"><MdMenuOpen/></button>
                <SearchBar/>
                </div>
                <div className="col-sm-6 d-flex align-items-center justify-content-end part3">
                <button className="rounded-circle"><MdOutlineLightMode/></button>
                </div>

               <div className="myAccWrapper">
               <div className="myAcc d-flex align-items-center">
                  <div className="userImg">
                    <span className="rounded-circle">
                      <img src={userImg} alt="userimg" />
                    </span>
                  </div>

                  <div className="userInfo">
                    <h5>Admin</h5>
                    <p className="mb-0">@admin</p>

                  </div>
                </div>
               </div>
                

            </div>
        </div>
    </header>
    </>

  )
}

export default Header