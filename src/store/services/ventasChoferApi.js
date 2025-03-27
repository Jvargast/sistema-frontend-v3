import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const ventasChoferApi = createApi({
  reducerPath: "ventasChoferApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["VentasChofer"],
  endpoints: (builder) => ({
    realizarVentaRapida: builder.mutation({
      query: (data) => ({
        url: "/ventas-chofer/rapida",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["InventarioCamion"],
    }),

    getVentasChofer: builder.query({
      query: () => ({
        url: "/ventas-chofer/",
      }),
      providesTags: ["VentasChofer"],
    }),
  }),
});

export const { useRealizarVentaRapidaMutation, useGetVentasChoferQuery } =
  ventasChoferApi;
