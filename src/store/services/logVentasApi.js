import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const logVentasApi = createApi({
  reducerPath: "LogVentasApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["LogVentas"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener todos los roles
    getAllLogs: builder.query({
      query: (params) => ({ url: `/log-ventas/`, params }),
      providesTags: ["LogVentas"], // Para invalidar cache
      transformResponse: (response) => ({
        logs: response.data, // Datos de logs
        paginacion: response.total, // Datos de paginación
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de logs:", error);
        }
      },
    }),
  }),
});

// Exporta los hooks generados automáticamente
export const { useGetAllLogsQuery } = logVentasApi;