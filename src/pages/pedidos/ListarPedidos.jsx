import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Visibility, Undo, MoreVert } from "@mui/icons-material";
import {
  useGetAllPedidosQuery,
  useDeletePedidoMutation,
  useRevertirEstadoPedidoMutation,
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

  const [anchorEl, setAnchorEl] = useState(null);
  const [rowMenuTarget, setRowMenuTarget] = useState(null);
  const [isReverting, setIsReverting] = useState(false);

  const [deletePedido] = useDeletePedidoMutation();
  const [revertirEstadoPedido] = useRevertirEstadoPedidoMutation();
  const dispatch = useDispatch();
  const [openAlert, setOpenAlert] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const estados = [
    "Pendiente",
    "Pendiente de Confirmación",
    "Confirmado",
    "En Preparación",
    "En Entrega",
    "Completada",
  ];

  const ESTADOS_MAP = {
    Pendiente: 1,
    "Pendiente de Confirmación": 4,
    Confirmado: 5,
    "En Preparación": 7,
    "En Entrega": 8,
    Completada: 9,
    Cancelada: 10,
    Reembolsada: 11,
    "Completada y Entregada": 13,
  };

  function getEstadosAnteriores(estadoActual) {
    const idx = estados.indexOf(estadoActual);
    return estados.slice(0, idx).map((nombre) => ({
      nombre,
      id: ESTADOS_MAP[nombre],
    }));
  }

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setRowMenuTarget(row);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setRowMenuTarget(null);
  };

  const handleRevertirEstado = async (row, id_estado_destino) => {
    setIsReverting(true);
    try {
      await revertirEstadoPedido({
        id_pedido: row.id_pedido,
        id_estado_destino,
      }).unwrap();
      refetch();
      dispatch(
        showNotification({
          message: "Pedido revertido correctamente.",
          severity: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al revertir: ${
            error?.data?.message || error.message
          }`,
          severity: "error",
        })
      );
    }
    setIsReverting(false);
    handleCloseMenu();
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
        const estadosDisponibles = getEstadosAnteriores(estado);

        return (
          <>
            <Tooltip title="Ver Detalle">
              <IconButton
                color="primary"
                onClick={() => navigate(`/admin/pedidos/ver/${row.id_pedido}`)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Más acciones">
              <IconButton onClick={(e) => handleOpenMenu(e, row)}>
                <MoreVert />
              </IconButton>
            </Tooltip>
            {rowMenuTarget?.id_pedido === row.id_pedido && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                elevation={3}
                sx={{ zIndex: 2000 }}
              >
                <MenuItem disabled>Revertir a estado...</MenuItem>
                {estadosDisponibles.length === 0 && (
                  <MenuItem disabled>No hay estados disponibles</MenuItem>
                )}
                {estadosDisponibles.map(({ nombre, id }) => (
                  <MenuItem
                    key={nombre}
                    disabled={isReverting}
                    onClick={() => handleRevertirEstado(row, id)}
                  >
                    <ListItemIcon>
                      <Undo fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={nombre} />
                  </MenuItem>
                ))}
              </Menu>
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
        title="Listado de Pedidos"
        subtitle="Gestión de Pedidos"
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
