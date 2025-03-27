import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const categoriaApi = createApi({
  reducerPath: "categoriaApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Categoria"], // Para manejar la invalidación de caché
  endpoints: (builder) => ({
    // Obtener todas las categorias
    getAllCategorias: builder.query({
      query: (params) => ({
        url: `/categorias-productos/`,
        params
      }),
      providesTags: ["Categoria"],
      async onQueryStarted(args, {queryFulfilled}) {
        try {
            await queryFulfilled;
        } catch (error) {
            console.log("Error al obtener la lista de categorias", error)
        }
      }
    }),

    // Obtener categoria por ID
    getCategoriaById: builder.query({
      query: (id) => `/categorias-productos/${id}`,
      providesTags: ["Categoria"],
    }),

    // Crear un nueva categoria
    createCategoria: builder.mutation({
      query: (newCategoria) => ({
        url: "/categorias-productos/",
        method: "POST",
        body: newCategoria,
      }),
      invalidatesTags: ["Categoria"], // Invalidar caché de categorias
    }),

    // Actualizar una categoria existente
    updateCategoria: builder.mutation({
      query: ({ id, updatedCategoria }) => ({
        url: `/categorias-productos/${id}`,
        method: "PUT",
        body: updatedCategoria,
      }),
      invalidatesTags: ["Categoria"], // Invalidar caché de categorias
    }),

    // Eliminar una categoria
    deleteCategoria: builder.mutation({
      query: (id) => ({
        url: `/categorias-productos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categoria"], // Invalidar caché de categorias
    }),
  }),
});

// Exportar hooks generados automáticamente
export const {
  useGetAllCategoriasQuery,
  useGetCategoriaByIdQuery,
  useCreateCategoriaMutation,
  useUpdateCategoriaMutation,
  useDeleteCategoriaMutation,
} = categoriaApi;

