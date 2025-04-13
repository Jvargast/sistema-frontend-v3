// agendaCarga.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery"; // tu baseQuery con manejo de reauth

export const agendaCargaApi = createApi({
  reducerPath: "agendaCargaApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["AgendaCarga"],
  endpoints: (builder) => ({
    // Obtener agenda por ID
    getAgendaById: builder.query({
      query: (id) => `/agendas/${id}`,
      providesTags: (result, error, id) => [{ type: "AgendaCarga", id }],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la agenda:", error);
        }
      },
    }),

    getAgendaCargaDelDia: builder.query({
      query: () => `/agendas/agenda/hoy`,
      providesTags: ["AgendaCarga"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la agenda:", error);
        }
      },
    }),
    // dentro de endpoints: (builder) => ({
    getAllAgendas: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams(params).toString();
        return `/agendas?${searchParams}`;
      },
      providesTags: ["AgendaCarga"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener agendas de carga:", error);
        }
      },
    }),

    // Crear nueva agenda
    createAgenda: builder.mutation({
      query: (body) => ({
        url: "/agendas/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgendaCarga"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al crear la agenda de carga:", error);
        }
      },
    }),

    // Confirmar carga de camión
    confirmarCargaCamion: builder.mutation({
      query: (body) => ({
        url: "/agendas/confirmar-carga",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgendaCarga"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al confirmar la carga del camión:", error);
        }
      },
    }),
  }),
});

// Hooks que genera RTK Query
export const {
  useGetAgendaByIdQuery,
  useGetAllAgendasQuery,
  useGetAgendaCargaDelDiaQuery,
  useCreateAgendaMutation,
  useConfirmarCargaCamionMutation,
} = agendaCargaApi;
