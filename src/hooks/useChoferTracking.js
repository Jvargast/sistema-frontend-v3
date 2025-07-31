import { useEffect, useRef } from "react";
import { socket } from "../socket";

export function useChoferTracking({ viajeActivo, rut }) {
  const watcherRef = useRef(null);

  useEffect(() => {
    if (!viajeActivo || !rut) {
      if (watcherRef.current) {
        navigator.geolocation.clearWatch(watcherRef.current);
      }
      return;
    }

    if (!("geolocation" in navigator)) return;
    console.log("useChoferTracking - entrada")

    watcherRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        socket.emit("ubicacion_chofer", {
          rut,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: pos.timestamp,
        });
        console.log("Emitida ubicacion_chofer", rut, pos.coords);
      },
      (err) => {
        console.warn("Error de geolocalización:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10 * 1000,
        timeout: 15 * 1000,
      }
    );

    return () => {
      if (watcherRef.current) {
        navigator.geolocation.clearWatch(watcherRef.current);
      }
    };
  }, [viajeActivo, rut]);
}
