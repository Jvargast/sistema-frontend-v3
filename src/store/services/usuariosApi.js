import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const usuariosApi = createApi({
  reducerPath: "usuariosApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    findByRut: builder.query({
      query: (rut) => `/usuarios/${rut}`,
      providesTags: ["User"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener usuario por RUT:", error);
        }
      },
    }),
    getAllUsers: builder.query({
      query: (params) => ({ url: `/usuarios/`, params }),
      providesTags: ["User"],
      transformResponse: (response) => ({
        usuarios: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de usuarios:", error);
        }
      },
    }),
    getAllChoferes: builder.query({
      query: (params) => ({ url: `/usuarios/choferes`, params }),
      providesTags: ["User"],
    }),
    getAllVendedores: builder.query({
      query: () => `/usuarios/vendedores`,
      providesTags: ["User"],
    }),
    getAllUsuariosConCaja: builder.query({
      query: () => `/usuarios/usuarios-con-caja`,
      providesTags: ["User"],
    }),
    createNewUser: builder.mutation({
      query: (newUser) => ({
        url: `/usuarios/crear`,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al crear usuario:", error);
        }
      },
    }),
    updateUser: builder.mutation({
      query: ({ rut, updates }) => ({
        url: `/usuarios/${rut}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Usuario actualizado correctamente");
        } catch (error) {
          console.error("Error al actualizar usuario:", error);
        }
      },
    }),
    updateUserPassword: builder.mutation({
      query: ({ rut, newPassword }) => ({
        url: `/usuarios/${rut}/change-password`,
        method: "PUT",
        body: { newPassword },
      }),
      invalidatesTags: ["User"], 
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al actualizar la contraseña:", error);
        }
      },
    }),
    deleteUser: builder.mutation({
      query: (rut) => ({
        url: `/usuarios/${rut}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"], 
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Usuario eliminado correctamente");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
        }
      },
    }),
    getOwnProfile: builder.query({
      query: () => "/usuarios/mi-perfil",
      providesTags: ["User"], 
    }),
    changePassword: builder.mutation({
      query: (updates) => ({
        url: `/usuarios/change-password`,
        method: "POST",
        body: updates,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Perfil actualizado correctamente");
        } catch (error) {
          console.error("Error al actualizar el perfil:", error);
        }
      },
    }),
    updateMyProfile: builder.mutation({
      query: (updates) => ({
        url: `/usuarios/mi-perfil`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Perfil actualizado correctamente");
        } catch (error) {
          console.error("Error al actualizar el perfil:", error);
        }
      },
    }),
  }),
});

export const {
  useFindByRutQuery,
  useGetAllUsersQuery,
  useCreateNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAllChoferesQuery,
  useGetAllVendedoresQuery,
  useGetAllUsuariosConCajaQuery,
  useUpdateMyProfileMutation,
  useGetOwnProfileQuery,
  useChangePasswordMutation,
  useUpdateUserPasswordMutation,
} = usuariosApi;
