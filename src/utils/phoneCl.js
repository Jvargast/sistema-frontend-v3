export const digitsOnly = (s = "") => String(s || "").replace(/\D/g, "");

export const formatPhoneCL = (value = "") => {
  let d = digitsOnly(value);
  if (d.startsWith("56")) d = d.slice(2);
  d = d.slice(0, 9);

  if (!d) return "+56";

  const first = d[0];

  if (first === "9") {
    const a = d[0];
    const b = d.slice(1, 5);
    const c = d.slice(5, 9);
    return `+56 ${a}${b ? " " + b : ""}${c ? " " + c : ""}`;
  }

  if (first === "2") {
    const area = "2";
    const rest = d.slice(1);
    const b = rest.slice(0, 4);
    const c = rest.slice(4, 8);
    return `+56 ${area}${b ? " " + b : ""}${c ? " " + c : ""}`;
  }

  const area = d.slice(0, 2);
  const rest = d.slice(2);
  const b = rest.slice(0, 3);
  const c = rest.slice(3, 7);
  return `+56 ${area}${b ? " " + b : ""}${c ? " " + c : ""}`;
};

export const validatePhoneCL = (value = "") => {
  const d = digitsOnly(value.startsWith("+56") ? value : "+56 " + value);
  const local = d.startsWith("56") ? d.slice(2) : d;
  if (!local) return { valid: false, msg: "Teléfono incompleto" };
  if (local.length !== 9) return { valid: false, msg: "Debe tener 9 dígitos" };

  const first = local[0];

  if (first === "9") return { valid: true, msg: "Teléfono móvil válido" };

  if (first === "2") return { valid: true, msg: "Teléfono fijo válido" };

  if (/[3-7]/.test(first)) return { valid: true, msg: "Teléfono fijo válido" };

  return { valid: false, msg: "Prefijo de área inválido" };
};
