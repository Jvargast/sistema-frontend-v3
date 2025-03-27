import { useSelector } from "react-redux";

export const useHasPermission = (requiredPermission) => {
  const permisos = useSelector((state) => state.auth?.permisos);

  if (!permisos || permisos.length === 0) {
    return false; 
  }

  return permisos.includes(requiredPermission);
};