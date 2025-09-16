import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const compraApi = createApi({
  reducerPath: "compraApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Compra"],
  endpoints: (builder) => ({
    getCompraById: builder.query({
      query: (id) => `/costos/compras/${id}`,
      providesTags: ["Compra"],
    }),
    getAllCompras: builder.query({
      query: (params) => ({
        url: `/costos/compras/`,
        params,
      }),
      providesTags: ["Compra"],
    }),
    createCompra: builder.mutation({
      query: (data) => ({
        url: `/costos/compras/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Compra"],
    }),
    recibirCompra: builder.mutation({
      query: ({ id, items }) => ({
        url: `/costos/compras/${id}/recibir`,
        method: "POST",
        body: { items },
      }),
      invalidatesTags: ["Compra"],
    }),
    updateCompra: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/costos/compras/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Compra"],
    }),
    deleteCompra: builder.mutation({
      query: (id) => ({
        url: `/costos/compras/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Compra"],
    }),
  }),
});

export const {
  useGetCompraByIdQuery,
  useGetAllComprasQuery,
  useCreateCompraMutation,
  useRecibirCompraMutation,
  useUpdateCompraMutation,
  useDeleteCompraMutation,
} = compraApi;
