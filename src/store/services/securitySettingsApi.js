import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const securitySettingsApi = createApi({
  reducerPath: "securitySettingsApi",
  baseQuery: baseQueryWithReauthEnhanced,
  endpoints: (builder) => ({
    // Settings
    getSettings: builder.query({
      query: () => "/security-settings",
    }),
    updateSettings: builder.mutation({
      query: (settings) => ({
        url: "/security-settings",
        method: "PUT",
        body: settings,
      }),
    }),

    // Logs inicio de sesión
    getLogs: builder.query({
      query: () => "/audit-logs",
    }),
  }),
});

export const {
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  useGetAuditLogsQuery,
} = securitySettingsApi;
