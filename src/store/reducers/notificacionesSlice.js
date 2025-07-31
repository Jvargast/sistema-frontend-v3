// notificacionesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificacionesSlice = createSlice({
  name: "notificaciones",
  initialState: {
    items: [],
    // Podrías guardar { id_notificacion, mensaje, fecha, leida, tipo, etc. }
  },
  reducers: {
    addNotificacion: (state, action) => {
      // Agregamos la nueva notificación al principio
      state.items.unshift(action.payload);
    },
    markAllAsRead: (state) => {
      // Ejemplo de marcar todas como leídas
      state.items.forEach((notif) => {
        notif.leida = true;
      });
    },
    clearNotificaciones: (state) => {
      state.items = [];
    },
    removeNotificacionById: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(
        (notif) => notif.id_notificacion !== id && notif.id !== id
      );
    },
  },
});

export const {
  addNotificacion,
  markAllAsRead,
  clearNotificaciones,
  removeNotificacionById,
} = notificacionesSlice.actions;

export default notificacionesSlice.reducer;
