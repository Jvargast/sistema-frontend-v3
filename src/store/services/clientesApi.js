import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const clientesApi = createApi({
  reducerPath: "clientesApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Cliente"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener cliente por ID
    getClienteById: builder.query({
      query: (id) => `/clientes/${id}`,
      providesTags: ["Cliente"], // Cache de clientes
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener cliente por ID:", error);
        }
      },
    }),

    getPorcentajeClientesNuevos: builder.query({
      query: () => `/clientes/nuevos/porcentaje`,
      providesTags: ["Cliente"], // Cache de clientes
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener cliente por ID:", error);
        }
      },
    }),

    getAllClientes: builder.query({
      query: (params) => ({ url: `/clientes/`, params }),
      providesTags: ["Cliente"],
      transformResponse: (response) => ({
        clientes: response.data, 
        paginacion: response.total, 
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de clientes:", error);
        }
      },
    }),

    // Crear un cliente
    createCliente: builder.mutation({
      query: (newClient) => ({
        url: `/clientes/`,
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: ["Cliente"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al crear cliente:", error);
        }
      },
    }),

    // Actualizar un cliente
    updateCliente: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `/clientes/${id}`,
        method: "PUT",
        body: { ...formData },
      }),
      invalidatesTags: ["Cliente"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Cliente actualizado correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar cliente:", error);
        }
      },
    }),
    // Borrar muchos clientes
    deleteClientes: builder.mutation({
      query: ({ ids }) => ({
        url: `/clientes/`,
        method: "PATCH",
        body: { ids }, // Enviamos el array de IDs en el body
      }),
      invalidatesTags: ["Cliente"], // Invalida el caché
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al eliminar clientes:", error);
        }
      },
    }),
    // Desactivar un cliente
    deactivateCliente: builder.mutation({
      query: (id) => ({
        url: `/clientes/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Cliente"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Cliente desactivado correctamente");
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
        }
      },
    }),

    // Reactivar un cliente
    reactivateCliente: builder.mutation({
      query: (id) => ({
        url: `/clientes/${id}/reactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Cliente"], // Invalida cache
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Cliente reactivado correctamente");
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
        }
      },
    }),
  }),
});

// Exporta los hooks generados automáticamente
export const {
  useGetClienteByIdQuery,
  useGetAllClientesQuery,
  useCreateClienteMutation,
  useUpdateClienteMutation,
  useDeleteClientesMutation,
  useDeactivateClienteMutation,
  useReactivateClienteMutation,
  useGetPorcentajeClientesNuevosQuery,
} = clientesApi;


