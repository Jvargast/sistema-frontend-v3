import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Alert,
  Pagination,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useGetMovimientosByCajaQuery } from "../../store/services/movimientoCajaApi";

const MovimientosCajaModal = ({ idCaja, onClose }) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); 
  const [movimientos, setMovimientos] = useState([]); 
  const [errorMensaje, setErrorMensaje] = useState(null); 
  const [page, setPage] = useState(1); 
  const limit = 10; 

  const { data, error, isLoading, refetch } = useGetMovimientosByCajaQuery(
    { id_caja: idCaja, fecha, page, limit },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (isLoading) {
      setMovimientos([]); 
      setErrorMensaje(null);
    } else if (data?.movimientos?.length > 0) {
      setMovimientos(data.movimientos);
      setErrorMensaje(null);
    } else {
      setMovimientos([]);
      setErrorMensaje("📌 No hay movimientos registrados para esta fecha.");
    }
  }, [data, isLoading, error]);

  const cambiarFecha = (dias) => {
    setMovimientos([]); 
    setErrorMensaje(null);
    setPage(1); 
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFecha(nuevaFecha.toISOString().split("T")[0]);
    refetch();
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    refetch();
  };
  console.log(data?.paginacion)

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Movimientos de Caja #{idCaja}</DialogTitle>
      <DialogContent dividers>
        {/* Selector de fecha con navegación */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
          <IconButton onClick={() => cambiarFecha(-1)} color="primary">
            <ArrowBack />
          </IconButton>
          <TextField
            label="Seleccionar Fecha"
            type="date"
            value={fecha}
            onChange={(e) => {
              setMovimientos([]); 
              setErrorMensaje(null);
              setFecha(e.target.value);
              setPage(1);
              refetch();
            }}
            sx={{ flex: 1 }}
          />
          <IconButton onClick={() => cambiarFecha(1)} color="primary">
            <ArrowForward />
          </IconButton>
        </Box>

        {/* Manejo de carga y errores */}
        {isLoading && (
          <Typography align="center" sx={{ mt: 2 }}>
            <CircularProgress size={24} /> Cargando movimientos...
          </Typography>
        )}
        {errorMensaje && !isLoading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {errorMensaje}
          </Alert>
        )}

        {/* Lista de movimientos */}
        <List sx={{ maxHeight: 400, overflowY: "auto" }}>
          {movimientos.map((mov) => (
            <ListItem key={mov.id_movimiento} sx={{ borderBottom: "1px solid #e0e0e0" }}>
              <ListItemText
                primary={`Venta #${mov.id_venta || "N/A"} - ${mov.tipo_movimiento.toUpperCase()} - $${Number(mov.monto || 0).toFixed(2)}`}
                secondary={`📅 Fecha: ${new Date(mov.fecha_movimiento).toLocaleString("es-ES")}`}
              />
            </ListItem>
          ))}
        </List>

        {/* Paginación */}
        {!isLoading && !errorMensaje && data?.paginacion?.totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={data?.paginacion?.totalPages || 1}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

MovimientosCajaModal.propTypes = {
  idCaja: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MovimientosCajaModal;
