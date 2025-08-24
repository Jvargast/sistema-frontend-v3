import { createSlice } from "@reduxjs/toolkit";
import { setActiveSucursal, setScopeMode, resetScope } from "./scopeSlice";

const initialState = {
  isAuthenticated: false,
  user: null,
  rol: null,
  permisos: [],
  isLoading: true,
  token: null,
  syncCompleted: false,
};

export const SCOPE_STORAGE_KEY = "app_scope";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { usuario, rol, permisos } = action.payload;
      state.isAuthenticated = true;
      state.user = usuario;
      state.rol = typeof rol === "string" ? rol : rol?.nombre || "";
      state.permisos = Array.isArray(permisos) ? permisos : [];
      state.isLoading = false;
      state.syncCompleted = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.rol = null;
      state.permisos = [];
      state.isLoading = false;
      state.syncCompleted = true;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

const flattenPerms = (source) =>
  (Array.isArray(source) ? source : [])
    .map((p) => {
      if (typeof p === "string") return p;
      if (typeof p?.nombre === "string") return p.nombre;
      if (typeof p?.permiso === "string") return p.permiso;
      if (typeof p?.permiso?.nombre === "string") return p.permiso.nombre;
      return null;
    })
    .filter(Boolean);

export const finishLogin = (server) => (dispatch) => {
  const usuario = server?.usuario || null;

  const rolNombre =
    usuario?.rol?.nombre ||
    server?.rol?.nombre ||
    (typeof server?.rol === "string" ? server.rol : "") ||
    "";

  const permisos =
    flattenPerms(server?.permisos) || flattenPerms(usuario?.rol?.rolesPermisos);

  dispatch(setUser({ usuario, rol: rolNombre, permisos }));

  const rolLower = rolNombre.toLowerCase();
  if (rolLower !== "administrador") {
    dispatch(setScopeMode("sucursal"));
    const idSuc =
      usuario?.Sucursal?.id_sucursal ?? usuario?.id_sucursal ?? null;
    dispatch(setActiveSucursal(idSuc));
  }
  // else {
  //   dispatch(setScopeMode("global"));
  //   dispatch(setActiveSucursal(null));
  // }
};

export const logoutAndResetScope = () => (dispatch) => {
  dispatch(logout());
  dispatch(resetScope());
  try {
    localStorage.removeItem(SCOPE_STORAGE_KEY);
  } catch {
    // Intentionally ignore errors when removing from localStorage
  }
};

export const resetCacheAndLogout = () => (dispatch) => {
  dispatch(logoutAndResetScope());
};
