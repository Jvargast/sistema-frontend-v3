import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";
import { insumoApi } from "./insumoApi";
import { productoApi } from "./productoApi";

export const produccionApi = createApi({
  reducerPath: "produccionApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Produccion"],
  endpoints: (builder) => ({
    getAllProduccion: builder.query({
      query: (params) => ({
        url: `/produccion/`,
        params,
      }),
      providesTags: ["Produccion"],
      transformResponse: (response) => ({
        producciones: response.producciones,
        paginacion: response.paginacion,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de producciones", error);
        }
      },
    }),

    getProduccionById: builder.query({
      query: (id) => `/produccion/${id}`,
      providesTags: ["Produccion"],
    }),

    createProduccion: builder.mutation({
      query: (nuevaProduccion) => ({
        url: "/produccion/",
        method: "POST",
        body: nuevaProduccion,
      }),
      invalidatesTags: ["Produccion"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            productoApi.util.invalidateTags([{ type: "Producto", id: "LIST" }])
          );
          dispatch(
            insumoApi.util.invalidateTags([
              { type: "InsumoList", id: "PAGINATED" },
              { type: "InsumoList", id: "ALL" },
            ])
          );
        } catch (error) {
          console.log("Error al crear: ", error);
        }
      },
    }),

    updateProduccion: builder.mutation({
      query: ({ id, ...datosActualizados }) => ({
        url: `/produccion/${id}`,
        method: "PUT",
        body: datosActualizados,
      }),
      invalidatesTags: ["Produccion"],
    }),

    deleteProduccion: builder.mutation({
      query: (id) => ({
        url: `/produccion/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Produccion"],
    }),

    deleteProducciones: builder.mutation({
      query: ({ ids }) => ({
        url: `/produccion/`,
        method: "PATCH",
        body: { ids },
      }),
      invalidatesTags: ["Produccion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al borrar producciones: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllProduccionQuery,
  useGetProduccionByIdQuery,
  useCreateProduccionMutation,
  useUpdateProduccionMutation,
  useDeleteProduccionMutation,
  useDeleteProduccionesMutation,
} = produccionApi;
