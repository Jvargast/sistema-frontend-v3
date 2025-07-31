export async function ordenarDestinosConGoogle(destinos, origen) {
  if (!destinos?.length || !origen || !window?.google?.maps) {
    return { ordenados: destinos, directions: null };
  }

  const destinosValidos = destinos.filter(
    (d) =>
      typeof d.lat === "number" &&
      isFinite(d.lat) &&
      typeof d.lng === "number" &&
      isFinite(d.lng)
  );
  if (!destinosValidos.length) {
    return { ordenados: destinos, directions: null };
  }

  const directionsService = new window.google.maps.DirectionsService();

  const destination = destinos[destinos.length - 1];
  const waypoints = destinos.slice(0, -1).map((d) => ({
    location: new window.google.maps.LatLng(d.lat, d.lng),
    stopover: true,
  }));

  const result = await new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origen.lat, origen.lng),
        destination: new window.google.maps.LatLng(
          destination.lat,
          destination.lng
        ),
        waypoints,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") resolve(response);
        else reject(new Error("Error en Directions API: " + status));
      }
    );
  });

  if (!result.routes[0].waypoint_order) {
    return { ordenados: destinos, directions: result };
  }

  const order = result.routes[0].waypoint_order;
  const reordenados = order.map((i) => destinos[i]);
  reordenados.push(destination);

  return { ordenados: reordenados, directions: result };
}
