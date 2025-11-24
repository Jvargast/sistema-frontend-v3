import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const pedidosApi = createApi({
  reducerPath: "pedidosApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Pedidos"],
  endpoints: (builder) => ({
    getAllPedidos: builder.query({
      query: (params) => ({ url: `/pedidos/`, params }),
      providesTags: ["Pedidos"],
      transformResponse: (response) => ({
        pedidos: response.data,
        paginacion: response.total,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de pedidos:", error);
        }
      },
    }),

    getPedidoById: builder.query({
      query: (id_pedido) => `/pedidos/${id_pedido}`,
      providesTags: ["Pedidos"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener el pedido:", error);
        }
      },
    }),

    getPedidosAsignados: builder.query({
      query: (id_chofer) => `/pedidos/asignados/${id_chofer}`,
      providesTags: ["Pedidos"],
      transformResponse: (response) => ({
        pedidos: response.data,
        paginacion: response.total,
      }),
    }),

    getPedidosSinAsignar: builder.query({
      query: () => `/pedidos/sin-asignar`,
      providesTags: ["Pedidos"],
    }),

    getMisPedidos: builder.query({
      query: ({ page = 1, limit = 10, fecha }) => ({
        url: `/pedidos/mis-pedidos`,
        params: { page, limit, fecha },
      }),
      providesTags: ["Pedidos"],
    }),

    getHistorialPedidos: builder.query({
      query: ({ fecha, page = 1, limit = 10 }) => ({
        url: `/pedidos/historial`,
        params: { fecha, page, limit },
      }),
      providesTags: ["Pedidos"],
      transformResponse: (response) => ({
        pedidos: response.data,
        paginacion: response.pagination,
      }),
    }),

    getPedidosConfirmados: builder.query({
      query: (id_chofer) => `/pedidos/confirmados/${id_chofer}`,
      providesTags: ["Pedidos"],
    }),

    createPedido: builder.mutation({
      query: (newPedido) => ({
        url: `/pedidos/`,
        method: "POST",
        body: newPedido,
      }),
      invalidatesTags: ["Pedidos"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al crear el pedido:", error);
        }
      },
    }),

    actualizarEstado: builder.mutation({
      query: ({ id_pedido, nuevoEstado }) => ({
        url: `/pedidos/${id_pedido}`,
        method: "PUT",
        body: nuevoEstado,
      }),
      invalidatesTags: ["Pedidos"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Estado Pedido actualizado correctamente:", data);
        } catch (error) {
          console.error("Error al actualizar el estado del pedido:", error);
        }
      },
    }),
    confirmarPedido: builder.mutation({
      query: ({ id_pedido }) => ({
        url: `/pedidos/${id_pedido}/confirmacion`,
        method: "PATCH",
      }),
      invalidatesTags: ["Pedidos"],
    }),

    registrarDesdePedido: builder.mutation({
      query: (data) => ({
        url: `/pedidos/registrar-desde-pedido`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pedidos"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al registrar la venta desde pedido:", error);
        }
      },
    }),

    rejectPedido: builder.mutation({
      query: (id_pedido) => ({
        url: `/pedidos/${id_pedido}/rechazar`,
        method: "PUT",
      }),
      invalidatesTags: ["Pedidos"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al rechazar el pedido:", error);
        }
      },
    }),

    revertPedido: builder.mutation({
      query: (id_pedido) => ({
        url: `/pedidos/${id_pedido}/revertir`,
        method: "PUT",
      }),
      invalidatesTags: ["Pedidos"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al revertir el pedido:", error);
        }
      },
    }),

    deletePedido: builder.mutation({
      query: (id_pedido) => ({
        url: `/pedidos/${id_pedido}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pedidos"],
    }),

    asignarPedido: builder.mutation({
      query: ({ id_pedido, id_chofer }) => ({
        url: `/pedidos/asignar/${id_pedido}`,
        method: "PUT",
        body: { id_chofer },
      }),
      invalidatesTags: ["Pedidos"],
    }),
    desasignarPedido: builder.mutation({
      query: (id_pedido) => ({
        url: `/pedidos/desasignar/${id_pedido}`,
        method: "PUT",
      }),
      invalidatesTags: ["Pedidos"],
    }),
    getDetalleConTotal: builder.query({
      query: (id_pedido) => `/pedidos/detalle-con-total/${id_pedido}`,
      providesTags: ["Pedidos"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener el detalle del pedido:", error);
        }
      },
    }),
    revertirEstadoPedido: builder.mutation({
      query: ({ id_pedido, id_estado_destino }) => ({
        url: `/pedidos/${id_pedido}/revertir-estado`,
        method: "POST",
        body: { id_estado_destino },
      }),
      invalidatesTags: ["Pedidos"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al revertir el estado del pedido:", error);
        }
      },
    }),
    toggleMostrarEnTablero: builder.mutation({
      query: ({ id_pedido, mostrar_en_tablero }) => ({
        url: `/pedidos/${id_pedido}/mostrar-en-tablero`,
        method: "PATCH",
        body: { mostrar_en_tablero },
      }),
      invalidatesTags: ["Pedidos"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error(
            "Error al actualizar mostrar_en_tablero del pedido:",
            error
          );
        }
      },
    }),
  }),
});

export const {
  useGetPedidoByIdQuery,
  useGetPedidosAsignadosQuery,
  useConfirmarPedidoMutation,
  useGetHistorialPedidosQuery,
  useGetMisPedidosQuery,
  useGetPedidosConfirmadosQuery,
  useGetPedidosSinAsignarQuery,
  useGetAllPedidosQuery,
  useActualizarEstadoMutation,
  useCreatePedidoMutation,
  useAsignarPedidoMutation,
  useDesasignarPedidoMutation,
  useDeletePedidoMutation,
  useRejectPedidoMutation,
  useRevertPedidoMutation,
  useGetDetalleConTotalQuery,
  useRegistrarDesdePedidoMutation,
  useRevertirEstadoPedidoMutation,
  useToggleMostrarEnTableroMutation
} = pedidosApi;
