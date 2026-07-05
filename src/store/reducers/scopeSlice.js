import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

const initialState = {
  activeSucursalId: null,
  mode: "sucursal",
  transition: {
    isChanging: false,
    requestId: null,
    targetLabel: "",
    targetMode: "sucursal",
  },
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
    startScopeTransition(state, action) {
      state.transition = {
        isChanging: true,
        requestId: action.payload?.requestId ?? null,
        targetLabel: action.payload?.targetLabel ?? "",
        targetMode: action.payload?.targetMode ?? state.mode,
      };
    },
    finishScopeTransition(state, action) {
      if (
        action.payload?.requestId &&
        state.transition?.requestId !== action.payload.requestId
      ) {
        return;
      }

      state.transition = {
        ...(state.transition || initialState.transition),
        isChanging: false,
      };
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

export const {
  setActiveSucursal,
  setScopeMode,
  startScopeTransition,
  finishScopeTransition,
  resetScope,
  hydrateScope,
} = scopeSlice.actions;
export default scopeSlice.reducer;

export const selectScope = (state) => state.scope;
export const selectActiveSucursalId = (state) => state.scope.activeSucursalId;
export const selectScopeMode = (state) => state.scope.mode;
export const selectScopeTransition = (state) =>
  state.scope?.transition ?? initialState.transition;
