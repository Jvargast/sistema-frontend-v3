// cotizacionesApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery"; // tu baseQuery con manejo de reauth

export const cotizacionesApi = createApi({
  reducerPath: "cotizacionesApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Cotizaciones"],
  endpoints: (builder) => ({
    // Obtener todas las cotizaciones
    getAllCotizaciones: builder.query({
      query: (params) => ({
        url: "/cotizaciones/",
        method: "GET",
        params,
      }),
      providesTags: ["Cotizaciones"],
    }),

    // Obtener cotización por ID
    getCotizacionById: builder.query({
      query: (id) => `/cotizaciones/${id}`,
      providesTags: (result, error, id) => [{ type: "Cotizaciones", id }],
    }),

    // Crear nueva cotización
    createCotizacion: builder.mutation({
      query: (body) => ({
        url: "/cotizaciones/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cotizaciones"],
    }),

    getCotizacionPdf: builder.query({
      query: ({ id, mostrarImpuestos = true }) => ({
        url: `/cotizaciones/${id}/pdf?mostrarImpuestos=${mostrarImpuestos}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    updateCotizacion: builder.mutation({
      query: ({ id, body }) => ({
        url: `/cotizaciones/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cotizaciones", id },
      ],
    }),
  }),
});

export const {
  useGetAllCotizacionesQuery,
  useGetCotizacionByIdQuery,
  useCreateCotizacionMutation,
  useGetCotizacionPdfQuery,
  useUpdateCotizacionMutation,
} = cotizacionesApi;
