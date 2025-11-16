export const getInitialRoute = (rolLike, permisosLike) => {

  const rol = (
    typeof rolLike === "string" ? rolLike : rolLike?.nombre || ""
  ).toLowerCase();

  const toPermName = (p) => {
    if (!p) return null;
    if (typeof p === "string") return p;
    if (typeof p.nombre === "string") return p.nombre;
    if (typeof p.permiso === "string") return p.permiso;
    if (typeof p.permiso?.nombre === "string") return p.permiso.nombre;
    return null;
  };

  const perms = Array.isArray(permisosLike)
    ? permisosLike.map(toPermName).filter(Boolean)
    : [];

  const has = (perm) => perms.includes(perm);

  if (rol === "administrador" && has("vistas.dashboard.ver"))
    return "/dashboard";
  if (rol === "vendedor" && has("vistas.puntoventa.ver")) return "/punto-venta";
  if (rol === "chofer" && has("vistas.viajes.ver")) return "/viajes";
  if (rol === "operario" && has("vistas.productos.ver")) return "/produccion";

  return "/unauthorized";
};
