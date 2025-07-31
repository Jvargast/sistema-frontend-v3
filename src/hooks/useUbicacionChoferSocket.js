import { useEffect, useState } from "react";
import { socket } from "../socket";

export function useUbicacionChoferTiempoReal(rut) {
  const [ubicacion, setUbicacion] = useState(null);

  useEffect(() => {
    function onUbicacion(data) {
      console.log(
        "[SOCKET] Recibido ubicacion_chofer:",
        data,
        "Esperando:",
        rut
      );
      if (`${data.rut}` === `${rut}`) setUbicacion(data);
    }
    socket.on("ubicacion_chofer", onUbicacion);
    return () => socket.off("ubicacion_chofer", onUbicacion);
  }, [rut]);

  return ubicacion;
}
