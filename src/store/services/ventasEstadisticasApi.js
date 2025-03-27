import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const ventasEstadisticasApi = createApi({
  reducerPath: "ventasEstadisticas",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["VentasEstadisticas"],
  endpoints: (builder) => ({
    generarVentasEstadisticas: builder.mutation({
      query: (body) => ({
        url: "/analisis/ventas/generar",
        method: "POST",
        body,
      }),
      invalidatesTags: ["VentasEstadisticas"],
    }),

    getVentasEstadisticasPorMes: builder.query({
      query: ({ mes, anio }) => `/analisis/ventas?mes=${mes}&anio=${anio}`,
      providesTags: ["VentasEstadisticas"],
    }),
    getKpiVentasPorFecha: builder.query({
      query: () => "/analisis/ventas/kpi-hoy",
      providesTags: ["VentasEstadisticas"],
    }),
    getVentasResumenSemanal: builder.query({
      query: () => "/analisis/ventas/resumen-semanal",
    }),
  }),
});

export const {
  useGenerarVentasEstadisticasMutation,
  useGetVentasEstadisticasPorMesQuery,
  useGetKpiVentasPorFechaQuery,
  useGetVentasResumenSemanalQuery
} = ventasEstadisticasApi;
