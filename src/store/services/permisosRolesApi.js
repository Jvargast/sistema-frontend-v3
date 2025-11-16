import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const permisosApi = createApi({
    reducerPath: "permisosApi",
    baseQuery: baseQueryWithReauthEnhanced,
    tagTypes: ["Permiso"], 
    endpoints: (builder) => ({
      getAllpermisos: builder.query({
        query: (params) => ({ url: `/permisos/`, params }),
        providesTags: ["Permiso"], 
        transformResponse: (response) => ({
          permisos: response.data,
          paginacion: response.total,
        }),
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.error("Error al obtener la lista de permisos:", error);
          }
        },
      }),
  
      getPermisoById: builder.query({
        query: (id) => `/permisos/${id}`,
        providesTags: ["Permiso"],
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.error("Error al obtener el Permiso:", error);
          }
        },
      }),
  
      createPermiso: builder.mutation({
        query: (newPermiso) => ({
          url: `/permisos/`,
          method: "POST",
          body: newPermiso,
        }),
        invalidatesTags: ["Permiso"],
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.error("Error al crear el Permiso:", error);
          }
        },
      }),
  
      updatePermiso: builder.mutation({
        query: ({ id, ...formData }) => ({
          url: `/permisos/${id}`,
          method: "PUT",
          body: formData,
        }),
        invalidatesTags: ["Permiso"],
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            console.log("Permiso actualizado correctamente:", data);
          } catch (error) {
            console.error("Error al actualizar el Permiso:", error);
          }
        },
      }),
  
      deletePermiso: builder.mutation({
        query: (id) => ({
          url: `/permisos/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Permiso"],
        async onQueryStarted(args, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.error("Error al eliminar el Permiso:", error);
          }
        },
      }),
    }),
  });
  
  export const {
    useGetAllpermisosQuery,
    useLazyGetAllpermisosQuery,
    useGetPermisoByIdQuery,
    useCreatePermisoMutation,
    useUpdatePermisoMutation,
    useDeletePermisoMutation
  } = permisosApi;
