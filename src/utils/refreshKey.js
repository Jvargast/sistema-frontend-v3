export function getRefreshKeyFromPath(pathname) {
  const parts = pathname.replace(/^\//, "").split("/"); 

  let base = parts[0] === "admin" ? (parts[1] || "admin") : (parts[0] || "");

  const ALIAS = {
    "cuentas-por-cobrar": "facturas",
    "cxc": "facturas",
    "facturas": "facturas",
    "": "dashboard",     
  };

  return ALIAS[base] || base;
}