import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";


export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Role"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener todos los roles
    getAllRoles: builder.query({
      query: (params) => ({ url: `/roles/`, params }),
      providesTags: ["Role"], // Para invalidar cache
      transformResponse: (response) => ({
        roles: response.data, // Datos de roles
        paginacion: response.total, // Datos de paginación
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de roles:", error);
        }
      },
    }),

    // Obtener un rol por ID
    getRoleById: builder.query({
      query: (id) => `/roles/${id}`,
      providesTags: ["Role"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener el rol:", error);
        }
      },
    }),

    // Crear un rol
    createRole: builder.mutation({
      query: (newRole) => ({
        url: `/roles/`,
        method: "POST",
        body: newRole,
      }),
      invalidatesTags: ["Role"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al crear el rol:", error);
        }
      },
    }),

    // Actualizar un rol
    updateRole: builder.mutation({
      query: ({ id, ...updatedRole }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: updatedRole,
      }),
      invalidatesTags: ["Role"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Rol actualizado correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar el rol:", error);
        }
      },
    }),

    // Eliminar un rol
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al eliminar el rol:", error);
        }
      },
    }),
  }),
});

// Exporta los hooks generados automáticamente
export const {
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;

