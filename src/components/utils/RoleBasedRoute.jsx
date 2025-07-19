import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const RoleBasedRoute = ({ requiredPermission }) => {
  const { permisos } = useSelector((state) => state.auth);
  const hasPermission = permisos.includes(requiredPermission);

  if (!hasPermission) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
};

RoleBasedRoute.propTypes = {
  requiredPermission: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default RoleBasedRoute;
