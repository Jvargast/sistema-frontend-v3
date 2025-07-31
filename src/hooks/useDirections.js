import { useEffect, useState } from "react";

function isValidLatLng(lat, lng) {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
}

export function useDirections(ruta) {
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (
      !ruta ||
      ruta.length < 2 ||
      !window.google ||
      ruta.some((p) => !isValidLatLng(p.lat, p.lng))
    ) {
      setDirections(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    const origin = { lat: Number(ruta[0].lat), lng: Number(ruta[0].lng) };
    const destination = {
      lat: Number(ruta[ruta.length - 1].lat),
      lng: Number(ruta[ruta.length - 1].lng),
    };
    const waypoints = ruta.slice(1, -1).map((p) => ({
      location: { lat: Number(p.lat), lng: Number(p.lng) },
      stopover: true,
    }));
    

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: false,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") setDirections(result);
        else setDirections(null);
      }
    );
  }, [ruta]);

  return directions;
}
