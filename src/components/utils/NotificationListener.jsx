import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import { addNotificacion } from "../../store/reducers/notificacionesSlice";
import {
  emitRefetchMisPedidos,
  emitRefetchAgendaViajes,
} from "../../utils/eventBus";
import { agendaViajesApi } from "../../store/services/agendaViajesApi";
import { playNotificationSound } from "../../utils/playNotificationSound";
import { vibrateNotification } from "../../utils/vibrateNotification";
import { entregasApi } from "../../store/services/entregasApi";

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
      if (data?.tipo === "pedido_entregado") {
        const idAgenda = data?.datos_adicionales?.id_agenda_viaje;
        if (idAgenda) {
          dispatch(
            entregasApi.util.invalidateTags([
              { type: "Entrega", id: "LIST" },
              { type: "Entrega", id: `AGENDA-${idAgenda}` },
            ])
          );
          dispatch(
            agendaViajesApi.util.invalidateTags([
              { type: "AgendaViajes", id: idAgenda },
            ])
          );
        } else {
          dispatch(entregasApi.util.invalidateTags(["Entrega"]));
          dispatch(agendaViajesApi.util.invalidateTags(["AgendaViajes"]));
        }
      }
      if (data?.tipo === "pedido_confirmado") {
        if (data?.datos_adicionales?.id_agenda_viaje) {
          dispatch(
            agendaViajesApi.util.invalidateTags([
              {
                type: "AgendaViajes",
                id: data.datos_adicionales.id_agenda_viaje,
              },
            ])
          );
        } else {
          dispatch(agendaViajesApi.util.invalidateTags(["AgendaViajes"]));
        }
      }
      console.log("📡 WS: Recibido evento", data);
      dispatch(addNotificacion(data));
      playNotificationSound();
      vibrateNotification();
    });

    socket.on("actualizar_mis_pedidos", () => {
      console.log("📡 WS: Recibido evento 'actualizar_mis_pedidos'");
      emitRefetchMisPedidos();
      playNotificationSound();
      vibrateNotification();
    });

    socket.on("actualizar_agenda_chofer", () => {
      console.log("📡 WS: Recibido evento 'actualizar_agenda_chofer'");
      emitRefetchAgendaViajes();
      dispatch(agendaViajesApi.util.invalidateTags(["AgendaViajes"]));
      playNotificationSound();
    });

    socket.on("pedido_revertido", () => {
      dispatch(agendaViajesApi.util.invalidateTags(["AgendaViajes"]));
      playNotificationSound();
      vibrateNotification();
    });

    socket.on("viaje_finalizado", (data) => {
      dispatch(
        agendaViajesApi.util.invalidateTags([
          "AgendaViajes",
          "Camion",
          "InventarioCamion",
        ])
      );
      dispatch(
        addNotificacion({
          ...data,
          tipo: "viaje_finalizado",
        })
      );
      playNotificationSound();
      vibrateNotification();
    });

    socket.on("entrega_registrada", (data) => {
      dispatch(
        entregasApi.util.invalidateTags([
          { type: "Entrega", id: "LIST" },
          { type: "Entrega", id: `AGENDA-${data?.id_agenda_viaje}` },
        ])
      );
      dispatch(agendaViajesApi.util.invalidateTags(["AgendaViajes"]));
      dispatch(
        addNotificacion({
          ...data,
          tipo: "entrega_registrada",
        })
      );
      playNotificationSound();
      vibrateNotification();
    });

    return () => {
      socket.off("nueva_notificacion");
      socket.off("actualizar_mis_pedidos");
      socket.off("actualizar_agenda_chofer");
      socket.off("pedido_revertido");
      socket.off("viaje_finalizado");
      socket.off("entrega_registrada");
    };
  }, [isAuthenticated, user, dispatch]);

  return null;
}

export default NotificationListener;
