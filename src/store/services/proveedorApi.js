import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const proveedorApi = createApi({
  reducerPath: "proveedorApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Proveedor"],
  endpoints: (builder) => ({
    getProveedorById: builder.query({
      query: (id) => ({ url: `/costos/proveedores/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Proveedor", id }],
    }),
    getAllProveedores: builder.query({
      query: (params) => ({
        url: `/costos/proveedores/`,
        params,
      }),
      providesTags: ["Proveedor"],
    }),
    createProveedor: builder.mutation({
      query: (data) => ({
        url: `/costos/proveedores/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Proveedor"],
    }),
    updateProveedor: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/costos/proveedores/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Proveedor", id },
        { type: "Proveedor", id: "LIST" },
      ],
    }),
    deleteProveedor: builder.mutation({
      query: (id) => ({
        url: `/costos/proveedores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Proveedor"],
    }),
  }),
});

export const {
  useGetProveedorByIdQuery,
  useLazyGetAllProveedoresQuery,
  useGetAllProveedoresQuery,
  useCreateProveedorMutation,
  useUpdateProveedorMutation,
  useDeleteProveedorMutation,
} = proveedorApi;
