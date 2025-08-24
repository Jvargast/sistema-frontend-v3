import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const productoRetornableApi = createApi({
  reducerPath: "productoRetornableApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["ProductoRetornable"],
  endpoints: (builder) => ({
    getPendientes: builder.query({
      query: (params = {}) => ({
        url: "/producto-retornable/pendientes",
        params,
      }),
      transformResponse: (res) => (Array.isArray(res) ? res : res?.data || []),
      providesTags: ["Retornables"],
    }),
    inspeccionar: builder.mutation({
      query: ({ id_sucursal_inspeccion, items }) => ({
        url: "/producto-retornable/inspeccionar",
        method: "POST",
        body: { id_sucursal_inspeccion, items },
      }),
      invalidatesTags: ["ProductoRetornable"],
    }),
  }),
});

export const { useGetPendientesQuery, useInspeccionarMutation } =
  productoRetornableApi;
