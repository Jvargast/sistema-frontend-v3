import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import LoaderComponent from "../common/LoaderComponent";

const ProtectedRoute = () => {
  const location = useLocation();

  // Obtener autenticación y estado de sincronización desde Redux
  const { isAuthenticated, syncCompleted } = useSelector((state) => state.auth);

  // Mostrar un loader mientras se completa la sincronización inicial
  if (!syncCompleted) {
    return <LoaderComponent />;
  }

  // Si el usuario está autenticado, renderizar las rutas protegidas (Outlet)
  // Si no está autenticado, redirigir al login con información de la ubicación actual
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
