import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./responsive.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import {Toaster} from 'react-hot-toast';
import Customers from "./pages/Dashboard/Customer/Customers";
import { useState, createContext, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import Employees from "./pages/Dashboard/Employees/Employees";
import Repair from "./pages/Dashboard/Repair/Repair";
import Tasks from "./pages/Dashboard/Tasks/Tasks";
import ResetPassword from "./components/ResetPassword/Resetpassword";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Warranty from "./pages/Dashboard/Warranty/Warranty";
import Suppliers from "./pages/Dashboard/Suppliers/Suppliers";

const MyContext = createContext();
function App() {
  

   const [isTogglesidebar, setIsToggleSidebar] = useState(false);
  const [windowWidth,setWindowWidth] = useState(window.innerWidth);
    
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

      const values = {
        isTogglesidebar,
        setIsToggleSidebar,
        windowWidth,
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
               <>
                <div className={`sidebarOverlay d-none ${isTogglesidebar=== false && 'show'}`} onClick={()=>setIsToggleSidebar(true)}> </div>
               <div className={`sidebarWrapper ${isTogglesidebar === true ? "toggle" : ""}`}>
                <Sidebar />                
               </div>
              
               </>
              
              <div className="right-content w-100">
                  <Outlet />
                </div>
            </div>
          </MyContext.Provider>
        }>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers/></ProtectedRoute>} />
           <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
           <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
           <Route path="/repair" element={<ProtectedRoute><Repair /></ProtectedRoute>} />
           <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
           <Route path="/warranty" element={<ProtectedRoute><Warranty /></ProtectedRoute>} />
           <Route path="/reset-password" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
export { MyContext };

