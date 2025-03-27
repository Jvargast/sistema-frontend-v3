import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const movimientoCajaApi = createApi({
  reducerPath: "MovimientoCajaApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["MovimientosCaja"],
  endpoints: (builder) => ({
    getMovimientosByCaja: builder.query({
      query: ({ id_caja, fecha, page = 1, limit = 10 }) => ({
        url: `/movimientos/caja/${id_caja}`,
        params: { fecha, page, limit },
      }),
      providesTags: ["MovimientosCaja"],
      transformResponse: (response) => ({
        movimientos: response.data,
        paginacion: response.pagination,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener los movimientos de caja:", error);
        }
      },
    }),
    getAllMovimientosCaja: builder.query({
      query: (params) => ({
        url: `/movimientos/`,
        params,
      }),
      providesTags: ["MovimientosCaja"],
      transformResponse: (response) => ({
        movimientos: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener los movimientos de caja:", error);
        }
      },
    }),
  }),
});

export const { useGetMovimientosByCajaQuery, useGetAllMovimientosCajaQuery } =
  movimientoCajaApi;
