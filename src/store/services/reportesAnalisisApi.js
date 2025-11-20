import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const reportesAnalisisApi = createApi({
  reducerPath: "reportesAnalisis",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["ReporteDiario"],
  endpoints: (builder) => ({
    getReporteDiario: builder.query({
      query: ({ fecha, id_sucursal } = {}) => ({
        url: "/reporte/diario",
        params: {
          ...(fecha ? { fecha } : {}),
          ...(id_sucursal != null ? { id_sucursal } : {}),
        },
      }),
      providesTags: (_result, _error, args) => [
        {
          type: "ReporteDiario",
          id: `${args?.fecha || "hoy"}-${args?.id_sucursal ?? "global"}`,
        },
      ],
    }),
  }),
});

export const { useGetReporteDiarioQuery } = reportesAnalisisApi;
