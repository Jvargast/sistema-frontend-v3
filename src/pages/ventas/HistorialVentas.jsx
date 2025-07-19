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
} from "@mui/material";
import { Visibility, Cancel, Delete } from "@mui/icons-material"; 
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { useState } from "react";
import AlertDialog from "../../components/common/AlertDialog";
import Header from "../../components/common/Header";

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
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

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
        elevation={3}
        sx={{
          borderRadius: 3,
          boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.05)",
          overflowX: isMobile ? "auto" : "unset",
        }}
      >
        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {ventas.map((venta) => (
              <Box
                key={venta.id_venta}
                sx={{
                  borderBottom: "1px solid #eee",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.2,
                }}
              >
                <Typography>
                  <strong>ID:</strong> {venta.id_venta}
                </Typography>
                <Typography>
                  <strong>Vendedor:</strong>{" "}
                  {venta.vendedor?.nombre || "Desconocido"}
                </Typography>
                <Typography>
                  <strong>Cliente:</strong> {venta.cliente?.nombre || "N/A"}
                </Typography>
                <Typography>
                  <strong>Total:</strong>{" "}
                  <Typography
                    component="span"
                    color="primary"
                    fontWeight="bold"
                  >
                    ${parseFloat(venta.total).toLocaleString()}
                  </Typography>
                </Typography>
                <Typography>
                  <strong>Fecha:</strong>{" "}
                  {new Date(venta.fecha).toLocaleDateString()}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <strong>Estado:</strong>
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
                    }}
                  />
                </Box>
                <Box display="flex" justifyContent="center" gap={1}>
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
              </Box>
            ))}
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
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
                {ventas.length > 0 ? (
                  ventas.map((venta) => (
                    <TableRow key={venta.id_venta} hover>
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
