export function isValidRoutePoint(point) {
  if (
    !point ||
    !isValidCoordinateValue(point.lat) ||
    !isValidCoordinateValue(point.lng)
  ) {
    return false;
  }

  const lat = Number(point.lat);
  const lng = Number(point.lng);
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function buildFallbackRoutePath(points = []) {
  return points
    .filter(isValidRoutePoint)
    .map((point) => ({
      lat: Number(point.lat),
      lng: Number(point.lng),
    }));
}

export function mergeRoutePaths(...paths) {
  return paths
    .flat()
    .filter(isValidRoutePoint)
    .reduce((merged, point) => {
      const normalizedPoint = toLatLngLiteral(point);
      const lastPoint = merged[merged.length - 1];

      if (
        !lastPoint ||
        lastPoint.lat !== normalizedPoint.lat ||
        lastPoint.lng !== normalizedPoint.lng
      ) {
        merged.push(normalizedPoint);
      }

      return merged;
    }, []);
}

export function buildFallbackRouteSegments(origin, destinations = []) {
  const validDestinations = destinations.filter(isValidRoutePoint);
  const currentLegPath = validDestinations.length
    ? buildFallbackRoutePath([origin, validDestinations[0]])
    : [];
  const futureLegPath =
    validDestinations.length > 1
      ? buildFallbackRoutePath(validDestinations)
      : [];

  return {
    currentLegPath,
    futureLegPath,
    routePath: mergeRoutePaths(currentLegPath, futureLegPath),
  };
}

function isValidCoordinateValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return Number.isFinite(Number(value));
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
