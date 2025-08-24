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
      query: ({ mes, anio, id_sucursal } = {}) => ({
        url: "/analisis/productos",
        params: {
          mes,
          anio,
          ...(id_sucursal != null ? { id_sucursal } : {}),
        },
      }),
      providesTags: ["ProductoEstadisticas"],
    }),
    getKpiProductoPorFecha: builder.query({
      query: ({ id_sucursal } = {}) => ({
        url: "/analisis/productos/kpi-hoy",
        params: id_sucursal != null ? { id_sucursal } : undefined,
      }),

      providesTags: ["ProductoEstadisticas"],
    }),
    getResumenProductosPorFecha: builder.query({
      query: (arg) => {
        if (typeof arg === "string") {
          return {
            url: "/analisis/productos/resumen-por-fecha",
            params: { fecha: arg },
          };
        }
        const { fecha, id_sucursal } = arg || {};
        return {
          url: "/analisis/productos/resumen-por-fecha",
          params: {
            fecha,
            ...(id_sucursal != null ? { id_sucursal } : {}),
          },
        };
      },
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
