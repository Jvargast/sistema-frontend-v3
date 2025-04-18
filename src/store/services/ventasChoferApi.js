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
      query: (params) => ({
        url: "/ventas-chofer/",
        params,
      }),
      providesTags: ["VentasChofer"],
    }),

    getMisVentasChofer: builder.query({
      query: (params) => ({
        url: "/ventas-chofer/misventas",
        params,
      }),
      providesTags: ["VentasChofer"],
    }),

    getVentaChoferById: builder.query({
      query: (id) => `/ventas-chofer/venta/${id}`,
      providesTags: (result, error, id) => [{ type: "VentasChofer", id }],
    }),
  }),
});

export const { useRealizarVentaRapidaMutation, useGetVentasChoferQuery, useGetMisVentasChoferQuery, useGetVentaChoferByIdQuery } =
  ventasChoferApi;
