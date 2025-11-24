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
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import AlertDialog from "../../components/common/AlertDialog";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";

const getVentaSucursalId = (v) =>
  Number(
    v?.id_sucursal ??
      v?.Sucursal?.id_sucursal ??
      v?.sucursal?.id_sucursal ??
      NaN
  );

const ESTADOS_ORDEN = [
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
  const idx = ESTADOS_ORDEN.indexOf(estadoActual);
  return ESTADOS_ORDEN.slice(0, idx).map((nombre) => ({
    nombre,
    id: ESTADOS_MAP[nombre],
  }));
}

const estadoColores = {
  Pendiente: "warning",
  "Pendiente de Confirmación": "default", 
  Confirmado: "success",
  "Pendiente de Pago": "warning",
  Pagada: "success",
  Rechazado: "error",
  "En Preparación": "info",
  "En Entrega": "primary",
  Completada: "success",
  Cancelada: "error",
  Reembolsada: "default",
  Rechazada: "error",
  "Completada y Entregada": "success",
};

const getPedidoSucursalId = (p) =>
  Number(
    p?.id_sucursal ??
      p?.Sucursal?.id_sucursal ??
      p?.sucursal?.id_sucursal ??
      NaN
  );

const ListarPedidos = () => {
  const {
    mode,
    activeSucursalId,
    sucursales = [],
  } = useSelector((s) => s.scope);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch, isError } = useGetAllPedidosQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  useRegisterRefresh(
    "pedidos",
    async () => {
      await Promise.all([refetch()]);
      return true;
    },
    [refetch]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [rowMenuTarget, setRowMenuTarget] = useState(null);
  const [isReverting, setIsReverting] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const [deletePedido] = useDeletePedidoMutation();
  const [revertirEstadoPedido] = useRevertirEstadoPedidoMutation();

  const [sucursalFiltro, setSucursalFiltro] = useState("");

  useEffect(() => {
    if (mode === "global") {
      setSucursalFiltro("");
    } else {
      setSucursalFiltro(String(activeSucursalId ?? ""));
    }
  }, [mode, activeSucursalId]);

  useEffect(() => {
    setPage(0);
  }, [mode, activeSucursalId, sucursalFiltro]);

  const pedidos = useMemo(() => data?.pedidos || [], [data]);
  const totalItems = useMemo(() => data?.paginacion.totalItems || 0, [data]);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const vSuc = getVentaSucursalId(pedido);
    if (mode === "global") {
      if (sucursalFiltro && Number(vSuc) !== Number(sucursalFiltro))
        return false;
    } else {
      if (activeSucursalId && Number(vSuc) !== Number(activeSucursalId))
        return false;
    }
    return true;
  });

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

  const columns = [
    {
      id: "id_pedido",
      label: "ID",
      render: (row) => Number(row.id_pedido),
    },
    {
      id: "sucursal",
      label: "Sucursal",
      render: (row) => {
        const nombre =
          row?.Sucursal?.nombre ||
          (sucursales.find(
            (s) => Number(s.id_sucursal) === Number(getPedidoSucursalId(row))
          )?.nombre ??
            (row?.id_sucursal ? `Sucursal ${row.id_sucursal}` : "—"));
        return <Chip label={nombre} size="small" sx={{ fontWeight: "bold" }} />;
      },
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
  if (!isLoading && totalItems === 0) {
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
        rows={pedidosFiltrados}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={(_, newPage) => setPage(newPage)}
        handleChangeRowsPerPage={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        loading={isLoading}
        errorMessage={
          isError ? "No se pudieron cargar los pedidos." : undefined
        }
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
