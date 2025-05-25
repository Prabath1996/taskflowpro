import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import Dashboard, { MyContext } from "./pages/Dashboard/Dashboard";
import { useContext, useEffect, useState } from "react";
import Signup from "./pages/Signup/Signup";



function App() {

  const context = useContext(MyContext);

  return (
    <BrowserRouter>
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
