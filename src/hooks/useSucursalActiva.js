import { useSelector } from "react-redux";

export default function useSucursalActiva() {
  const { mode, activeSucursalId, sucursales } = useSelector((s) => s.scope);
  const auth = useSelector((s) => s.auth);

  const rol = (
    typeof auth?.rol === "string" ? auth.rol : auth?.rol?.nombre || ""
  ).toLowerCase();

  if (rol !== "administrador") {
    const id = auth?.user?.id_sucursal ?? null;
    if (!id) return null;
    return {
      id_sucursal: Number(id),
      nombre: auth?.user?.nombre_sucursal || "Sucursal desconocida",
    };
  }

  if (mode !== "sucursal") return null;

  if (!activeSucursalId) return null;
  const id = Number(activeSucursalId);
  const nombre =
    sucursales?.find((s) => Number(s.id_sucursal) === id)?.nombre ||
    `Sucursal ${id}`;

  return { id_sucursal: id, nombre };
}
