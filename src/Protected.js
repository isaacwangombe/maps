import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "./context/AuthContext";

const Protected = ({ children }) => {
  const { user } = UserAuth();
  if (!user) {
    return <h1>You are not logged in</h1>;
  }

  return children;
};

export default Protected;
