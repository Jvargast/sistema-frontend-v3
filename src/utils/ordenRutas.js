import {
  buildFallbackRouteSegments,
  computeGoogleRoute,
  isValidRoutePoint,
  mergeRoutePaths,
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
  const firstDestination = destinosValidos[0];
  const remainingDestinations = destinosValidos.slice(1);
  const fallbackSegments = buildFallbackRouteSegments(origen, destinosValidos);

  const currentLegResult = await computeGoogleRoute({
    origin: origen,
    destination: firstDestination,
    optimizeWaypointOrder: false,
  });
  const currentLegPath = currentLegResult.path.length
    ? currentLegResult.path
    : fallbackSegments.currentLegPath;

  let futureLegPath = [];
  if (remainingDestinations.length > 0) {
    const futureResult = await computeGoogleRoute({
      origin: firstDestination,
      destination,
      intermediates: remainingDestinations.slice(0, -1),
      optimizeWaypointOrder: false,
    });

    futureLegPath = futureResult.path.length
      ? futureResult.path
      : fallbackSegments.futureLegPath;
  }

  const reordenados = destinosValidos;
  const routePath = mergeRoutePaths(currentLegPath, futureLegPath);

  return {
    ordenados: [...reordenados, ...destinosInvalidos],
    currentLegPath,
    futureLegPath,
    routePath: routePath.length ? routePath : fallbackSegments.routePath,
  };
}
