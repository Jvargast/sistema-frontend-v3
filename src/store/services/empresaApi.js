import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const empresaApi = createApi({
  reducerPath: "empresas",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Empresa"],
  endpoints: (builder) => ({
    // empresas
    getAllEmpresas: builder.query({
      query: () => "/empresas/",
      providesTags: ["Empresa"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener empresas:", error);
        }
      },
    }),

    // Obtener empresa por ID
    getEmpresaById: builder.query({
      query: (id) => `/empresas/${id}`,
      providesTags: (result, error, id) => [{ type: "Empresa", id }],
    }),

    // Actualizar empresa
    updateEmpresa: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/empresas/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Empresa", id }],
    }),

    // Logs inicio de sesión
    getAllSucursals: builder.query({
      query: () => "/sucursales/",
      providesTags: ["Empresa"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener sucursales:", error);
        }
      },
    }),

    // Obtener sucursal por ID
    getSucursalById: builder.query({
      query: (id) => `/sucursales/${id}`,
      providesTags: (result, error, id) => [{ type: "Sucursal", id }],
    }),

    createSucursal: builder.mutation({
      query: (body) => ({
        url: "/sucursales/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sucursal"],
    }),

    // Borrar sucursal
    deleteSucursal: builder.mutation({
      query: (id) => ({
        url: `/sucursales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sucursal"],
    }),

    // Editar sucursal (ya tienes updateSucursal, solo asegúrate de invalidar bien)
    updateSucursal: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/sucursales/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Sucursal", id }],
    }),
  }),
});

export const {
  useGetAllEmpresasQuery,
  useGetAllSucursalsQuery,
  useGetEmpresaByIdQuery,
  useGetSucursalByIdQuery,
  useUpdateEmpresaMutation,
  useUpdateSucursalMutation,
  useCreateSucursalMutation,
  useDeleteSucursalMutation,
} = empresaApi;
