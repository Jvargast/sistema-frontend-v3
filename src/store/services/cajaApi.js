import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const cajaApi = createApi({
  reducerPath: "cajaApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Caja", "CajaUsuario"],
  endpoints: (builder) => ({
    getAllCajas: builder.query({
      query: (params) => ({
        url: `/cajas/`,
        params,
      }),
      providesTags: ["Caja"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error al obtener la lista de cajas", error);
        }
      },
    }),

    getCajaById: builder.query({
      query: (id) => `/cajas/${id}`,
      providesTags: ["Caja"],
    }),

    getCajaAsignada: builder.query({
      query: ({ rutUsuario }) => `/cajas/asignada?rutUsuario=${rutUsuario}`,
      providesTags: (result, error, arg) => [
        { type: "CajaUsuario", id: arg?.rutUsuario || "me" },
      ],
    }),

    createCaja: builder.mutation({
      query: (newCaja) => ({
        url: "/cajas/",
        method: "POST",
        body: newCaja,
      }),
      invalidatesTags: ["Caja"],
    }),

    getEstadoCaja: builder.query({
      query: () => ({ url: `/cajas/estado` }),
      serializeQueryArgs: () => "estado",
      forceRefetch: ({ currentArg, previousArg }) =>
        JSON.stringify(currentArg) !== JSON.stringify(previousArg),
      providesTags: () => [{ type: "Caja", id: "estado" }],
    }),

    openCaja: builder.mutation({
      query: (body) => ({ url: `/cajas/abrir`, method: "POST", body }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cajaApi.util.updateQueryData(
            "getEstadoCaja",
             undefined,
            (draft) => {
              if (!draft || !Array.isArray(draft.cajas)) return;
              const exists = draft.cajas.some(
                (c) => Number(c.id_caja) === Number(arg?.idCaja)
              );
              if (!exists) {
                draft.cajas.unshift({
                  id_caja: arg?.idCaja,
                  estado: "abierta",
                  saldo_inicial: arg?.saldoInicial,
                  fecha_apertura: new Date().toISOString(),
                });
              } else {
                draft.cajas = draft.cajas.map((c) =>
                  Number(c.id_caja) === Number(arg?.idCaja)
                    ? {
                        ...c,
                        estado: "abierta",
                        saldo_inicial: arg?.saldoInicial,
                      }
                    : c
                );
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo(); 
        }
      },
      invalidatesTags: ["Caja", "CajaUsuario"],
    }),

    closeCaja: builder.mutation({
      query: (body) => ({ url: `/cajas/cerrar`, method: "POST", body }),
      invalidatesTags: ["Caja", { type: "Caja", id: "estado" }],
    }),

    assignCaja: builder.mutation({
      query: (assignCaja) => ({
        url: `/cajas/asignar`,
        method: "PUT",
        body: assignCaja,
      }),
      invalidatesTags: ["Caja"],
    }),

    updateCaja: builder.mutation({
      query: ({ id, updatedCaja }) => ({
        url: `/cajas/${id}`,
        method: "PUT",
        body: updatedCaja,
      }),
      invalidatesTags: ["Caja"],
    }),

    deleteCaja: builder.mutation({
      query: (id) => ({
        url: `/cajas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Caja"],
    }),
  }),
});

export const {
  useCreateCajaMutation,
  useGetAllCajasQuery,
  useGetCajaAsignadaQuery,
  useGetEstadoCajaQuery,
  useOpenCajaMutation,
  useCloseCajaMutation,
  useAssignCajaMutation,
  useDeleteCajaMutation,
  useGetCajaByIdQuery,
  useUpdateCajaMutation,
} = cajaApi;
