import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const clientesApi = createApi({
  reducerPath: "clientesApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Cliente"],
  endpoints: (builder) => ({
    getClienteById: builder.query({
      query: (arg) => {
        if (typeof arg === "string" || typeof arg === "number") {
          return `/clientes/${arg}`;
        }
        const { id, id_sucursal } = arg || {};
        return {
          url: `/clientes/${id}`,
          params: id_sucursal ? { id_sucursal } : undefined,
        };
      },
      providesTags: (result, error, arg) => {
        const id = typeof arg === "object" ? arg?.id : arg;
        return [{ type: "Cliente", id }, "Cliente"];
      },
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
      providesTags: ["Cliente"],
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

    createCliente: builder.mutation({
      query: (newClient) => ({
        url: `/clientes/`,
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: ["Cliente"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al crear cliente:", error);
        }
      },
    }),

    updateCliente: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `/clientes/${id}`,
        method: "PUT",
        body: { ...formData },
      }),
      invalidatesTags: ["Cliente"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Cliente actualizado correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar cliente:", error);
        }
      },
    }),
    deleteClientes: builder.mutation({
      query: ({ ids }) => ({
        url: `/clientes/`,
        method: "PATCH",
        body: { ids },
      }),
      invalidatesTags: ["Cliente"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al eliminar clientes:", error);
        }
      },
    }),
    deactivateCliente: builder.mutation({
      query: (id) => ({
        url: `/clientes/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Cliente"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Cliente desactivado correctamente");
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
        }
      },
    }),

    reactivateCliente: builder.mutation({
      query: (id) => ({
        url: `/clientes/${id}/reactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Cliente"],
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
