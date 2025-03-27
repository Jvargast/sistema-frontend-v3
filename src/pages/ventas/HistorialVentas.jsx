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
} from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";

const HistorialVentas = ({
  ventas,
  totalItems,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
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

      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        sx={{
          background: "linear-gradient(90deg, #4A90E2 0%, #6A5ACD 100%)",
          color: "#fff",
          py: 2,
          px: 3,
          borderRadius: 2,
          boxShadow: 1,
          fontSize: { xs: "1.1rem", sm: "1.4rem" },
        }}
      >
        🛒 Historial de Ventas
      </Typography>

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
                    color={
                      venta.estadoVenta?.nombre_estado === "Pagada"
                        ? "success"
                        : "warning"
                    }
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/ventas/ver/${venta.id_venta}`)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton color="secondary">
                    <Edit />
                  </IconButton>
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
                        backgroundColor: "#f4f6f8",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {ventas.length > 0 ? (
                  ventas.map(
                    ({
                      id_venta,
                      vendedor,
                      cliente,
                      total,
                      fecha,
                      estadoVenta,
                    }) => (
                      <TableRow key={id_venta} hover>
                        <TableCell align="center">{id_venta}</TableCell>
                        <TableCell align="center">
                          {vendedor?.nombre || "Desconocido"}
                        </TableCell>
                        <TableCell align="center">
                          {cliente?.nombre || "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          <Typography fontWeight="bold" color="primary">
                            ${parseFloat(total).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {new Date(fecha).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={estadoVenta?.nombre_estado || "Desconocido"}
                            color={
                              estadoVenta?.nombre_estado === "Pagada"
                                ? "success"
                                : "warning"
                            }
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/ventas/ver/${id_venta}`)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton color="secondary">
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  )
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

      {/* 🔁 Paginación siempre visible */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
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
            backgroundColor: "#f4f6f8",
            borderRadius: 2,
            px: 2,
          }}
        />
      </Box>
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
};

export default HistorialVentas;
