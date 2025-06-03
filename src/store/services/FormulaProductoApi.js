import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const formulaProductoApi = createApi({
  reducerPath: "formulaProductoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["FormulaProducto"],
  endpoints: (builder) => ({
    getAllFormulas: builder.query({
      query: (params) => ({
        url: `/formulas/`,
        params,
      }),
      providesTags: ["FormulaProducto"],
      transformResponse: (response) => ({
        formulas: response.data,
        paginacion: response.pagination,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de fórmulas", error);
        }
      },
    }),

    getFormulaById: builder.query({
      query: (id) => `/formulas/${id}`,
      providesTags: ["FormulaProducto"],
    }),

    createFormula: builder.mutation({
      query: (newFormula) => ({
        url: "/formulas/",
        method: "POST",
        body: newFormula,
      }),
      invalidatesTags: ["FormulaProducto"],
    }),

    updateFormula: builder.mutation({
      query: ({ id, ...body}) => ({
        url: `/formulas/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["FormulaProducto"],
    }),

    deleteFormula: builder.mutation({
      query: (id) => ({
        url: `/formulas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FormulaProducto"],
    }),

    deleteFormulas: builder.mutation({
      query: ({ ids }) => ({
        url: `/formulas/`,
        method: "PATCH",
        body: { ids },
      }),
      invalidatesTags: ["FormulaProducto"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al eliminar fórmulas: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllFormulasQuery,
  useGetFormulaByIdQuery,
  useCreateFormulaMutation,
  useUpdateFormulaMutation,
  useDeleteFormulaMutation,
  useDeleteFormulasMutation,
} = formulaProductoApi;
