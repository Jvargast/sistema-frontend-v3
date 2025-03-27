import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";


export const camionesApi = createApi({
  reducerPath: "camionesApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Camion"], 
  endpoints: (builder) => ({
    
    // Obtener todos los camiones
    getAllCamiones: builder.query({
      query: (params) => ({
        url: `/camiones/`,
        params,
      }),
      providesTags: ["Camion"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de camiones", error);
        }
      },
    }),

    // Obtener un camión por ID
    getCamionById: builder.query({
      query: (id) => ({ url: `/camiones/${id}` }),
      providesTags: ["Camion"],
    }),


    // Obtener la capacidad de un camión específico
    getCapacityByChoferId: builder.query({
      query: (id_chofer) => ({ url: `/camiones/capacidad/chofer/${id_chofer}` }),
      providesTags: ["Camion"],
    }),

    // Obtener la capacidad de un camión específico
    getCamionCapacity: builder.query({
      query: (id) => ({ url: `/camiones/capacidad/${id}` }),
      providesTags: ["Camion"],
    }),

    // Crear un nuevo camión
    createCamion: builder.mutation({
      query: (newCamion) => ({
        url: "/camiones/",
        method: "POST",
        body: newCamion,
      }),
      invalidatesTags: ["Camion"],
    }),

    // Actualizar un camión existente
    updateCamion: builder.mutation({
      query: ({ id, updatedCamion }) => ({
        url: `/camiones/${id}`,
        method: "PUT",
        body: updatedCamion,
      }),
      invalidatesTags: ["Camion"],
    }),

    asignarChofer: builder.mutation({
      query: ({ id, id_chofer }) => ({
        url: `/camiones/${id}/asignar-chofer`,
        method: "PATCH",
        body: { id_chofer },
      }),
      invalidatesTags: ["Camion"],
    }),

    // Eliminar un camión
    deleteCamion: builder.mutation({
      query: (id) => ({
        url: `/camiones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Camion"],
    }),
  }),
});

// Exportar hooks generados automáticamente
export const {
  useCreateCamionMutation,
  useGetAllCamionesQuery,
  useGetCapacityByChoferIdQuery,
  useGetCamionCapacityQuery,
  useGetCamionByIdQuery,
  useUpdateCamionMutation,
  useAsignarChoferMutation,
  useDeleteCamionMutation,
} = camionesApi;

