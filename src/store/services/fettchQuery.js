import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../reducers/authSlice";
import { apiUrl } from "./apiBase";

function getScope(state) {
  const role = state?.auth?.rol?.nombre || state?.auth?.rol;
  const isAdmin = role === "administrador";

  const activeSucursalId =
    state?.scope?.activeSucursalId ?? state?.auth?.user?.id_sucursal ?? null;

  const mode = state?.scope?.mode || "sucursal";
  return { activeSucursalId, mode, isAdmin };
}

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl || "http://localhost:3000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const token = state?.auth?.token;
    if (token) headers.set("authorization", `Bearer ${token}`);

    const { activeSucursalId, mode, isAdmin } = getScope(state);
    if (activeSucursalId != null) {
      headers.set("x-sucursal-id", String(activeSucursalId));
    }
    if (isAdmin && mode) {
      headers.set("x-scope-mode", mode);
    }

    return headers;
  },
});

export const baseQueryWithReauthEnhanced = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.warn("Token expirado, intentando renovar...");

    try {
      const refreshResult = await baseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        console.log(
          "Token renovado exitosamente, reintentando la solicitud..."
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.error("No se pudo renovar el token, cerrando sesión...");
        api.dispatch(logout());
      }
    } catch (error) {
      console.error("Error crítico durante la renovación del token:", error);
      api.dispatch(logout());
    }
  }

  return result;
};
