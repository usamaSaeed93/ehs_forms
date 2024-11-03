import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AuthGuard;
