import React from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

const Dashboard = () => {
  return (
    <>
      <Header />
      {/* <h1>Dashboard Page</h1> */}
      <div className="main d-flex">
        <div className="sidebarWrapper">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
