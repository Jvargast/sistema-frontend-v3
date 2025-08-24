import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const productoApi = createApi({
  reducerPath: "productoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Producto", "Inventario"],
  endpoints: (builder) => ({
    getAllProductos: builder.query({
      query: (params) => ({
        url: `/productos/`,
        params,
      }),
      providesTags: (result) =>
        result?.productos
          ? [
              { type: "Producto", id: "LIST" },
              ...result.productos.map((p) => ({
                type: "Producto",
                id: p.id_producto,
              })),
            ]
          : [{ type: "Producto", id: "LIST" }],
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
      providesTags: (result, error, arg) =>
        result?.productos
          ? [
              ...result.productos.map((p) => ({
                type: "Inventarios",
                id: `${p.id_producto}-${arg.id_sucursal}`,
              })),
              { type: "Inventarios", id: `LIST-${arg.id_sucursal}` },
            ]
          : [{ type: "Inventarios", id: `LIST-${arg.id_sucursal}` }],
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
      query: ({ id, data }) => ({
        url: `/productos/${id}`,
        method: "PUT",
        body: data,
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
