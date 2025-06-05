import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const productoApi = createApi({
  reducerPath: "productoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Producto"],
  endpoints: (builder) => ({
    getAllProductos: builder.query({
      query: (params) => ({
        url: `/productos/`,
        params,
      }),
      providesTags: ["Producto"],
      transformResponse: (response) => ({
        productos: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de productos", error);
        }
      },
    }),

    getAvailabreProductos: builder.query({
      query: (params) => ({
        url: `/productos/disponible`,
        params,
      }),
      providesTags: ["Producto"],
      transformResponse: (response) => ({
        productos: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de productos", error);
        }
      },
    }),
    getInventario: builder.query({
      query: (params) => ({
        url: `/productos/disponible`,
        params,
      }),
      providesTags: ["Producto"],
      transformResponse: (response) => ({
        productos: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de productos", error);
        }
      },
    }),

    getProductoById: builder.query({
      query: (id) => `/productos/${id}`,
      providesTags: ["Producto"],
    }),

    createProducto: builder.mutation({
      query: (newProducto) => ({
        url: "/productos/",
        method: "POST",
        body: newProducto,
      }),
      invalidatesTags: ["Producto"], 
    }),

    updateProducto: builder.mutation({
      query: ({ id, ...updatedProducto }) => ({
        url: `/productos/${id}`,
        method: "PUT",
        body: updatedProducto,
      }),
      invalidatesTags: ["Producto"], 
    }),

    deleteProducto: builder.mutation({
      query: (id) => ({
        url: `/productos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Producto"], 
    }),

    deleteProductos: builder.mutation({
      query: ({ ids }) => ({
        url: `/productos/`,
        method: "PATCH",
        body: { ids },
      }),
      invalidatesTags: ["Producto"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al borrar Productos: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllProductosQuery,
  useGetAvailabreProductosQuery,
  useGetInventarioQuery,
  useGetProductoByIdQuery,
  useCreateProductoMutation,
  useUpdateProductoMutation,
  useDeleteProductoMutation,
  useDeleteProductosMutation,
} = productoApi;
