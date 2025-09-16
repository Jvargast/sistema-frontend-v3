import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const categoriaGastoApi = createApi({
  reducerPath: "categoriaGastoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["CategoriaGasto"],
  endpoints: (builder) => ({
    getCategoriaGastoById: builder.query({
      query: (id) => `/costos/categorias-gasto/${id}`,
      providesTags: ["CategoriaGasto"],
    }),
    getAllCategoriasGasto: builder.query({
      query: (params) => ({
        url: `/costos/categorias-gasto/`,
        params,
      }),
      providesTags: ["CategoriaGasto"],
    }),
    createCategoriaGasto: builder.mutation({
      query: (data) => ({
        url: `/costos/categorias-gasto/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CategoriaGasto"],
    }),
    updateCategoriaGasto: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/costos/categorias-gasto/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CategoriaGasto"],
    }),
    deleteCategoriaGasto: builder.mutation({
      query: (id) => ({
        url: `/costos/categorias-gasto/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CategoriaGasto"],
    }),
  }),
});

export const {
  useGetCategoriaGastoByIdQuery,
  useGetAllCategoriasGastoQuery,
  useCreateCategoriaGastoMutation,
  useUpdateCategoriaGastoMutation,
  useDeleteCategoriaGastoMutation,
} = categoriaGastoApi;
