export function isValidRoutePoint(point) {
  return (
    point &&
    Number.isFinite(Number(point.lat)) &&
    Number.isFinite(Number(point.lng))
  );
}

export function buildFallbackRoutePath(points = []) {
  return points
    .filter(isValidRoutePoint)
    .map((point) => ({
      lat: Number(point.lat),
      lng: Number(point.lng),
    }));
}

function toLatLngLiteral(point) {
  return {
    lat: Number(point.lat),
    lng: Number(point.lng),
  };
}

function toRouteWaypoint(point) {
  return { location: toLatLngLiteral(point) };
}

function normalizeRoutePath(path = []) {
  return path
    .map((point) => {
      const lat = typeof point?.lat === "function" ? point.lat() : point?.lat;
      const lng = typeof point?.lng === "function" ? point.lng() : point?.lng;
      return { lat: Number(lat), lng: Number(lng) };
    })
    .filter(isValidRoutePoint);
}

function createAbortError() {
  const error = new Error("Solicitud de ruta cancelada.");
  error.name = "AbortError";
  return error;
}

export async function computeGoogleRoute({
  origin,
  destination,
  intermediates = [],
  optimizeWaypointOrder = false,
  signal,
} = {}) {
  if (!isValidRoutePoint(origin) || !isValidRoutePoint(destination)) {
    throw new Error("Origen o destino inválido para Routes API.");
  }

  if (signal?.aborted) {
    throw createAbortError();
  }

  if (!window.google?.maps?.importLibrary) {
    throw new Error("Maps JavaScript API no está cargada.");
  }

  const [{ Route }, { UnitSystem }] = await Promise.all([
    window.google.maps.importLibrary("routes"),
    window.google.maps.importLibrary("core"),
  ]);
  if (!Route?.computeRoutes) {
    throw new Error("La librería Routes de Maps JavaScript no está disponible.");
  }

  if (signal?.aborted) {
    throw createAbortError();
  }

  const { routes = [], fallbackInfo, geocodingResults } =
    await Route.computeRoutes({
      origin: toLatLngLiteral(origin),
      destination: toLatLngLiteral(destination),
      intermediates: intermediates
        .filter(isValidRoutePoint)
        .map(toRouteWaypoint),
      travelMode: "DRIVING",
      routingPreference: "TRAFFIC_AWARE",
      optimizeWaypointOrder,
      polylineQuality: "HIGH_QUALITY",
      language: "es-CL",
      region: "CL",
      units: UnitSystem.METRIC,
      fields: [
        "durationMillis",
        "distanceMeters",
        "path",
        "optimizedIntermediateWaypointIndices",
      ],
    });

  if (signal?.aborted) {
    throw createAbortError();
  }

  const route = routes[0];
  if (!route) {
    throw new Error("Routes API no devolvió rutas.");
  }

  return {
    data: { routes, fallbackInfo, geocodingResults },
    route,
    path: normalizeRoutePath(route.path),
    optimizedIntermediateWaypointIndex:
      route?.optimizedIntermediateWaypointIndices || [],
  };
}
