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
  Box,
} from "@mui/material";
import { Visibility, Undo, MoreVert, Block } from "@mui/icons-material";
import {
  useGetAllPedidosQuery,
  useDeletePedidoMutation,
  useRevertirEstadoPedidoMutation,
  useCancelarPedidoMutation,
} from "../../store/services/pedidosApi";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import AlertDialog from "../../components/common/AlertDialog";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import { useRegisterRefresh } from "../../hooks/useRegisterRefresh";
import StatusLegend from "../../components/common/StatusLegend";
import FilterBar from "../../components/common/FilterBar";

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

const ESTADO_FILTRO_OPCIONES = [
  { value: "no_cancelados", label: "Activos (sin cancelados)" },
  { value: "todos", label: "Todos" },
  { value: "Pendiente", label: "Pendiente" },
  { value: "Pendiente de Confirmación", label: "Pendiente de Confirmación" },
  { value: "Confirmado", label: "Confirmado" },
  { value: "En Preparación", label: "En Preparación" },
  { value: "En Entrega", label: "En Entrega" },
  { value: "Completada", label: "Completada" },
  { value: "Cancelada", label: "Cancelada" },
];

const ESTADO_PEDIDOS = [
  {
    id: "Pendiente",
    label: "Pendiente",
    color: (theme) => theme.palette.warning.main,
    description: "Pedido creado, sin procesar.",
  },
  {
    id: "Pendiente de Confirmación",
    label: "Pendiente de confirmación",
    color: (theme) =>
      theme.palette.mode === "light"
        ? theme.palette.grey[500]
        : theme.palette.grey[400],
    description: "Chofer debe aceptar o rechazar el pedido.",
  },
  {
    id: "Confirmado",
    label: "Confirmado",
    color: (theme) => theme.palette.success.main,
    description: "Aprobado y listo para preparar.",
  },
  {
    id: "En preparación",
    label: "En preparación",
    color: (theme) => theme.palette.info.main,
    description: "Armando el pedido en bodega.",
  },
  {
    id: "En entrega",
    label: "En entrega",
    color: (theme) => theme.palette.primary.main,
    description: "En ruta hacia el cliente.",
  },
  {
    id: "Completada",
    label: "Completada",
    color: (theme) => theme.palette.success.light,
    description: "Pedido entregado correctamente.",
  },
  {
    id: "Cancelada",
    label: "Cancelada",
    color: (theme) => theme.palette.error.main,
    description: "Pedido anulado, sin movimiento activo.",
  },
];

function getEstadosAnteriores(estadoActual) {
  const idx = ESTADOS_ORDEN.indexOf(estadoActual);
  if (idx <= 0) return [];

  return ESTADOS_ORDEN.slice(0, idx).map((nombre) => ({
    nombre,
    id: ESTADOS_MAP[nombre],
  }));
}

