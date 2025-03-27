import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  viaje: null,
  loading: false,
  error: null,
};

const agendaViajesSlice = createSlice({
  name: "agendaViajes",
  initialState,
  reducers: {
    setViaje: (state, action) => {
      state.viaje = action.payload;
    },
    clearViaje: (state) => {
      state.viaje = null;
    },
  },
});

export const { setViaje, clearViaje } = agendaViajesSlice.actions;
export default agendaViajesSlice.reducer;
