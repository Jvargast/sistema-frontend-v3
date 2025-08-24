import { useSelector } from "react-redux";

export default function useSucursalActiva() {
  const { activeSucursalId, sucursales } = useSelector((s) => s.scope);
  const user = useSelector((s) => s.auth);
  const rol =
    typeof user?.rol === "string"
      ? user.rol.toLowerCase()
      : user?.rol?.nombre?.toLowerCase();

  if (rol !== "administrador") {
    return {
      id_sucursal: user?.user?.id_sucursal,
      nombre: user?.user?.nombre_sucursal || "Sucursal desconocida",
    };
  }

  if (!activeSucursalId) return null;

  const nombre =
    sucursales?.find((s) => Number(s.id_sucursal) === Number(activeSucursalId))
      ?.nombre || `Sucursal ${activeSucursalId}`;

  return { id_sucursal: Number(activeSucursalId), nombre };
}
