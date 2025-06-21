import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauthEnhanced } from "./fettchQuery";

export const pedidosApi = createApi({
  reducerPath: "pedidosApi",
  baseQuery: baseQueryWithReauthEnhanced,
  tagTypes: ["Pedidos"], // Identificador para invalidar cache
  endpoints: (builder) => ({
    // Obtener todas las ventas
    getAllPedidos: builder.query({
      query: (params) => ({ url: `/pedidos/`, params }),
      providesTags: ["Pedidos"], // Para invalidar cache
      transformResponse: (response) => ({
        pedidos: response.data, // Datos de ventas
        paginacion: response.total, // Datos de paginación
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error al obtener la lista de pedidos:", error);
        }
      },
    }),

    // Obtener un venta por ID
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

    //Obtener pedidos del chofer
    getPedidosAsignados: builder.query({
      query: (id_chofer) => `/pedidos/asignados/${id_chofer}`,
      providesTags: ["Pedidos"],
      transformResponse: (response) => ({
        pedidos: response.data, // Datos de ventas
        paginacion: response.total, // Datos de paginación
      }),
    }),

    // Obtener pedidos sin asignar
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
      /* transformResponse: (response) => ({
        pedidos: response.data, // Asegura que `pedidos` siempre exista
        paginacion: response.paginacion || { totalPages: 1, currentPage: 1 }, // Evita `undefined`
      }), */
    }),

    getHistorialPedidos: builder.query({
      query: ({ fecha, page = 1, limit = 10 }) => ({
        url: `/pedidos/historial`,
        params: { fecha, page, limit }, // Enviar fecha y paginación como query params
      }),
      providesTags: ["Pedidos"],
      transformResponse: (response) => ({
        pedidos: response.data, // Datos de pedidos filtrados
        paginacion: response.pagination, // Datos de paginación
      }),
    }),

    // Obtener pedidos confirmados del chofer
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
    // Confirmar un pedido por el chofer
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

    // Rechazar un pedido
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

    // Eliminar un pedido
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
  useGetDetalleConTotalQuery,
  useRegistrarDesdePedidoMutation
} = pedidosApi;
