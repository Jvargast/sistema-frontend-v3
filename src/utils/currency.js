export const digitsOnly = (s = "") => String(s || "").replace(/\D/g, "");

export const formatCLP = (value) => {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
};

export const parseCLP = (str = "") => {
  const d = digitsOnly(str);
  return d ? Number(d) : 0;
};
