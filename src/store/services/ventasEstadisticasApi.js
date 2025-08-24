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
      query: ({ mes, anio, id_sucursal } = {}) => ({
        url: "/analisis/ventas",
        params: {
          mes,
          anio,
          ...(id_sucursal != null ? { id_sucursal } : {}),
        },
      }),
      providesTags: ["VentasEstadisticas"],
    }),
    getKpiVentasPorFecha: builder.query({
      query: (params) => ({ url: `/analisis/ventas/kpi-hoy`, params }),
      providesTags: ["VentasEstadisticas"],
    }),
    getVentasResumenSemanal: builder.query({
      query: (/* { id_sucursal } = {} */) => ({
        url: "/analisis/ventas/resumen-semanal",
        // params: id_sucursal != null ? { id_sucursal } : undefined,
      }),
    }),

    getVentasTendenciaMensual: builder.query({
      query: ({ anio, id_sucursal } = {}) => ({
        url: "/analisis/ventas/tendencia-mensual",
        params: {
          anio,
          ...(id_sucursal != null ? { id_sucursal } : {}),
        },
      }),
      providesTags: ["VentasEstadisticas"],
    }),

    getResumenVentasPorTipoEntrega: builder.query({
      query: ({ fecha, id_sucursal } = {}) => ({
        url: "/analisis/ventas/resumen-por-tipo-entrega",
        params: {
          fecha,
          ...(id_sucursal != null ? { id_sucursal } : {}),
        },
      }),
      providesTags: ["VentasEstadisticas"],
    }),
  }),
});

export const {
  useGenerarVentasEstadisticasMutation,
  useGetVentasEstadisticasPorMesQuery,
  useGetKpiVentasPorFechaQuery,
  useGetVentasResumenSemanalQuery,
  useGetVentasTendenciaMensualQuery,
  useGetResumenVentasPorTipoEntregaQuery,
} = ventasEstadisticasApi;
