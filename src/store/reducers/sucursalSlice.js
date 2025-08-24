import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sucursalActiva: null, 
};

const sucursalSlice = createSlice({
  name: "sucursal",
  initialState,
  reducers: {
    setSucursalActiva: (state, action) => {
      state.sucursalActiva = action.payload;
    },
    clearSucursalActiva: (state) => {
      state.sucursalActiva = null;
    },
  },
});

export const { setSucursalActiva, clearSucursalActiva } = sucursalSlice.actions;
export default sucursalSlice.reducer;
