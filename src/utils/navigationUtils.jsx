export const getInitialRoute = (rol, permissions) => {
    if (rol === "administrador" && permissions.includes("ver_dashboard")) {
      return "/dashboard";
    } else if (rol === "vendedor" && permissions.includes("ver_ventas")) {
      return "/punto-venta";
    } else if (rol === "chofer" && permissions.includes("ver_entregas")) {
      return "/viajes";
    }
  
    return "/unauthorized";
  };
  