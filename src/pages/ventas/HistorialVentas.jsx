import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  IconButton,
  Chip,
  useMediaQuery,
  Tooltip,
  Button,
  Checkbox,
  TextField,
  MenuItem,
} from "@mui/material";
import { Visibility, Cancel, Delete, FilterAltOff } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { useEffect, useMemo, useState } from "react";
import AlertDialog from "../../components/common/AlertDialog";
import Header from "../../components/common/Header";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useGetAllUsuariosConCajaQuery } from "../../store/services/usuariosApi";
import { exportarVentasExcel } from "../../utils/exportarExcel";
import LoaderComponent from "../../components/common/LoaderComponent";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useSelector } from "react-redux";

const getVentaSucursalId = (v) =>
  Number(
    v?.id_sucursal ??
      v?.Sucursal?.id_sucursal ??
      v?.sucursal?.id_sucursal ??
      NaN
  );

const userOperaEnSucursal = (u, targetId) =>
  Number(u?.Sucursal?.id_sucursal) === targetId ||
  (u?.cajasAsignadas ?? []).some((c) => Number(c.id_sucursal) === targetId);

const HistorialVentas = ({
  ventas,
  totalItems,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
  onDeleteVenta,
  onRejectVenta,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const { mode, activeSucursalId, sucursales } = useSelector((s) => s.scope);

  const { data: vendedores, isLoading: loadingVendedores } =
    useGetAllUsuariosConCajaQuery();
  const [vendedorFiltro, setVendedorFiltro] = useState("");
  const [sucursalFiltro, setSucursalFiltro] = useState("");

  useEffect(() => {
    if (mode === "global") {
      setSucursalFiltro("");
    } else {
      setSucursalFiltro(String(activeSucursalId ?? ""));
    }
    setVendedorFiltro("");
  }, [mode, activeSucursalId]);

  useEffect(() => {
    if (mode === "global") setVendedorFiltro("");
  }, [sucursalFiltro, mode]);

  const vendedoresFiltrados = useMemo(() => {
    const base = vendedores ?? [];
    if (mode === "global" && !sucursalFiltro) return base;
    const targetId = Number(
      mode === "global" ? sucursalFiltro : activeSucursalId
    );
    if (!targetId) return base;
    return base.filter((u) => userOperaEnSucursal(u, targetId));
  }, [vendedores, mode, sucursalFiltro, activeSucursalId]);

  const sucursalesList = sucursales ?? [];

  const sucursalValueSafe = sucursalesList.some(
    (s) => String(s.id_sucursal) === String(sucursalFiltro)
  )
    ? String(sucursalFiltro)
    : "";

  const vendedorValueSafe = (vendedoresFiltrados ?? []).some(
    (v) => v.rut === vendedorFiltro
  )
    ? vendedorFiltro
    : "";

  /**
   * EXCEL EXPORT
   */

  const [selected, setSelected] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // Selección de checkbox
  const handleToggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const ventasFiltradas = ventas.filter((venta) => {
    if (fechaInicio && fechaFin) {
      const fechaVenta = new Date(venta.fecha);
      if (!(fechaVenta >= fechaInicio && fechaVenta <= fechaFin)) return false;
    }

    if (vendedorValueSafe && venta.vendedor?.rut !== vendedorValueSafe)
      return false;

    const vSuc = getVentaSucursalId(venta);
    if (mode === "global") {
      if (sucursalFiltro && Number(vSuc) !== Number(sucursalFiltro))
        return false;
    } else {
      if (activeSucursalId && Number(vSuc) !== Number(activeSucursalId))
        return false;
    }
    return true;
  });

  const filtrosActivos = Boolean(
    vendedorValueSafe ||
      (mode === "global" && sucursalValueSafe) ||
      fechaInicio ||
      fechaFin
  );

  const resetFiltros = () => {
    setVendedorFiltro("");
    setSucursalFiltro(mode === "global" ? "" : String(activeSucursalId ?? ""));
    setFechaInicio(null);
    setFechaFin(null);
    setSelected([]);
    handleChangePage?.(null, 0);
  };

  /**------------------------------------------------ */

  const headers = [
    "ID",
    "Sucursal",
    "Vendedor",
    "Cliente",
    "Total",
    "Fecha",
    "Estado",
    "Acciones",
  ];

  const [openAlert, setOpenAlert] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const handleConfirmDelete = (venta) => {
    setVentaSeleccionada(venta);
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setVentaSeleccionada(null);
  };

  const handleDeleteVentaConfirmada = () => {
    if (ventaSeleccionada) {
      onDeleteVenta(ventaSeleccionada);
    }
  };

  const vendedorExportName = vendedorValueSafe
    ? vendedores?.find((v) => v.rut === vendedorValueSafe)?.nombre || ""
    : undefined;

  const sucursalExportName =
    mode === "global"
      ? sucursales?.find(
          (s) => String(s.id_sucursal) === String(sucursalFiltro)
        )?.nombre || "Todas"
      : sucursales?.find(
          (s) => Number(s.id_sucursal) === Number(activeSucursalId)
        )?.nombre || "-";

  if (loadingVendedores) {
    return <LoaderComponent />;
  }

  return (
    <Box
      sx={{
        maxWidth: "100%",
        px: { xs: 2, sm: 4 },
        py: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ alignSelf: "flex-start" }}>
        <BackButton to="/admin" label="Volver" />
      </Box>

      <Header title="Ventas" subtitle="Gestión de Ventas" />
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#fff" : "background.paper",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {mode === "global" && (
          <TextField
            select
            size="small"
            label="Sucursal"
            value={sucursalValueSafe}
            onChange={(e) => setSucursalFiltro(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Todas</MenuItem>
            {sucursalesList.map((s) => (
              <MenuItem key={s.id_sucursal} value={String(s.id_sucursal)}>
                {s.nombre}
              </MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          select
          size="small"
          label="Vendedor"
          value={vendedorValueSafe}
          onChange={(e) => setVendedorFiltro(e.target.value)}
          sx={{ minWidth: 200 }}
          disabled={loadingVendedores}
        >
          <MenuItem value="">Todos</MenuItem>
          {vendedoresFiltrados?.map((v) => (
            <MenuItem key={v.rut} value={v.rut}>
              {v.nombre} {v.apellido} - {v.Sucursal.nombre}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Desde"
            value={fechaInicio}
            onChange={setFechaInicio}
            slotProps={{
              textField: {
                size: "small",
                variant: "outlined",
                sx: { minWidth: 160, height: 40 },
              },
            }}
          />
          <DatePicker
            label="Hasta"
            value={fechaFin}
            onChange={setFechaFin}
            slotProps={{
              textField: {
                size: "small",
                variant: "outlined",
                sx: { minWidth: 160, height: 40 },
              },
            }}
          />
        </LocalizationProvider>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="outlined"
          size="small"
          sx={{ height: 40, minWidth: 170, fontWeight: 500 }}
          onClick={() =>
            exportarVentasExcel({
              ventas: ventasFiltradas,
              fechaInicio,
              fechaFin,
              vendedorNombre: vendedorExportName,
              sucursalNombre: sucursalExportName,
              sucursales,
              onExportSuccess: (fileName) =>
                dispatch(
                  showNotification({
                    message: `Excel exportado exitosamente: ${fileName}`,
                    severity: "success",
                  })
                ),
            })
          }
        >
          Exportar por Fechas
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            height: 40,
            minWidth: 180,
            fontWeight: 500,
            boxShadow: "none",
            textTransform: "none",
          }}
          onClick={() =>
            exportarVentasExcel({
              ventas: ventasFiltradas.filter((v) =>
                selected.includes(v.id_venta)
              ),
              fechaInicio,
              fechaFin,
              vendedorNombre: vendedorExportName,
              sucursalNombre: sucursalExportName,
              sucursales,

              onExportSuccess: (fileName) =>
                dispatch(
                  showNotification({
                    message: `Excel exportado exitosamente: ${fileName}`,
                    severity: "success",
                  })
                ),
            })
          }
          disabled={!selected.length}
        >
          Exportar Seleccionadas
        </Button>

        <Button
          variant="text"
          size="small"
          startIcon={<FilterAltOff />}
          onClick={resetFiltros}
          disabled={!filtrosActivos}
          sx={{
            height: 40,
            fontWeight: 500,
            ml: { xs: 0, sm: 1 },
            color: (t) =>
              t.palette.mode === "light" ? "text.secondary" : "grey.300",
          }}
        >
          Limpiar filtros
        </Button>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.05)",
          overflowX: isMobile ? "auto" : "unset",
        }}
      >
        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ventasFiltradas.map((venta) => (
              <Paper
                key={venta.id_venta}
                sx={{
                  borderBottom: "1px solid #eee",
                  p: 2,
                  borderRadius: 2,
                  mb: 1,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  bgcolor: "#fff",
                }}
              >
                {/* Primera fila: Checkbox + ID + Estado */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mb={1}
                  justifyContent="space-between"
                >
                  <Checkbox
                    checked={selected.includes(venta.id_venta)}
                    onChange={() => handleToggleSelect(venta.id_venta)}
                    sx={{ p: 0.5 }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    #{venta.id_venta}
                  </Typography>
                  <Chip
                    label={venta.estadoVenta?.nombre_estado || "Desconocido"}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor:
                        venta.estadoVenta?.nombre_estado === "Pagada"
                          ? "#4CAF50"
                          : venta.estadoVenta?.nombre_estado === "Rechazada"
                          ? "#E53935"
                          : venta.estadoVenta?.nombre_estado === "Cancelada"
                          ? "#FB8C00"
                          : venta.estadoVenta?.nombre_estado ===
                            "Pendiente de Pago"
                          ? "#FFCA28"
                          : "#BDBDBD",
                      color: "#fff",
                      borderRadius: "8px",
                      px: 1.5,
                      py: 0.5,
                      ml: 1,
                    }}
                  />
                </Box>
                {/* Segunda fila: Vendedor, Cliente, Total, Fecha */}
                <Box display="flex" flexDirection="column" gap={0.5} mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Vendedor:</strong>{" "}
                    {venta.vendedor?.nombre || "Desconocido"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Cliente:</strong> {venta.cliente?.nombre || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Total:</strong>{" "}
                    <Typography
                      component="span"
                      color="primary"
                      fontWeight="bold"
                    >
                      ${parseFloat(venta.total).toLocaleString()}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Fecha:</strong>{" "}
                    {new Date(venta.fecha).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Sucursal:</strong>{" "}
                    {mode === "global"
                      ? sucursales?.find(
                          (s) =>
                            Number(s.id_sucursal) === getVentaSucursalId(venta)
                        )?.nombre ||
                        `Sucursal ${getVentaSucursalId(venta) || "-"}`
                      : sucursales?.find(
                          (s) =>
                            Number(s.id_sucursal) === Number(activeSucursalId)
                        )?.nombre || "-"}
                  </Typography>
                </Box>
                {/* Acciones */}
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Tooltip title="Ver Detalle">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/admin/ventas/ver/${venta.id_venta}`)
                      }
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Rechazar Venta">
                    <IconButton
                      color="warning"
                      onClick={() => onRejectVenta(venta)}
                    >
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar Venta">
                    <IconButton
                      color="error"
                      onClick={() => handleConfirmDelete(venta)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < ventasFiltradas.length
                      }
                      checked={
                        ventasFiltradas.length > 0 &&
                        selected.length === ventasFiltradas.length
                      }
                      onChange={() => {
                        if (selected.length === ventasFiltradas.length)
                          setSelected([]);
                        else
                          setSelected(ventasFiltradas.map((v) => v.id_venta));
                      }}
                    />
                  </TableCell>
                  {headers.map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {ventasFiltradas.length > 0 ? (
                  ventasFiltradas.map((venta) => (
                    <TableRow key={venta.id_venta} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(venta.id_venta)}
                          onChange={() => handleToggleSelect(venta.id_venta)}
                        />
                      </TableCell>
                      <TableCell align="center">{venta.id_venta}</TableCell>
                      <TableCell align="center">
                        {(() => {
                          const id = getVentaSucursalId(venta);
                          const s = sucursales?.find(
                            (x) => Number(x.id_sucursal) === id
                          );
                          return s?.nombre || `Sucursal ${id || "-"}`;
                        })()}
                      </TableCell>
                      <TableCell align="center">
                        {venta.vendedor?.nombre || "Desconocido"}
                      </TableCell>
                      <TableCell align="center">
                        {venta.cliente?.nombre || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight="bold" color="primary">
                          ${parseFloat(venta.total).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {new Date(venta.fecha).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            venta.estadoVenta?.nombre_estado || "Desconocido"
                          }
                          sx={{
                            fontWeight: "bold",
                            backgroundColor:
                              venta.estadoVenta?.nombre_estado === "Pagada"
                                ? "#4CAF50"
                                : venta.estadoVenta?.nombre_estado ===
                                  "Rechazada"
                                ? "#E53935"
                                : venta.estadoVenta?.nombre_estado ===
                                  "Cancelada"
                                ? "#FB8C00"
                                : venta.estadoVenta?.nombre_estado ===
                                  "Pendiente de Pago"
                                ? "#FFCA28"
                                : "#BDBDBD",
                            color: "#fff",
                            borderRadius: "8px",
                            px: 1.5,
                            py: 0.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver Detalle">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate(`/admin/ventas/ver/${venta.id_venta}`)
                            }
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar Venta">
                          <IconButton
                            color="warning"
                            onClick={() => onRejectVenta(venta)}
                          >
                            <Cancel />{" "}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar Venta">
                          <IconButton
                            color="error"
                            onClick={() => handleConfirmDelete(venta)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" color="gray">
                        No hay ventas disponibles
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* 🔁 Paginación */}
      <Box
        sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}
      >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderRadius: 2,
            px: 2,
          }}
        />
      </Box>
      <AlertDialog
        openAlert={openAlert}
        onCloseAlert={handleCloseAlert}
        onConfirm={handleDeleteVentaConfirmada}
        title="Confirmar Eliminación"
        message="¿Estás seguro que deseas eliminar esta venta? Esta acción no se puede deshacer."
      />
    </Box>
  );
};

HistorialVentas.propTypes = {
  ventas: PropTypes.array.isRequired,
  totalItems: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  onDeleteVenta: PropTypes.func.isRequired,
  onRejectVenta: PropTypes.func.isRequired,
};

export default HistorialVentas;
