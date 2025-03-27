import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const documentoApi = createApi({
  reducerPath: "documentoApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Documento"],
  endpoints: (builder) => ({
    getDocumentoById: builder.query({
      query: (id) => `/documentos/${id}`,
      providesTags: ["Documento"],
    }),

    getDocumentosByVenta: builder.query({
      query: (id_venta) => `/documentos/venta/${id_venta}`,
      providesTags: ["Documento"],
    }),

    createDocumento: builder.mutation({
      query: (data) => ({
        url: "/documentos/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Documento"],
    }),

    updateDocumento: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/documentos/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Documento"],
    }),

    deleteDocumento: builder.mutation({
      query: (id) => ({
        url: `/documentos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documento"],
    }),
  }),
});

export const {
  useGetDocumentoByIdQuery,
  useGetDocumentosByVentaQuery,
  useCreateDocumentoMutation,
  useUpdateDocumentoMutation,
  useDeleteDocumentoMutation,
} = documentoApi;
