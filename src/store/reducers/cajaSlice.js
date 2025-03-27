import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cajaAsignada: null,
  cajaAbierta: false, 
};

const cajaSlice = createSlice({
  name: "caja",
  initialState,
  reducers: {
    setCajaAsignada: (state, action) => {
      state.cajaAsignada = action.payload;
    },
    setCajaAbierta: (state, action) => {
      state.cajaAbierta = action.payload;
    },
    clearCaja: (state) => {
      state.cajaAsignada = null;
      state.cajaAbierta = false;
    },
  },
});

export const { setCajaAsignada, setCajaAbierta, clearCaja } = cajaSlice.actions;
export default cajaSlice.reducer;
