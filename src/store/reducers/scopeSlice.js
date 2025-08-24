import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

const initialState = {
  activeSucursalId: null,
  mode: "sucursal",
  
};

const scopeSlice = createSlice({
  name: "scope",
  initialState,
  reducers: {
    setActiveSucursal(state, action) {
      state.activeSucursalId = action.payload;
    },
    setScopeMode(state, action) {
      state.mode = action.payload;
    },
    resetScope() {
      return initialState;
    },
    hydrateScope(state, action) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setActiveSucursal, setScopeMode, resetScope, hydrateScope } =
  scopeSlice.actions;
export default scopeSlice.reducer;

export const selectScope = (state) => state.scope;
export const selectActiveSucursalId = (state) => state.scope.activeSucursalId;
export const selectScopeMode = (state) => state.scope.mode;
