import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const ventasApi = createApi({
  reducerPath: "ventasApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Ventas"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener todas las ventas
    getAllVentas: builder.query({
      query: (params) => ({ url: `/ventas/`, params }),
      providesTags: ["Ventas"], // Para invalidar cache
      transformResponse: (response) => ({
        ventas: response.data, // Datos de ventas
        paginacion: response.total, // Datos de paginación
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de ventas:", error);
        }
      },
    }),

    // Obtener un venta por ID
    getVentaById: builder.query({
      query: (id) => `/ventas/${id}`,
      providesTags: ["Ventas"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener el rol:", error);
        }
      },
    }),

    // Crear un rol
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
          console.error("Error al crear el venta:", error);
        }
      },
    }),

    // Actualizar un rol
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
          console.log("Rol actualizado correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar el venta:", error);
        }
      },
    }),

    // Eliminar un rol
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
  useDeleteVentaMutation,
} = ventasApi;

