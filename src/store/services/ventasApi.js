import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const ventasApi = createApi({
  reducerPath: "ventasApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Ventas"],
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
          console.error("Error al obtener la venta:", error); // aquí corregido
        }
      },
    }),

    createVenta: builder.mutation({
      query: (newVenta) => ({
        url: `/ventas/`,
        method: "POST",
        body: newVenta,
      }),
      invalidatesTags: ["Ventas"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al crear la venta:", error); // aquí corregido
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
          console.log("Venta actualizada correctamente:", data); // aquí corregido
        } catch (error) {
          console.error("Error al actualizar la venta:", error); // aquí corregido
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
          console.error("Error al eliminar la venta:", error); // aquí corregido
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
