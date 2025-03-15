/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowed }) => {
  return allowed ? <Outlet /> : <Navigate to="/log-in" replace />;
};

export default ProtectedRoute;
