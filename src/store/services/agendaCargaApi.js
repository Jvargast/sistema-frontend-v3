import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const agendaCargaApi = createApi({
  reducerPath: "agendaCargaApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["AgendaCarga"],
  endpoints: (builder) => ({
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
      query: (params = {}) => ({
        url: "/agendas/agenda/hoy",
        params,
      }),
      providesTags: ["AgendaCarga"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la agenda:", error);
        }
      },
    }),

    getAllAgendas: builder.query({
      query: (params) => ({ url: "/agendas", params }),
      providesTags: ["AgendaCarga"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener agendas de carga:", error);
        }
      },
    }),

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

export const {
  useGetAgendaByIdQuery,
  useGetAllAgendasQuery,
  useGetAgendaCargaDelDiaQuery,
  useCreateAgendaMutation,
  useConfirmarCargaCamionMutation,
} = agendaCargaApi;
