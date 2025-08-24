import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const inventarioApi = createApi({
  reducerPath: "inventarioApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Inventarios"],
  endpoints: (builder) => ({
    getAllInventarios: builder.query({
      query: () => "/inventarios/",
      providesTags: ["Inventarios"],
    }),

    getInventarioByProductoId: builder.query({
      query: (id_producto) => `/inventarios/${id_producto}`,
      providesTags: ["Inventarios"],
    }),

    createInventario: builder.mutation({
      query: (body) => ({
        url: "/inventarios/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Inventarios"],
    }),

    crearInventarioSucursal: builder.mutation({
      query: (body) => ({
        url: "/inventarios/por-sucursal",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Inventarios"],
    }),

    ajustarCantidad: builder.mutation({
      query: ({ id_producto, ...body }) => ({
        url: `/inventarios/${id_producto}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Inventarios"],
    }),

    deleteInventario: builder.mutation({
      query: (id_producto) => ({
        url: `/inventarios/${id_producto}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventarios"],
    }),
  }),
});

export const {
  useGetAllInventariosQuery,
  useGetInventarioByProductoIdQuery,
  useCreateInventarioMutation,
  useCrearInventarioSucursalMutation,
  useAjustarCantidadMutation,
  useDeleteInventarioMutation,
} = inventarioApi;