const FILTER_CONFIG = [
  {
    id: "estado",
    type: "select",
    label: "Estado",
    minWidth: 200,
    options: ESTADO_FILTRO_OPCIONES.map((opt) => {
      const codigo = ESTADOS_MAP[opt.value];
      return {
        value: opt.value,
        label: codigo ? `${codigo} - ${opt.label}` : opt.label,
      };
    }),
  },
  {
    id: "cliente",
    type: "text",
    label: "Buscar cliente",
    minWidth: 200,
    adornment: "search",
  },
  {
    id: "rangoFecha",
    type: "daterange",
    fromId: "fechaDesde",
    toId: "fechaHasta",
    labelFrom: "Desde",
    labelTo: "Hasta",
    colSpan: 2,
  },
];

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
  const [alertMode, setAlertMode] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const [cancelarPedido, { isLoading: isCancelling }] =
    useCancelarPedidoMutation();
  const [deletePedido] = useDeletePedidoMutation();
  const [revertirEstadoPedido] = useRevertirEstadoPedidoMutation();

  const [sucursalFiltro, setSucursalFiltro] = useState("");
  const initialFilters = {
    estado: "no_cancelados",
    cliente: "",
    fechaDesde: "",
    fechaHasta: "",
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    if (mode === "global") {
      setSucursalFiltro("");
    } else {
      setSucursalFiltro(String(activeSucursalId ?? ""));
    }
  }, [mode, activeSucursalId]);

  useEffect(() => {
    setPage(0);
  }, [
    mode,
    activeSucursalId,
    sucursalFiltro,
    filters.estado,
    filters.cliente,
    filters.fechaDesde,
    filters.fechaHasta,
  ]);

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

    const estado = pedido.EstadoPedido?.nombre_estado || "Desconocido";
    const estadoFiltro = filters.estado;

    if (estadoFiltro === "no_cancelados" && estado === "Cancelada") {
      return false;
    }

    if (
      estadoFiltro !== "no_cancelados" &&
      estadoFiltro !== "todos" &&
      estadoFiltro !== "" &&
      estado !== estadoFiltro
    ) {
      return false;
    }

    if (filters.cliente.trim()) {
      const nombreCliente = (pedido.Cliente?.nombre || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
      const buscado = filters.cliente
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

      if (!nombreCliente.includes(buscado)) return false;
    }

    const fechaPedido = pedido.fecha_pedido
      ? new Date(pedido.fecha_pedido)
      : null;

    if (filters.fechaDesde) {
      const desdeDate = new Date(`${filters.fechaDesde}T00:00:00`);
      if (!fechaPedido || fechaPedido < desdeDate) return false;
    }

    if (filters.fechaHasta) {
      const hastaDate = new Date(`${filters.fechaHasta}T23:59:59`);
      if (!fechaPedido || fechaPedido > hastaDate) return false;
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

  const handleConfirmAlert = async () => {
    if (!pedidoSeleccionado || !alertMode) return;

    try {
      if (alertMode === "cancel") {
        await cancelarPedido({
          id_pedido: pedidoSeleccionado.id_pedido,
          motivo: "Cancelación administrativa desde listado",
        }).unwrap();

        await refetch();

        dispatch(
          showNotification({
            message: "Pedido cancelado correctamente.",
            severity: "success",
          })
        );
      } else if (alertMode === "delete") {
        await deletePedido(pedidoSeleccionado.id_pedido).unwrap();
        await refetch();
        dispatch(
          showNotification({
            message: "Pedido eliminado correctamente.",
            severity: "success",
          })
        );
      }
    } catch (error) {
      const msg =
        alertMode === "cancel"
          ? `Error al cancelar el pedido: ${
              error?.data?.message || error.message
            }`
          : `Error al eliminar: ${error?.data?.error || error.message}`;

      dispatch(
        showNotification({
          message: msg,
          severity: "error",
        })
      );
    } finally {
      setOpenAlert(false);
      setPedidoSeleccionado(null);
      setAlertMode(null);
    }
  };

  const handleFilterChange = (id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setPedidoSeleccionado(null);
    setAlertMode(null);
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

        const esCancelada = estado === "Cancelada";

        const puedeCancelar =
          !row.pagado &&
          ["Pendiente", "Pendiente de Confirmación", "Confirmado"].includes(
            estado
          );

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
                {!esCancelada && (
                  <>
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
                  </>
                )}

                {esCancelada && (
                  <MenuItem disabled>
                    <ListItemIcon>
                      <Block fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Pedido cancelado (no reversible)" />
                  </MenuItem>
                )}

                {puedeCancelar && (
                  <MenuItem
                    disabled={isCancelling}
                    onClick={() => {
                      setPedidoSeleccionado(row);
                      setAlertMode("cancel");
                      setOpenAlert(true);
                      handleCloseMenu();
                    }}
                  >
                    <ListItemIcon>
                      <Block fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Cancelar pedido" />
                  </MenuItem>
                )}
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
        headerAction={
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "stretch" },
              gap: 2,
              width: "100%",
              mb: 2,
            }}
          >
            <FilterBar
              config={FILTER_CONFIG}
              values={filters}
              onChange={handleFilterChange}
              columns={2}
              onReset={() => setFilters(initialFilters)}
            />

            <StatusLegend columns={4} items={ESTADO_PEDIDOS} maxWidth={620} />
          </Box>
        }
      />

      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={handleCloseAlert}
        onConfirm={handleConfirmAlert}
        title={
          alertMode === "cancel"
            ? "Confirmar cancelación"
            : "Confirmar eliminación"
        }
        message={
          alertMode === "cancel"
            ? "¿Estás seguro que deseas cancelar este pedido? Esto puede anular documentos asociados y no se puede deshacer."
            : "¿Estás seguro que deseas eliminar este pedido? Esta acción no se puede deshacer."
        }
      />
    </>
  );
};

export default ListarPedidos;
