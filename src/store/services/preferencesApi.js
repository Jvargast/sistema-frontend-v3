import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const preferencesApi = createApi({
  reducerPath: "preferencesApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Prefs"],
  endpoints: (builder) => ({

    getMyPrefs: builder.query({
      query: () => ({ url: "/preferences/me/preferences" }),
      providesTags: ["Prefs"],
      keepUnusedDataFor: 300,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener preferencias:", error);
        }
      },
    }),

    saveMyPrefs: builder.mutation({
      query: (body) => ({
        url: "/preferences/me/preferences",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Prefs"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Preferencias guardadas correctamente");
        } catch (error) {
          console.error("Error al guardar preferencias:", error);
        }
      },
    }),

    clearMyPrefs: builder.mutation({
      query: () => ({
        url: "/preferences/me/preferences",
        method: "DELETE",
      }),
      invalidatesTags: ["Prefs"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Preferencias restablecidas correctamente");
        } catch (error) {
          console.error("Error al restablecer preferencias:", error);
        }
      },
    }),
  }),
});

export const {
  useGetMyPrefsQuery,
  useSaveMyPrefsMutation,
  useClearMyPrefsMutation,
} = preferencesApi;
