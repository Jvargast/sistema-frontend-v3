import { createApi } from "@reduxjs/toolkit/query/react";
import { logout, setLoading, setUser } from "../reducers/authSlice";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          await queryFulfilled;

          // ✅ Forzar refetch de /auth/me
          dispatch(authApi.util.invalidateTags(["Auth"]));
        } catch (error) {
          console.error("❌ Error al iniciar sesión:", error);
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),

    getAuthenticatedUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.log(error)
          console.warn("⚠️ Usuario no autenticado o error al validar sesión");
          dispatch(logout());
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("❌ Error al cerrar sesión:", error);
        } finally {
          dispatch(logout());
          dispatch(authApi.util.resetApiState());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetAuthenticatedUserQuery,
  useLogoutMutation,
} = authApi;
