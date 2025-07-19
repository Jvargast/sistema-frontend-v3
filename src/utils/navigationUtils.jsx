export const getInitialRoute = (rol, permissions) => {
  if (rol === "administrador" && permissions.includes("vistas.dashboard.ver")) {
    return "/dashboard";
  } else if (
    rol === "vendedor" &&
    permissions.includes("vistas.puntoventa.ver")
  ) {
    return "/punto-venta";
  } else if (rol === "chofer" && permissions.includes("vistas.viajes.ver")) {
    return "/viajes";
  } else if (
    rol === "operario" &&
    permissions.includes("vistas.productos.ver")
  ) {
    return "/produccion";
  }
  return "/unauthorized";
};
