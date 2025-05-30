import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const busquedaApi = createApi({
  reducerPath: "busquedaApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Busqueda"],
  endpoints: (builder) => ({
    search: builder.query({
      query: (q) => ({
        url: `/search`,
        params: { q }, 
      }),
      providesTags: ["Busqueda"],
    }),
  }),
});

export const {
  useSearchQuery,
} = busquedaApi;
