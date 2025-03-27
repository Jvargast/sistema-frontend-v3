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

    // Obtener producto por ID
    getProductoById: builder.query({
      query: (id) => `/productos/${id}`,
      providesTags: ["Producto"],
    }),

    // Crear un nuevo producto
    createProducto: builder.mutation({
      query: (newProducto) => ({
        url: "/productos/",
        method: "POST",
        body: newProducto,
      }),
      invalidatesTags: ["Producto"], // Invalidar caché de productos
    }),

    // Actualizar un producto existente
    updateProducto: builder.mutation({
      query: ({ id, ...updatedProducto }) => ({
        url: `/productos/${id}`,
        method: "PUT",
        body: updatedProducto,
      }),
      invalidatesTags: ["Producto"], // Invalidar caché de productos
    }),

    // Eliminar un producto
    deleteProducto: builder.mutation({
      query: (id) => ({
        url: `/productos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Producto"], // Invalidar caché de productos
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

// Exportar hooks generados automáticamente
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
