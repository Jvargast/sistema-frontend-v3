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
import { Visibility, Cancel, Delete } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { useState } from "react";
import AlertDialog from "../../components/common/AlertDialog";
import Header from "../../components/common/Header";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useGetAllUsuariosConCajaQuery } from "../../store/services/usuariosApi";
import { exportarVentasExcel } from "../../utils/exportarExcel";
import LoaderComponent from "../../components/common/LoaderComponent";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

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

  const { data: vendedores, loading: loadingVendedores } =
    useGetAllUsuariosConCajaQuery();
  const [vendedorFiltro, setVendedorFiltro] = useState("");
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

    if (vendedorFiltro && venta.vendedor?.rut !== vendedorFiltro) return false;
    return true;
  });

  /**------------------------------------------------ */

  const headers = [
    "ID",
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

      <TextField
        select
        size="small"
        label="Vendedor"
        value={vendedorFiltro}
        onChange={(e) => setVendedorFiltro(e.target.value)}
        sx={{ minWidth: 180, mr: 2 }}
        disabled={loadingVendedores}
      >
        <MenuItem value="">Todos</MenuItem>
        {vendedores?.map((v) => (
          <MenuItem key={v.rut} value={v.rut}>
            {v.nombre} {v.apellido} - {v.Sucursal.nombre}
          </MenuItem>
        ))}
      </TextField>

      <Box display="flex" gap={2} mb={2} alignItems="center" flexWrap="wrap">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Desde"
            value={fechaInicio}
            onChange={setFechaInicio}
            slotProps={{
              textField: {
                size: "small",
                variant: "outlined",
                sx: { minWidth: 140, height: 40 },
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
                sx: { minWidth: 140, height: 40 },
              },
            }}
          />
        </LocalizationProvider>
        <Button
          variant="outlined"
          size="small"
          sx={{ height: 40, minWidth: 160, fontWeight: 500 }}
          onClick={() =>
            exportarVentasExcel({
              ventas: ventasFiltradas,
              fechaInicio,
              fechaFin,
              vendedorNombre: vendedorFiltro
                ? vendedores?.find((v) => v.rut === vendedorFiltro)?.nombre ||
                  ""
                : undefined,
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
            minWidth: 170,
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
              vendedorNombre: vendedorFiltro
                ? vendedores?.find((v) => v.rut === vendedorFiltro)?.nombre ||
                  ""
                : undefined,
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
      </Box>

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
