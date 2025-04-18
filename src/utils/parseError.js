export function parseError(error) {
  if (!error || Object.keys(error).length === 0) {
    return { type: "none" };
  }

  const status = error.status;
  const message = error.data?.error || "";

  if (status === 403 && message.includes("Permiso '")) {
    const match = message.match(/Permiso '(.*?)'/);
    const permissionName = match ? match[1] : "Desconocido";

    return {
      type: "permission",
      permission: permissionName,
    };
  }

  if (status && status >= 400) {
    return {
      type: "generic",
      message: message || "Error al cargar datos.",
    };
  }

  return { type: "none" }; 
}
