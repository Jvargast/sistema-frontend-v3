export const cleanRut = (rut = "") => (rut || "").replace(/[.-]/g, "").trim();

export const dv = (rutNum) => {
  let M = 0,
    S = 1;
  for (; rutNum; rutNum = Math.floor(rutNum / 10))
    S = (S + (rutNum % 10) * (9 - (M++ % 6))) % 11;
  return S ? String(S - 1) : "K";
};

export const formatRut = (value = "") => {
  const c = cleanRut(value).toUpperCase();
  if (!c) return "";
  const cuerpo = c.slice(0, -1);
  const dig = c.slice(-1);
  const reversed = cuerpo.split("").reverse().join("");
  const groups = reversed.match(/.{1,3}/g) || [];
  const cuerpoFmt = groups.join(".").split("").reverse().join("");
  return `${cuerpoFmt}-${dig}`;
};

export const validateRut = (value = "") => {
  const c = cleanRut(value).toUpperCase();
  if (!c || c.length < 2) return { valid: false, msg: "RUT incompleto" };
  const num = c.slice(0, -1);
  const dig = c.slice(-1);
  if (!/^\d+$/.test(num))
    return { valid: false, msg: "Cuerpo del RUT inválido" };
  const dvCalc = dv(Number(num));
  if (String(dig).toUpperCase() !== String(dvCalc).toUpperCase()) {
    return {
      valid: false,
      msg: `Dígito verificador incorrecto (debe ser ${dvCalc})`,
    };
  }
  return { valid: true, msg: "RUT válido" };
};
