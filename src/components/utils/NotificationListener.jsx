// NotificationListener.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import { addNotificacion } from "../../store/reducers/notificacionesSlice";

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
      console.log("Notificación WS recibida:", data);
      dispatch(addNotificacion(data));
    });

    return () => {
      socket.off("nueva_notificacion");
    };
  }, [isAuthenticated, user, dispatch]);

  return null; // No renderiza nada en sí
}

export default NotificationListener;
