import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Signup from "./pages/Signup/Signup";
import {Toaster} from 'react-hot-toast';


function App() {
  
  return (
    
    <BrowserRouter>
    <Toaster position="bottom-right" toastOptions={{duration:3000}}/>
       <Routes>
        <Route path="/" exact={true} element={<Login/>} />
        <Route path="/login" exact={true} element={<Login/>} />
        <Route path="/signup" exact={true} element={<Signup/>} />
        <Route path="/dashboard" exact={true} element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
