import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import LoaderComponent from "../common/LoaderComponent";

const ProtectedRoute = () => {
  const location = useLocation();

  const { isAuthenticated, syncCompleted } = useSelector((state) => state.auth);

  if (!syncCompleted) {
    return <LoaderComponent />;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
