import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const productosEstadisticasApi = createApi({
  reducerPath: "productoEstadisticas",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["ProductoEstadisticas"],
  endpoints: (builder) => ({
    generarProductoEstadisticas: builder.mutation({
      query: (body) => ({
        url: "/analisis/productos/generar",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProductoEstadisticas"],
    }),

    getProductoEstadisticasPorMes: builder.query({
      query: ({ mes, anio }) => `/analisis/productos?mes=${mes}&anio=${anio}`,
      providesTags: ["ProductoEstadisticas"],
    }),
    getKpiProductoPorFecha: builder.query({
      query: () => "/analisis/productos/kpi-hoy",
      providesTags: ["ProductoEstadisticas"],
    }),
    getResumenProductosPorFecha: builder.query({
      query: (fecha) => `/analisis/productos/resumen-por-fecha?fecha=${fecha}`,
      providesTags: ["ProductoEstadisticas"],
    }),
  }),
});

export const {
  useGenerarProductoEstadisticasMutation,
  useGetProductoEstadisticasPorMesQuery,
  useGetKpiProductoPorFechaQuery,
  useGetResumenProductosPorFechaQuery,
} = productosEstadisticasApi;
