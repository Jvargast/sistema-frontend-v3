import { featureCollection, nearestPoint, point } from "@turf/turf";


export function ordenarDestinosPorCercania(destinos, inicio = null) {
  if (!destinos.length) return [];
  let restantes = [...destinos];
  let ruta = [];

  let actual;
  if (Array.isArray(inicio)) {
    actual = { lat: inicio[1], lng: inicio[0] };
  } else if (inicio && inicio.lat && inicio.lng) {
    actual = { lat: inicio.lat, lng: inicio.lng }; 
  } else {
    actual = restantes[0];
  }
  ruta.push(actual);
  restantes = restantes.filter(
    (d) => !(d.lat === actual.lat && d.lng === actual.lng)
  );

  while (restantes.length > 0) {
    const from = point([actual.lng, actual.lat]);
    const toFeatures = featureCollection(
      restantes.map((d) => point([d.lng, d.lat], d))
    );
    const closest = nearestPoint(from, toFeatures);
    const destinoMasCercano = restantes.find(
      (d) =>
        d.lat === closest.geometry.coordinates[1] &&
        d.lng === closest.geometry.coordinates[0]
    );
    ruta.push(destinoMasCercano);
    restantes = restantes.filter((d) => d !== destinoMasCercano);
    actual = destinoMasCercano;
  }
  return ruta;
}
