import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const productoRetornableApi = createApi({
  reducerPath: "productoRetornableApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["ProductoRetornable"],
  endpoints: (builder) => ({
    getPendientes: builder.query({
      query: () => ({
        url: "/producto-retornable/pendientes",
      }),
      providesTags: ["ProductoRetornable"],
    }),
    inspeccionar: builder.mutation({
      query: ({ items }) => ({
        url: "/producto-retornable/inspeccionar",
        method: "POST",
        body: { items },
      }),
      invalidatesTags: ["ProductoRetornable"],
    }),
  }),
});

export const { useGetPendientesQuery, useInspeccionarMutation } =
  productoRetornableApi;
