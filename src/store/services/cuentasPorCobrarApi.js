import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const cuentasPorCobrarApi = createApi({
  reducerPath: "cuentasPorCobrarApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["CuentaPorCobrar"],
  endpoints: (builder) => ({
    getCuentaPorCobrarById: builder.query({
      query: (id) => `/cuentas-por-cobrar/${id}`,
      providesTags: ["CuentaPorCobrar"],
    }),
    getAllCuentasPorCobrar: builder.query({
      query: ({ page = 1, limit = 10, ...filters }) => {
        const params = new URLSearchParams({
          page,
          limit,
          ...filters,
        });
        return `/cuentas-por-cobrar?${params.toString()}`;
      },
      providesTags: ["CuentaPorCobrar"],
    }),
    registrarPago: builder.mutation({
      query: ({ id_cxc, ...body }) => ({
        url: `/cuentas-por-cobrar/${id_cxc}/pago`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CuentaPorCobrar"],
    }),
    updateCuentaPorCobrar: builder.mutation({
      query: ({ id_cxc, ...data }) => ({
        url: `/cuentas-por-cobrar/${id_cxc}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CuentaPorCobrar"],
    }),
    getCuentaPorCobrarByVentaId: builder.query({
      query: (idVenta) => `/cuentas-por-cobrar/venta/${idVenta}`,
      providesTags: ["CuentaPorCobrar"],
    }),
    getCuentaPorCobrarByDocumentoId: builder.query({
      query: (idDocumento) => `/cuentas-por-cobrar/documento/${idDocumento}`,
      providesTags: ["CuentaPorCobrar"],
    }),
  }),
});

export const {
  useGetCuentaPorCobrarByIdQuery,
  useGetAllCuentasPorCobrarQuery,
  useRegistrarPagoMutation,
  useUpdateCuentaPorCobrarMutation,
  useGetCuentaPorCobrarByVentaIdQuery,
  useGetCuentaPorCobrarByDocumentoIdQuery
} = cuentasPorCobrarApi;
