import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const insumoApi = createApi({
  reducerPath: "insumoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Insumo"],
  endpoints: (builder) => ({
    getAllInsumos: builder.query({
      query: (params) => ({
        url: `/insumos/`,
        params,
      }),
      providesTags: ["Insumo"],
      /* transformResponse: (response) => {
        return response.data.map((group) => ({
          tipo: group.tipo,
          insumos: group.items,
          paginacion: {
            totalItems: group.totalItems,
            totalPages: group.totalPages,
            currentPage: group.currentPage,
          },
        }));
      },  */   
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de insumos", error);
        }
      },
    }),

    getInsumoById: builder.query({
      query: (id) => `/insumos/${id}`,
      providesTags: ["Insumo"],
    }),

    createInsumo: builder.mutation({
      query: (newInsumo) => ({
        url: "/insumos/",
        method: "POST",
        body: newInsumo,
      }),
      invalidatesTags: ["Insumo"], // Invalidar caché de productos
    }),

    updateInsumo: builder.mutation({
      query: ({ id, ...updatedInsumo }) => ({
        url: `/insumos/${id}`,
        method: "PUT",
        body: updatedInsumo,
      }),
      invalidatesTags: ["Insumo"], // Invalidar caché de productos
    }),

    deleteInsumo: builder.mutation({
      query: (id) => ({
        url: `/insumos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Insumo"], // Invalidar caché de productos
    }),

    deleteInsumos: builder.mutation({
      query: ({ ids }) => ({
        url: `/insumos/`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ids}) ,
      }),
      invalidatesTags: ["Insumo"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al borrar insumos: ", error);
        }
      },
    }),
  }),
});

export const {
  useCreateInsumoMutation,
  useDeleteInsumoMutation,
  useDeleteInsumosMutation,
  useGetAllInsumosQuery,
  useGetInsumoByIdQuery,
  useUpdateInsumoMutation,
} = insumoApi;
