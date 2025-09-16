import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONA_HORARIA = "America/Santiago";

/**
 *
 * @param {string|Date} fechaUtc
 * @param {string} formato Ej: "DD-MM-YYYY HH:mm"
 * @returns {string}
 */
export const convertirFechaLocal = (
  fechaUtc,
  formato = "DD-MM-YYYY, HH:mm"
) => {
  if (!fechaUtc) return "Sin fecha";
  return dayjs.utc(fechaUtc).tz(ZONA_HORARIA).format(formato);
};

/**
 *
 * @returns {dayjs.Dayjs}
 */
export const obtenerFechaChile = () => {
  return dayjs().tz(ZONA_HORARIA);
};

/**
 *
 * @param {string} formato
 * @returns {string}
 */
export const obtenerFechaChileFormateada = (formato = "DD-MM-YYYY HH:mm") => {
  return dayjs().tz(ZONA_HORARIA).format(formato);
};

/**
 *
 * @param {string|Date} fechaLocal
 * @returns {string}
 */
export const convertirChileAUtc = (fechaLocal) => {
  return dayjs(fechaLocal).tz(ZONA_HORARIA).utc().toISOString();
};

/**
 *
 * @param {string|Date} fechaUtc
 * @returns {string}
 */
export const tiempoDesdeChile = (fechaUtc) => {
  const ahora = dayjs().tz(ZONA_HORARIA);
  const fecha = dayjs.utc(fechaUtc).tz(ZONA_HORARIA);
  const diff = ahora.diff(fecha, "minute");

  if (diff < 1) return "hace un momento";
  if (diff < 60) return `hace ${diff} min`;
  if (diff < 1440) return `hace ${Math.floor(diff / 60)} h`;
  return fecha.format("DD-MM-YYYY HH:mm");
};

export const formatearFechaSistemaUTC = (
  isoUtc,
  formato = "DD-MM-YYYY HH:mm"
) => {
  if (!isoUtc) return "—";
  return dayjs.utc(isoUtc).tz(ZONA_HORARIA).format(formato);
};
