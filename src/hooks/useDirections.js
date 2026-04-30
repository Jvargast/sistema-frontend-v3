import { useEffect, useState } from "react";
import {
  buildFallbackRoutePath,
  computeGoogleRoute,
  isValidRoutePoint,
} from "../utils/googleRoutesApi";

export function useDirections(ruta) {
  const [routePath, setRoutePath] = useState([]);

  useEffect(() => {
    if (
      !ruta ||
      ruta.length < 2 ||
      ruta.some((point) => !isValidRoutePoint(point))
    ) {
      setRoutePath([]);
      return;
    }

    const controller = new AbortController();
    const origin = ruta[0];
    const destination = ruta[ruta.length - 1];
    const intermediates = ruta.slice(1, -1);

    computeGoogleRoute({
      origin,
      destination,
      intermediates,
      signal: controller.signal,
    })
      .then(({ path }) => {
        setRoutePath(path.length ? path : buildFallbackRoutePath(ruta));
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        console.warn("Error al calcular ruta con Google Routes API:", error);
        setRoutePath(buildFallbackRoutePath(ruta));
      });

    return () => controller.abort();
  }, [ruta]);

  return routePath;
}
