import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const gastoApi = createApi({
  reducerPath: "gastoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Gasto", "GastoList", "GastoAdjunto"],
  endpoints: (builder) => ({
    getGastoById: builder.query({
      query: (id) => `/costos/gastos/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Gasto", id }],
    }),

    getAllGastos: builder.query({
      query: (params) => ({
        url: `/costos/gastos/`,
        params,
      }),
      providesTags: [{ type: "GastoList", id: "LIST" }],
    }),

    createGasto: builder.mutation({
      query: (data) => ({
        url: `/costos/gastos/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "GastoList", id: "LIST" }],
    }),

    updateGasto: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/costos/gastos/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Gasto", id },
        { type: "GastoList", id: "LIST" },
      ],
    }),

    getGastoAdjuntos: builder.query({
      query: (id) => `/costos/gastos/${id}/adjuntos`,
      providesTags: (_res, _err, id) => [{ type: "GastoAdjunto", id }],
    }),

    addGastoAdjuntos: builder.mutation({
      query: ({ id, adjuntos }) => ({
        url: `/costos/gastos/${id}/adjuntos`,
        method: "POST",
        body: { adjuntos },
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "GastoAdjunto", id },
        { type: "Gasto", id },
      ],
    }),

    deleteGasto: builder.mutation({
      query: (id) => ({
        url: `/costos/gastos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "GastoList", id: "LIST" }],
    }),

    deleteGastoAdjunto: builder.mutation({
      query: ({ id, adjuntoId }) => ({
        url: `/costos/gastos/${id}/adjuntos/${adjuntoId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "GastoAdjunto", id },
        { type: "Gasto", id },
      ],
    }),

    downloadGastoAdjunto: builder.query({
      query: ({ id, adjuntoId }) => ({
        url: `/costos/gastos/${id}/adjuntos/${adjuntoId}/download`,
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (blob, meta) => {
        const cd = meta?.response?.headers?.get("content-disposition") || "";
        const match = /filename="?([^"]+)"?/.exec(cd);
        const filename = match?.[1] || "archivo";
        return { blob, filename };
      },
      providesTags: (res, err, { id }) => [{ type: "GastoAdjunto", id }],
    }),
  }),
});

export const {
  useGetGastoByIdQuery,
  useGetAllGastosQuery,
  useCreateGastoMutation,
  useUpdateGastoMutation,
  useDeleteGastoMutation,
  useGetGastoAdjuntosQuery,
  useAddGastoAdjuntosMutation,
  useDeleteGastoAdjuntoMutation,
  useDownloadGastoAdjuntoQuery,
} = gastoApi;
