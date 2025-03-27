import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const cajaApi = createApi({
  reducerPath: "cajaApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Caja"], // Para manejar la invalidación de caché
  endpoints: (builder) => ({
    // Obtener todas las cajas
    getAllCajas: builder.query({
      query: (params) => ({
        url: `/cajas/`,
        params,
      }),
      providesTags: ["Caja"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de cajas", error);
        }
      },
    }),

    // Obtener caja por ID
    getCajaById: builder.query({
      query: (id) => `/cajas/${id}`,
      providesTags: ["Caja"],
    }),

    // Verificar si hay una caja asignada al usuario
    getCajaAsignada: builder.query({
      query: ({ rutUsuario }) => `/cajas/asignada?rutUsuario=${rutUsuario}`,
      providesTags: ["Caja"],
      
    }),

    // Crear un nueva caja
    createCaja: builder.mutation({
      query: (newCaja) => ({
        url: "/cajas/",
        method: "POST",
        body: newCaja,
      }),
      invalidatesTags: ["Caja"],
    }),

    getEstadoCaja: builder.query({
      query: () => `/cajas/estado`,
      providesTags: ["Caja"],
    }),

    openCaja: builder.mutation({
      query: (openCaja) => ({
        url: `/cajas/abrir`,
        method: "POST",
        body: openCaja,
      }),
      invalidatesTags: ["Caja"],
    }),
    closeCaja: builder.mutation({
      query: (closeCaja) => ({
        url: `/cajas/cerrar`,
        method: "POST",
        body: closeCaja,
      }),
      invalidatesTags: ["Caja"],
    }),
    // Asignar una caja a un usuario
    assignCaja: builder.mutation({
      query: (assignCaja) => ({
        url: `/cajas/asignar`,
        method: "PUT",
        body: assignCaja,
      }),
      invalidatesTags: ["Caja"],
    }),
    // Actualizar una caja existente
    updateCaja: builder.mutation({
      query: ({ id, updatedCaja }) => ({
        url: `/cajas/${id}`,
        method: "PUT",
        body: updatedCaja,
      }),
      invalidatesTags: ["Caja"],
    }),

    // Eliminar una caja
    deleteCaja: builder.mutation({
      query: (id) => ({
        url: `/caja/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Caja"],
    }),
  }),
});

// Exportar hooks generados automáticamente
export const {
  useCreateCajaMutation,
  useGetAllCajasQuery,
  useGetCajaAsignadaQuery,
  useGetEstadoCajaQuery,
  useOpenCajaMutation,
  useCloseCajaMutation,
  useAssignCajaMutation,
  useDeleteCajaMutation,
  useGetCajaByIdQuery,
  useUpdateCajaMutation,
} = cajaApi;
