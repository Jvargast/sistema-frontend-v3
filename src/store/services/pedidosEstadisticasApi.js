import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const pedidosEstadisticasApi = createApi({
  reducerPath: "pedidosEstadisticas",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["PedidosEstadisticas"],
  endpoints: (builder) => ({
    generarPedidosEstadisticas: builder.mutation({
      query: (body) => ({
        url: "/analisis/pedidos/generar",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PedidosEstadisticas"],
    }),

    getPedidosEstadisticasPorMes: builder.query({
      query: ({ mes, anio }) => `/analisis/pedidos?mes=${mes}&anio=${anio}`,
      providesTags: ["PedidosEstadisticas"],
    }),
  }),
});

export const {
  useGenerarPedidosEstadisticasMutation,
  useGetPedidosEstadisticasPorMesQuery,
} = pedidosEstadisticasApi;
