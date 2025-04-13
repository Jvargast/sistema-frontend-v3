export function parseError(error) {
    if (!error) {
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
  
    return {
      type: "generic",
      message: message || "Error al cargar datos.",
    };
  }
  