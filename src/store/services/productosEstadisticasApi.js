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
  }),
});

export const {
  useGenerarProductoEstadisticasMutation,
  useGetProductoEstadisticasPorMesQuery,
} = productosEstadisticasApi;
