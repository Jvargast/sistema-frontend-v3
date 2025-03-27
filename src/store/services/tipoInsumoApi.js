import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const tipoInsumoApi = createApi({
  reducerPath: "tipoInsumoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["TipoInsumo"],
  endpoints: (builder) => ({
    getAllTipos: builder.query({
      query: (params) => ({
        url: `/tipo-insumo/`,
        params,
      }),
      providesTags: ["TipoInsumo"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de TipoInsumos", error);
        }
      },
    }),

    // Obtener producto por ID
    getTipoById: builder.query({
      query: (id) => `/tipo-insumo/${id}`,
      providesTags: ["TipoInsumo"],
    }),

    // Crear un nuevo producto
    createTipo: builder.mutation({
      query: (newTipo) => ({
        url: "/tipo-insumo/",
        method: "POST",
        body: newTipo,
      }),
      invalidatesTags: ["TipoInsumo"], // Invalidar caché de productos
    }),

    // Actualizar un producto existente
    updateTipo: builder.mutation({
      query: ({ id, ...updateTipo }) => ({
        url: `/tipo-insumo/${id}`,
        method: "PUT",
        body: updateTipo,
      }),
      invalidatesTags: ["TipoInsumo"], // Invalidar caché de productos
    }),

    // Eliminar un producto
    deleteTipo: builder.mutation({
      query: (id) => ({
        url: `/tipo-insumo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TipoInsumo"], // Invalidar caché de productos
    }),
  }),
});

// Exportar hooks generados automáticamente
export const {
  useCreateTipoMutation,
  useDeleteTipoMutation,
  useGetAllTiposQuery,
  useGetTipoByIdQuery,
  useUpdateTipoMutation,
} = tipoInsumoApi;
