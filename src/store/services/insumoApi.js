import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const insumoApi = createApi({
  reducerPath: "insumoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Insumo", "InsumoList"],
  endpoints: (builder) => ({
    getAllInsumos: builder.query({
      query: (params) => ({
        url: `/insumos/`,
        params,
      }),
      providesTags: (result) =>
        result?.items?.length
          ? [
              { type: "InsumoList", id: "PAGINATED" },
              ...result.items.map((i) => ({ type: "Insumo", id: i.id_insumo })),
            ]
          : [{ type: "InsumoList", id: "PAGINATED" }],
      refetchOnFocus: true,
      refetchOnReconnect: true,
      keepUnusedDataFor: 60,
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de insumos", error);
        }
      },
    }),

    getStocksForInsumos: builder.query({
      query: ({ ids, id_sucursal }) => ({
        url: `/insumos/stock`,
        params: { ids: ids.join(","), id_sucursal },
      }),
      transformResponse: (res) => (Array.isArray(res) ? res : res?.data ?? []),
      forceRefetch({ currentArg, previousArg }) {
        if (!previousArg) return true;
        return (
          Number(currentArg.id_sucursal) !== Number(previousArg.id_sucursal) ||
          currentArg.ids.join(",") !== previousArg.ids.join(",")
        );
      },
    }),

    getStocksByFormula: builder.query({
      query: ({ id_formula, id_sucursal, multiplicador = 1 }) => ({
        url: `/insumos/stock/by-formula`,
        params: { id_formula, id_sucursal, multiplicador },
      }),
      transformResponse: (res) => (Array.isArray(res) ? res : res?.data ?? []),
      forceRefetch({ currentArg, previousArg }) {
        if (!previousArg) return true;
        return (
          Number(currentArg.id_formula) !== Number(previousArg.id_formula) ||
          Number(currentArg.id_sucursal) !== Number(previousArg.id_sucursal) ||
          Number(currentArg.multiplicador ?? 1) !==
            Number(previousArg.multiplicador ?? 1)
        );
      },
    }),

    getAllInsumosAll: builder.query({
      query: (params) => ({
        url: `/insumos/all`,
        params,
      }),
      transformResponse: (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.items)) return res.items;
        if (Array.isArray(res?.data?.items)) return res.data.items;
        if (Array.isArray(res?.data)) return res.data;
        return [];
      },
      providesTags: (result) =>
        Array.isArray(result) && result.length
          ? [
              { type: "InsumoList", id: "ALL" },
              ...result.map((i) => ({ type: "Insumo", id: i.id_insumo })),
            ]
          : [{ type: "InsumoList", id: "ALL" }],
      refetchOnFocus: false,
      keepUnusedDataFor: 120,
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista completa de insumos", error);
        }
      },
    }),

    getInsumoById: builder.query({
      query: (id) => `/insumos/${id}`,
      transformResponse: (response) => response?.data ?? response,
      providesTags: (result, error, id) => [{ type: "Insumo", id }],
    }),

    createInsumo: builder.mutation({
      query: (newInsumo) => ({
        url: "/insumos/",
        method: "POST",
        body: newInsumo,
      }),
      invalidatesTags: [
        { type: "InsumoList", id: "PAGINATED" },
        { type: "InsumoList", id: "ALL" },
      ],
    }),

    updateInsumo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/insumos/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Insumo", id },
        { type: "InsumoList", id: "PAGINATED" },
        { type: "InsumoList", id: "ALL" },
      ],
    }),

    deleteInsumo: builder.mutation({
      query: (id) => ({
        url: `/insumos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Insumo", id },
        { type: "InsumoList", id: "PAGINATED" },
        { type: "InsumoList", id: "ALL" },
      ],
    }),

    deleteInsumos: builder.mutation({
      query: ({ ids }) => ({
        url: `/insumos/`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      }),
      invalidatesTags: (result, error, { ids = [] }) => [
        ...ids.map((id) => ({ type: "Insumo", id })),
        { type: "InsumoList", id: "PAGINATED" },
        { type: "InsumoList", id: "ALL" },
      ],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al borrar insumos: ", error);
        }
      },
    }),
  }),
});

export const {
  useCreateInsumoMutation,
  useDeleteInsumoMutation,
  useDeleteInsumosMutation,
  useGetAllInsumosQuery,
  useGetAllInsumosAllQuery,
  useLazyGetAllInsumosAllQuery,
  useGetInsumoByIdQuery,
  useUpdateInsumoMutation,
  useGetStocksByFormulaQuery,
  useLazyGetStocksByFormulaQuery,
} = insumoApi;
