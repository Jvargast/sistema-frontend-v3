import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const agendaViajesApi = createApi({
  reducerPath: "agendaViajesApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["AgendaViajes"],
  endpoints: (builder) => ({
    getAgendaViajeChofer: builder.query({
      query: ({ id_chofer }) => `/agenda-viajes/chofer/${id_chofer}`,
      providesTags: ["AgendaViajes"],
    }),

    // Finalizar un viaje
    finalizarViaje: builder.mutation({
      query: ({
        id_agenda_viaje,
        descargarAuto = true,
        descargarDisponibles = false,
        dejaRetornables,
      }) => ({
        url: `/agenda-viajes/${id_agenda_viaje}/finalizar`,
        method: "POST",
        body: { descargarAuto, descargarDisponibles, dejaRetornables },
      }),
      invalidatesTags: ["AgendaViajes"],
    }),

    getHistorialViajes: builder.query({
      query: ({ id_chofer }) => `/agenda-viajes/historial/${id_chofer}`,
      providesTags: ["AgendaViajes"],
    }),

    getAllViajes: builder.query({
      query: () => `/agenda-viajes/historial`,
      providesTags: ["AgendaViajes"],
    }),
    getViajeById: builder.query({
      query: (id) => `/agenda-viajes/${id}`,
      providesTags: (result, error, id) => [{ type: "AgendaViajes", id }],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la agenda viaje:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAgendaViajeChoferQuery,
  useFinalizarViajeMutation,
  useGetHistorialViajesQuery,
  useGetAllViajesQuery,
  useGetViajeByIdQuery,
} = agendaViajesApi;
