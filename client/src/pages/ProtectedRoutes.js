import React from "react";
import { useAppContext } from "../context/appContext";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user } = useAppContext();
  if (user) {
    return children;
  } else {
    return <Navigate to="/landing" />;
  }
};

export default ProtectedRoutes;
