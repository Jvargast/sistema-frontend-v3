import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const inventarioCamionApi = createApi({
  reducerPath: "inventarioCamionApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["InventarioCamion"],
  endpoints: (builder) => ({
    getInventarioDisponible: builder.query({
      query: (id_camion) => ({
        url: `/inventario-camion/disponible/${id_camion}`,
      }),
      providesTags: ["InventarioCamion"],
    }),

    getInventarioDisponiblePorChofer: builder.query({
      query: () => ({
        url: "/inventario-camion/disponible/chofer",
      }),
      providesTags: ["InventarioCamion"],
    }),

    getProductsByCamion: builder.query({
      query: (id) => ({
        url: `/inventario-camion/${id}`,
      }),
      providesTags: ["InventarioCamion"],
    }),

    getInventarioPorChofer: builder.query({
      query: (id_chofer) => ({
        url: `/inventario-camion/inventario/chofer/${id_chofer}`,
      }),
      providesTags: ["InventarioCamion"],
    }),

    getEstadoInventarioCamion: builder.query({
      query: (id_camion) => ({
        url: `/inventario-camion/estado/${id_camion}`,
      }),
      providesTags: (result, error, id_camion) => [
        { type: "Camion", id: id_camion },
      ],
    }),

    addProductToCamion: builder.mutation({
      query: (productData) => ({
        url: "/inventario-camion/",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["InventarioCamion"],
    }),

    returnProducts: builder.mutation({
      query: (id) => ({
        url: `/inventario-camion/return/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["InventarioCamion"],
    }),

    vaciarCamion: builder.mutation({
      query: ({ id_camion, descargarDisponibles = true, descargarRetorno = true }) => ({
        url: `/inventario-camion/vaciar/${id_camion}`,
        method: "POST",
        body: { descargarDisponibles, descargarRetorno },
      }),
      invalidatesTags: ["InventarioCamion"],
    }),
  }),
});

export const {
  useGetInventarioDisponibleQuery,
  useGetInventarioDisponiblePorChoferQuery,
  useGetInventarioPorChoferQuery,
  useGetEstadoInventarioCamionQuery,
  useGetProductsByCamionQuery,
  useAddProductToCamionMutation,
  useReturnProductsMutation,
  useVaciarCamionMutation,
} = inventarioCamionApi;
