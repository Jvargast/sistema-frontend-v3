// NotificationListener.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import { addNotificacion } from "../../store/reducers/notificacionesSlice";
import { emitRefetchMisPedidos, emitRefetchAgendaViajes } from "../../utils/eventBus";

function NotificationListener() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("NotificationListener useEffect corriendo...");
    console.log("isAuthenticated:", isAuthenticated, " user.rut:", user?.id);
    if (!isAuthenticated || !user?.id) {
      console.log("No se cumplen condiciones para suscribirse");
      return;
    }

    console.log("Suscribiéndose al socket con rut:", user.id);
    socket.emit("subscribe", user.id);

    socket.on("nueva_notificacion", (data) => {
      console.log("📡 WS: Recibido evento", data);
      dispatch(addNotificacion(data));
    });

    socket.on("actualizar_mis_pedidos", () => {
      console.log("📡 WS: Recibido evento 'actualizar_mis_pedidos'");
      emitRefetchMisPedidos(); 
    });

    socket.on("actualizar_agenda_chofer", () => {
      console.log("📡 WS: Recibido evento 'actualizar_agenda_chofer'");
      emitRefetchAgendaViajes();
    });

    return () => {
      socket.off("nueva_notificacion");
      socket.off("actualizar_mis_pedidos");
      socket.off("actualizar_agenda_chofer");
    };
  }, [isAuthenticated, user, dispatch]);

  return null; // No renderiza nada en sí
}

export default NotificationListener;
