import React, { createContext, useState } from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";


const MyContext = createContext();


const Dashboard = () => {

     const [isTogglesidebar,setIsToggleSidebar] = useState(false);

  const values={
    isTogglesidebar,
    setIsToggleSidebar
  }

  return (
    <>
    <MyContext.Provider value={values}>
      <Header />
      <div className="main d-flex">
        <div className={`sidebarWrapper ${isTogglesidebar===true ? 'toggle' : ''}`}>
          <Sidebar />
        </div>

        <div className="right-content w-100">
          <div className="row dashboardBoxWrapperRow">
            <div className="col-md-8">
              <div className="dashboardBoxWrapper d-flex">
                <div className="dashboardBox"></div>

                <div className="dashboardBox"></div>
                <div className="dashboardBox"></div>

                <div className="dashboardBox"></div>
              </div>
            </div>
            <div className="col-md-4 pl-0">
              <div className="box"></div>
            </div>
          </div>
        </div>
      </div>
      </MyContext.Provider>
    </>
  );
};

export default Dashboard;
export {MyContext};
