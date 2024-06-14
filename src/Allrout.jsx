import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";

// Higher-Order Component for protected routes
const ProtectedRoute = ({ element: Element }) => {
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));
  return loginuser ? <Element /> : <Navigate to="/login" />;
};

const Allrout = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute element={Home} />} />
    </Routes>
  );
};

export default Allrout;
