import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Chip, Tooltip } from "@mui/material";
import { Visibility, Edit, Cancel, Delete, Undo } from "@mui/icons-material";
import {
  useGetAllPedidosQuery,
  useDeletePedidoMutation,
  useRejectPedidoMutation,
  useRevertPedidoMutation,
} from "../../store/services/pedidosApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import AlertDialog from "../../components/common/AlertDialog";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";

const ListarPedidos = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useGetAllPedidosQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  const [deletePedido] = useDeletePedidoMutation();
  const [rejectPedido] = useRejectPedidoMutation();
  const [revertPedido] = useRevertPedidoMutation();
  const dispatch = useDispatch();
  const [openAlert, setOpenAlert] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const handleRejectPedido = async (pedido) => {
    try {
      await rejectPedido(pedido.id_pedido).unwrap();
      refetch();
      dispatch(
        showNotification({
          message: "Pedido rechazado correctamente.",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error al rechazar pedido:", error);
      dispatch(
        showNotification({
          message: `Error al rechazar: ${error?.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  const handleRevertPedido = async (pedido) => {
    try {
      await revertPedido(pedido.id_pedido).unwrap();
      refetch();
      dispatch(
        showNotification({
          message: "Pedido revertido correctamente.",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error al revertir pedido:", error);
      dispatch(
        showNotification({
          message: `Error al revertir: ${error?.data?.error}`,
          severity: "error",
        })
      );
    }
  };

  const handleDeletePedidoConfirmado = async () => {
    if (!pedidoSeleccionado) return;
    try {
      await deletePedido(pedidoSeleccionado.id_pedido).unwrap();
      refetch();
      dispatch(
        showNotification({
          message: "Pedido eliminado correctamente.",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      dispatch(
        showNotification({
          message: `Error al eliminar: ${error?.data?.error}`,
          severity: "error",
        })
      );
    }
    setOpenAlert(false);
    setPedidoSeleccionado(null);
  };

  const handleConfirmDelete = (pedido) => {
    setPedidoSeleccionado(pedido);
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setPedidoSeleccionado(null);
  };

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, refetch]);

  const pedidos = useMemo(() => data?.pedidos || [], [data]);
  const totalItems = useMemo(() => data?.paginacion?.totalItems || 0, [data]);

  const estadoColores = {
    Pendiente: "default",
    "Pendiente de Pago": "warning",
    Pagada: "success",
    "Pendiente de Confirmación": "info",
    Confirmado: "primary",
    Rechazado: "error",
    "En Preparación": "secondary",
    "En Entrega": "info",
    Completada: "success",
    Cancelada: "error",
    Reembolsada: "default",
    Rechazada: "error",
    "Completada y Entregada": "success",
  };

  const columns = [
    {
      id: "id_pedido",
      label: "ID",
      render: (row) => Number(row.id_pedido),
    },
    {
      id: "cliente",
      label: "Cliente",
      render: (row) => row.Cliente?.nombre || "N/A",
    },
    {
      id: "fecha",
      label: "Fecha",
      render: (row) => new Date(row.fecha_pedido).toLocaleDateString(),
    },
    {
      id: "total",
      label: "Total",
      format: "currency",
      render: (row) => Number(row.total),
    },
    {
      id: "estadoPedido",
      label: "Estado",
      render: (row) => {
        const estado = row.EstadoPedido?.nombre_estado || "Desconocido";
        const colorChip = estadoColores[estado] || "default";
        return (
          <Chip label={estado} color={colorChip} sx={{ fontWeight: "bold" }} />
        );
      },
    },
    {
      id: "pagado",
      label: "¿Pagado?",
      render: (row) => (
        <Chip
          label={row.pagado ? "Sí" : "No"}
          color={row.pagado ? "success" : "default"}
          sx={{ fontWeight: "bold" }}
        />
      ),
    },

    {
      id: "acciones",
      label: "Acciones",
      render: (row) => {
        const estado = row.EstadoPedido?.nombre_estado;
        const puedeEliminar = estado === "Rechazado";
        const puedeRevertir = estado === "Rechazado";
        return (
          <>
            <Tooltip title="Ver Detalle">
              <IconButton
                color="primary"
                onClick={() => navigate(`/pedidos/ver/${row.id_pedido}`)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton color="inherit">
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rechazar Pedido">
              <IconButton
                color="warning"
                onClick={() => handleRejectPedido(row)}
              >
                <Cancel />
              </IconButton>
            </Tooltip>
            {puedeRevertir && (
              <Tooltip title="Revertir Pedido">
                <IconButton color="info" onClick={() => handleRevertPedido(row)}>
                  <Undo />
                </IconButton>
              </Tooltip>
            )}
            {puedeEliminar && (
              <Tooltip title="Eliminar Pedido">
                <IconButton color="error" onClick={() => handleConfirmDelete(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      },
    },
  ];
  if (!isLoading && pedidos.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes pedidos"
        subtitle="Puedes comenzar creando un pedido para tus clientes."
        buttonText="Crear pedido"
        onAction={() => navigate("/punto-pedido")}
      />
    );
  }

  return (
    <>
      <DataTable
        title="🗒️ Listado de Pedidos"
        columns={columns}
        rows={pedidos}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={(_, newPage) => setPage(newPage)}
        handleChangeRowsPerPage={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        loading={isLoading}
        errorMessage="No se pudieron cargar los pedidos o no existen datos disponibles."
      />
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={handleCloseAlert}
        onConfirm={handleDeletePedidoConfirmado}
        title="Confirmar Eliminación"
        message="¿Estás seguro que deseas eliminar este pedido? Esta acción no se puede deshacer."
      />
    </>
  );
};

export default ListarPedidos;
