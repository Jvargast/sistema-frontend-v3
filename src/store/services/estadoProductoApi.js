import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const estadoProductoApi = createApi({
  reducerPath: "estadoProductoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["EstadosProductos"], // Para manejar la invalidación de caché
  endpoints: (builder) => ({
    // Obtener todos los estados
    getAllEstados: builder.query({
      query: (params) => ({
        url: `/estados-productos/`,
        params
      }),
      providesTags: ["EstadosProductos"],
      async onQueryStarted(args, {queryFulfilled}) {
        try {
            await queryFulfilled;
        } catch (error) {
            console.log("Error al obtener la lista de estados", error)
        }
      }
    }),

    // Obtener estado por ID
    getEstadoById: builder.query({
      query: (id) => `/estados-productos/${id}`,
      providesTags: ["EstadosProductos"],
    }),

    // Crear un nuevo estado
    createEstado: builder.mutation({
      query: (newCategoria) => ({
        url: "/estados-productos/",
        method: "POST",
        body: newCategoria,
      }),
      invalidatesTags: ["EstadosProductos"], // Invalidar caché de estados
    }),

    // Actualizar un estado existente
    updateEstado: builder.mutation({
      query: ({ id, updatedEstado }) => ({
        url: `/estados-productos/${id}`,
        method: "PUT",
        body: updatedEstado,
      }),
      invalidatesTags: ["EstadosProductos"], // Invalidar caché de estados
    }),

    // Eliminar un estado
    deleteEstado: builder.mutation({
      query: (id) => ({
        url: `/estados-productos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EstadosProductos"], // Invalidar caché de estados
    }),
  }),
});

// Exportar hooks generados automáticamente
export const {
  useGetAllEstadosQuery,
  useGetEstadoByIdQuery,
  useCreateEstadoMutation,
  useUpdateEstadoMutation,
  useDeleteEstadoMutation,
} = estadoProductoApi;

