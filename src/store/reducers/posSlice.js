import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendorRut: null,
  caja: null,
  ts: null,
};

const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    setVendorRut(state, action) {
      state.vendorRut = action.payload;
      state.ts = Date.now();
    },
    setCaja(state, action) {
      state.caja = action.payload;
      state.ts = Date.now();
    },
    clearPOS(state) {
      state.vendorRut = null;
      state.caja = null;
      state.ts = Date.now();
    },
  },
});

export const { setVendorRut, setCaja, clearPOS } = posSlice.actions;
export default posSlice.reducer;
