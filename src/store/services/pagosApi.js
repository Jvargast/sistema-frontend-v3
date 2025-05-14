import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const pagosApi = createApi({
  reducerPath: "pagosApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Pago"],
  endpoints: (builder) => ({
    getPagoById: builder.query({
      query: (id) => `/pagos/${id}`,
      providesTags: ["Pago"],
    }),

    getPagosByDocumento: builder.query({
      query: (id_documento) => `/pagos/documento/${id_documento}`,
      providesTags: ["Pago"],
    }),
    getPagosByVentaId: builder.query({
      query: (id_venta) => `/pagos/venta/${id_venta}`,
      providesTags: ["Pago"],
    }),
    getAllPagos: builder.query({
      query: (params) => ({
        url: `/pagos/`,
        params,
      }),
      providesTags: ["Pago"],
    }),

    createPago: builder.mutation({
      query: (data) => ({
        url: "/pagos/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pago"],
    }),

    updatePago: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pagos/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Pago"],
    }),

    deletePago: builder.mutation({
      query: (id) => ({
        url: `/pagos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pago"],
    }),
  }),
});

export const {
  useGetPagoByIdQuery,
  useGetPagosByDocumentoQuery,
  useGetPagosByVentaIdQuery,
  useGetAllPagosQuery,
  useCreatePagoMutation,
  useUpdatePagoMutation,
  useDeletePagoMutation,
} = pagosApi;
