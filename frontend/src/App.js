import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import {Toaster} from 'react-hot-toast';
import Customers from "./pages/Dashboard/Customer/Customers";
import { useState, createContext } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import Employees from "./pages/Dashboard/Employees/Employees";

const MyContext = createContext();
function App() {
  

   const [isTogglesidebar, setIsToggleSidebar] = useState(false);
      // const [isLogin, setIsLogin] = useState(faslse);
    
      const values = {
        isTogglesidebar,
        setIsToggleSidebar,
      };

  return (
  
   <BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route element={
          <MyContext.Provider value={values}>
            <Header />
            <div className="main d-flex">
              <div className={`sidebarWrapper ${isTogglesidebar === true ? "toggle" : ""}`}>
                <Sidebar />                
              </div>
              <div className="right-content w-100">
                  <Outlet />
                </div>
            </div>
          </MyContext.Provider>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
           <Route path="/employees" element={<Employees />} />
        </Route>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
export { MyContext };

