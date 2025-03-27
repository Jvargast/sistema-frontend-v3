import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import PropTypes from "prop-types";
import { useGetHistorialPedidosQuery } from "../../store/services/pedidosApi";

const HistorialPedidos = ({ onClose }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // 🔹 Formatear fecha a YYYY-MM-DD para enviarla correctamente al backend
  const fechaFormatted = fechaSeleccionada.toISOString().split("T")[0];

  // 🔹 Obtener datos del historial de pedidos con paginación
  const {
    data: pedidosData,
    isLoading,
    isError,
    refetch,
  } = useGetHistorialPedidosQuery(
    { fecha: fechaFormatted, page: currentPage, limit },
    { refetchOnMountOrArgChange: true }
  );

  const pedidos = pedidosData?.pedidos || [];
  const paginacion = pedidosData?.paginacion || { totalPages: 1, currentPage: 1 };

  // 🔹 Refetch cuando cambia la fecha o la página
  useEffect(() => {
    setCurrentPage(1);
    refetch({ fecha: fechaFormatted, page: 1, limit });
  }, [fechaFormatted, refetch]);

  useEffect(() => {
    refetch({ fecha: fechaFormatted, page: currentPage, limit });
  }, [currentPage, fechaFormatted, refetch]);

  // 🔹 Manejar cambio de fecha
  const handleFechaChange = (newFecha) => {
    setFechaSeleccionada(newFecha);
  };

  // 🔹 Manejar cambio de página
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "85vh",
        overflow: "hidden",
        bgcolor: "#fff",
        p: 3,
        borderRadius: 3,
        boxShadow: 1, // Sombra sutil
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        📅 Historial de Pedidos
      </Typography>

      {/* Calendario con estilo limpio */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          border: "1px solid #ddd",
          backgroundColor: "#fafafa",
        }}
      >
        <Calendar
          onChange={handleFechaChange}
          value={fechaSeleccionada}
          locale="es-ES"
        />
      </Box>

      <Typography variant="body1" mb={2} fontWeight="500">
        Mostrando pedidos de:{" "}
        <strong style={{ color: "#1976d2" }}>
          {fechaSeleccionada.toLocaleDateString()}
        </strong>
      </Typography>

      {/* Contenedor scrollable para los pedidos */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 650,
          flex: 1,
          overflowY: "auto",
          p: 2,
          borderRadius: 3,
          border: "1px solid #ddd",
          maxHeight: "50vh",
          backgroundColor: "#fafafa",
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography textAlign="center" color="error">
            ❌ Error al cargar los pedidos.
          </Typography>
        ) : pedidos.length > 0 ? (
          <List>
            {pedidos.map((pedido) => (
              <Box
                key={pedido.id_pedido}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "#f0f8ff",
                  },
                }}
              >
                <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
                  <ListItemText
                    primary={`Pedido #${pedido.id_pedido}`}
                    secondary={`Total: $${pedido.total}`}
                    sx={{ fontWeight: "bold" }}
                  />
                  <Chip
                    label={pedido.EstadoPedido.nombre_estado}
                    color="primary"
                    sx={{ fontWeight: "500" }}
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="gray" mt={2} textAlign="center">
            No hay pedidos en esta fecha.
          </Typography>
        )}
      </Box>

      {/* Paginación limpia y mejor alineada */}
      {paginacion.totalPages > 1 && (
        <Pagination
          count={paginacion.totalPages}
          page={paginacion.currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2, "& .MuiPaginationItem-root": { fontSize: "0.875rem" } }}
        />
      )}

      {/* Botón de cerrar más compacto y responsivo */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          mt: 3,
          px: 2,
          py: 1,
          fontSize: "0.875rem",
          fontWeight: "bold",
          borderRadius: 2,
          textTransform: "none",
          "@media (max-width: 600px)": {
            width: "100%", // Se adapta en móviles
          },
        }}
        onClick={onClose}
      >
        Cerrar
      </Button>
    </Box>
  );
};

HistorialPedidos.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default HistorialPedidos;
