import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  severity: "info", // 'success', 'error', 'warning', 'info'
  duration: 3000,
};

const notificacionSlice = createSlice({
  name: "notificacion",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      const { message, severity = "info", duration = 3000 } = action.payload;
      state.open = true;
      state.message = message;
      state.severity = severity;
      state.duration = duration;
    },
    closeNotification: (state) => {
      state.open = false;
    },
  },
});

export const { showNotification, closeNotification } = notificacionSlice.actions;

export default notificacionSlice.reducer;
