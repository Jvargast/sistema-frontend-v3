import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const entregasApi = createApi({
  reducerPath: "entregaApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Entrega"],
  endpoints: (builder) => ({
    // Crear entrega (chofer)
    createEntrega: builder.mutation({
      query: (body) => ({
        url: "/entregas",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id_camion }) => [
        { type: "Inventario", id: id_camion },
      ],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al registrar la entrega:", error);
        }
      },
    }),

    // Obtener entrega por ID
    getEntregaById: builder.query({
      query: (id) => `/entregas/${id}`,
      providesTags: (result, error, id) => [{ type: "Entrega", id }],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la entrega:", error);
        }
      },
    }),

    getEntregasByAgendaId: builder.query({
      query: ({ id_agenda_viaje, page = 1, limit = 20 }) => ({
        url: "/entregas/por-agenda",
        params: { id_agenda_viaje, page, limit },
      }),
      providesTags: (result, error, { id_agenda_viaje }) =>
        result?.data
          ? [
              { type: "Entrega", id: "LIST" },
              { type: "Entrega", id: `AGENDA-${id_agenda_viaje}` },
              ...result.data.map((e) => ({
                type: "Entrega",
                id: e.id_entrega,
              })),
            ]
          : [
              { type: "Entrega", id: "LIST" },
              { type: "Entrega", id: `AGENDA-${id_agenda_viaje}` },
            ],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener entregas por agenda:", error);
        }
      },
    }),

    // Obtener todas las entregas (opcional: con filtros o paginación)
    getAllEntregas: builder.query({
      query: (params) => ({
        url: "/entregas",
        params,
      }),
      providesTags: (result, error, arg) => [
        { type: "Entrega", id: `AGENDA-${arg.id_agenda_viaje}` },
        ...(result?.data ?? []).map((e) => ({
          type: "Entrega",
          id: e.id_entrega,
        })),
      ],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener entregas:", error);
        }
      },
    }),
  }),
});

export const {
  useCreateEntregaMutation,
  useGetEntregaByIdQuery,
  useGetEntregasByAgendaIdQuery,
  useGetAllEntregasQuery,
} = entregasApi;
