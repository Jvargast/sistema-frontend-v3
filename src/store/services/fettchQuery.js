import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../reducers/authSlice";
import { apiUrl } from "./apiBase";

// Define el baseQuery original con configuración estándar
const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl || "http://localhost:3000/api", // Define tu base URL
  credentials: "include", // Incluye automáticamente cookies
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; // Obtén el token desde el estado global
    if (token) {
      headers.set("authorization", `Bearer ${token}`); // Agrega el token al header de autorización
    }
    return headers;
  },
});

// Extiende baseQuery para manejar la renovación del token
export const baseQueryWithReauthEnhanced = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Si el token está expirado (401 Unauthorized), intenta renovar
  if (result.error && result.error.status === 401) {
    console.warn("Token expirado, intentando renovar...");

    try {
      // Llama a la ruta /auth/refresh-token para renovar el token
      const refreshResult = await baseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        console.log("Token renovado exitosamente, reintentando la solicitud...");
        // Si el token fue renovado, reintenta la solicitud original
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.error("Error al renovar el token, cerrando sesión...");
        api.dispatch(logout()); // Cierra sesión si la renovación falla
      }
    } catch (error) {
      console.error("Error crítico durante la renovación del token:", error);
      api.dispatch(logout()); // Cierra sesión en caso de error crítico
    }
  }

  return result;
};
