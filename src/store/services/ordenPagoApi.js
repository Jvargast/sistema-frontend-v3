import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const ordenPagoApi = createApi({
  reducerPath: "ordenPagoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["OrdenPago"],
  endpoints: (builder) => ({
    getAllOrdenesPago: builder.query({
      query: (params) => ({
        url: `/costos/ordenes-pago/`,
        params,
      }),
      providesTags: ["OrdenPago"],
    }),

    getOrdenPagoById: builder.query({
      query: (id) => `/costos/ordenes-pago/${id}`,
      providesTags: ["OrdenPago"],
    }),

    createOrdenPago: builder.mutation({
      query: (data) => ({
        url: `/costos/ordenes-pago/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["OrdenPago"],
    }),

    updateOrdenPago: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/costos/ordenes-pago/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["OrdenPago"],
    }),

    confirmarOrdenPago: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/costos/ordenes-pago/${id}/confirmar`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["OrdenPago"],
    }),

    cancelarOrdenPago: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/costos/ordenes-pago/${id}/cancelar`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["OrdenPago"],
    }),

    deleteOrdenPago: builder.mutation({
      query: (id) => ({
        url: `/costos/ordenes-pago/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrdenPago"],
    }),
  }),
});

export const {
  useGetAllOrdenesPagoQuery,
  useGetOrdenPagoByIdQuery,
  useCreateOrdenPagoMutation,
  useUpdateOrdenPagoMutation,
  useConfirmarOrdenPagoMutation,
  useCancelarOrdenPagoMutation,
  useDeleteOrdenPagoMutation,
} = ordenPagoApi;
