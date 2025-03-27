import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const auditLogsApi = createApi({
  reducerPath: "auditLogsApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["AuditLogs"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener todos los roles
    getLogs: builder.query({
      query: (params) => ({ url: `/audit-logs/`, params }),
      providesTags: ["AuditLogs"], // Para invalidar cache
      transformResponse: (response) => ({
        auditLogs: response.data, // Datos de logs
        paginacion: response.total, // Datos de paginación
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de roles:", error);
        }
      },
    }),
  }),
});

// Exporta los hooks generados automáticamente
export const { useGetLogsQuery } = auditLogsApi;

