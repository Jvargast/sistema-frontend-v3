export const TIPOS_CC = [
  { id: "sucursal", label: "Sucursal" },
  { id: "camion", label: "Camión" },
  { id: "proyecto", label: "Proyecto" },
  { id: "viaje", label: "Viaje" },
  { id: "operacion", label: "Operación" },
  { id: "otro", label: "Otro" },
];

export const validarNombre = (v = "") => {
  const s = String(v || "").trim();
  if (s.length < 2) return { valid: false, msg: "Mínimo 2 caracteres" };
  if (s.length > 100) return { valid: false, msg: "Máximo 100 caracteres" };
  return { valid: true, msg: "" };
};

export const validarTipo = (t) => {
  const ok = TIPOS_CC.some((x) => x.id === t);
  return ok ? { valid: true, msg: "" } : { valid: false, msg: "Tipo inválido" };
};
