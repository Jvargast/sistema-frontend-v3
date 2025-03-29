export const obtenerFechaChile = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-CL", {
    timeZone: "America/Santiago",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const obtenerHoraChile = (fecha) => {
  return new Date(fecha).toLocaleTimeString("es-CL", {
    timeZone: "America/Santiago",
    hour: "2-digit",
    minute: "2-digit",
  });
};
