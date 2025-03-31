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
      query: ({ id_agenda_viaje }) => ({
        url: `/agenda-viajes/${id_agenda_viaje}/finalizar`,
        method: "POST",
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
  }),
});

export const {
  useGetAgendaViajeChoferQuery,
  useFinalizarViajeMutation,
  useGetHistorialViajesQuery,
  useGetAllViajesQuery
} = agendaViajesApi;
