import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const centroCostoApi = createApi({
  reducerPath: "centroCostoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["CentroCosto"],
  endpoints: (builder) => ({
    getCentroCostoById: builder.query({
      query: (id) => `/costos/centros-costo/${id}`,
      providesTags: ["CentroCosto"],
    }),
    getAllCentrosCosto: builder.query({
      // params: { id_sucursal, tipo, activo, search, page, limit }
      query: (params) => ({
        url: `/costos/centros-costo/`,
        params,
      }),
      providesTags: ["CentroCosto"],
    }),
    createCentroCosto: builder.mutation({
      query: (data) => ({
        url: `/costos/centros-costo/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CentroCosto"],
    }),
    updateCentroCosto: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/costos/centros-costo/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CentroCosto"],
    }),
    deleteCentroCosto: builder.mutation({
      query: (id) => ({
        url: `/costos/centros-costo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CentroCosto"],
    }),
  }),
});

export const {
  useGetCentroCostoByIdQuery,
  useGetAllCentrosCostoQuery,
  useCreateCentroCostoMutation,
  useUpdateCentroCostoMutation,
  useDeleteCentroCostoMutation,
} = centroCostoApi;
