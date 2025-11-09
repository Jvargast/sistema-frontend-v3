import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";
import { productoApi } from "./productoApi";

export const ventasApi = createApi({
  reducerPath: "ventasApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Ventas", "Inventario"],
  endpoints: (builder) => ({
    getAllVentas: builder.query({
      query: (params) => ({ url: `/ventas/`, params }),
      providesTags: ["Ventas"],
      transformResponse: (response) => ({
        ventas: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de ventas:", error);
        }
      },
    }),

    getVentaById: builder.query({
      query: (id) => `/ventas/${id}`,
      providesTags: ["Ventas"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la venta:", error);
        }
      },
    }),

    createVenta: builder.mutation({
      query: (newVenta) => ({
        url: `/ventas/`,
        method: "POST",
        body: newVenta,
      }),
      invalidatesTags: (result, error, arg) =>
        error
          ? []
          : [
              { type: "Inventario", id: `LIST-${arg.id_sucursal}` },
              ...(arg.productos || []).map((p) => ({
                type: "Inventario",
                id: `${p.id_producto}-${arg.id_sucursal}`,
              })),
              "Ventas",
            ],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const suc = args.id_sucursal;
          dispatch(
            productoApi.util.invalidateTags([
              { type: "Inventario", id: `LIST-${suc}` },
              ...args.productos.map((p) => ({
                type: "Inventario",
                id: `${p.id_producto}-${suc}`,
              })),
            ])
          );
          dispatch(
            productoApi.util.invalidateTags([
              { type: "Producto", id: "LIST" },
              ...args.productos.map((p) => ({
                type: "Producto",
                id: p.id_producto,
              })),
            ])
          );
        } catch (error) {
          console.error("Error al crear la venta:", error);
        }
      },
    }),

    updateVenta: builder.mutation({
      query: ({ id, ...updatedVenta }) => ({
        url: `/ventas/${id}`,
        method: "PUT",
        body: updatedVenta,
      }),
      invalidatesTags: ["Ventas"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Venta actualizada correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar la venta:", error);
        }
      },
    }),

    rejectVenta: builder.mutation({
      query: (id) => ({
        url: `/ventas/${id}/rechazar`,
        method: "PUT",
      }),
      invalidatesTags: ["Ventas"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al rechazar la venta:", error);
        }
      },
    }),

    deleteVenta: builder.mutation({
      query: (id) => ({
        url: `/ventas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ventas"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al eliminar la venta:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllVentasQuery,
  useGetVentaByIdQuery,
  useCreateVentaMutation,
  useUpdateVentaMutation,
  useRejectVentaMutation,
  useDeleteVentaMutation,
} = ventasApi;
