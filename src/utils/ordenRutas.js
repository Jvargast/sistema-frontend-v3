import {
  buildFallbackRoutePath,
  computeGoogleRoute,
  isValidRoutePoint,
} from "./googleRoutesApi";

const PRIORIDAD_RANK = {
  urgente: 1,
  alta: 1,
  normal: 2,
  media: 2,
  baja: 3,
};

function getPrioridadRank(destino) {
  const prioridad = String(destino?.prioridad || "normal").toLowerCase();
  return PRIORIDAD_RANK[prioridad] || 99;
}

function getFechaCreacionTime(destino) {
  const time = new Date(destino?.fecha_creacion || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function ordenarPorPrioridadYFecha(a, b) {
  return (
    getPrioridadRank(a) - getPrioridadRank(b) ||
    getFechaCreacionTime(a) - getFechaCreacionTime(b)
  );
}

export async function ordenarDestinosConGoogle(destinos, origen) {
  if (!destinos?.length || !isValidRoutePoint(origen)) {
    return { ordenados: destinos, routePath: [] };
  }

  const destinosOrdenados = destinos.slice().sort(ordenarPorPrioridadYFecha);
  const destinosValidos = destinosOrdenados.filter(isValidRoutePoint);
  const destinosInvalidos = destinosOrdenados.filter(
    (destino) => !isValidRoutePoint(destino)
  );
  if (!destinosValidos.length) {
    return { ordenados: destinos, routePath: [] };
  }

  const destination = destinosValidos[destinosValidos.length - 1];
  const intermediates = destinosValidos.slice(0, -1);
  const result = await computeGoogleRoute({
    origin: origen,
    destination,
    intermediates,
    optimizeWaypointOrder: false,
  });

  const reordenados = destinosValidos;

  return {
    ordenados: [...reordenados, ...destinosInvalidos],
    routePath:
      result.path.length > 0
        ? result.path
        : buildFallbackRoutePath([origen, ...reordenados]),
  };
}
