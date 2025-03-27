import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Pagination,
  Paper,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/es"; 
import { useGetAllMovimientosCajaQuery } from "../../store/services/movimientoCajaApi";

const MovimientosCajaList = () => {
  const [page, setPage] = useState(1);
  const [fecha, setFecha] = useState(dayjs()); 
  const limit = 10;

  const { data, error, isLoading, refetch } = useGetAllMovimientosCajaQuery({
    page,
    limit,
    fecha: fecha.format("YYYY-MM-DD"), 
  });

  useEffect(() => {
    refetch();
  }, [fecha, refetch]);

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    refetch();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box mt={3}>
        {/* Filtro de Fecha con DatePicker en formato DD/MM/YYYY */}
        <Box display="flex" justifyContent="center" mb={3}>
          <DatePicker
            label="Seleccionar Fecha"
            value={fecha}
            format="DD/MM/YYYY" 
            onChange={(newDate) => {
              setFecha(newDate || dayjs()); 
              setPage(1);
            }}
            slotProps={{ textField: { variant: "outlined" } }}
          />
        </Box>

        {/* Cargando o Error */}
        {isLoading && (
          <Typography align="center" sx={{ mt: 2 }}>
            <CircularProgress size={24} /> Cargando movimientos...
          </Typography>
        )}
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            ❌ Error al cargar los movimientos.
          </Typography>
        )}

        {/* Lista de Movimientos */}
        {!isLoading && !error && (
          <Paper sx={{ maxHeight: 400, overflowY: "auto", p: 2 }}>
            {data?.movimientos?.length > 0 ? (
              <List>
                {data?.movimientos.map((mov) => (
                  <ListItem key={mov.id_movimiento} sx={{ borderBottom: "1px solid #e0e0e0" }}>
                    <ListItemText
                      primary={`Caja #${mov.id_caja} - Venta #${mov.id_venta || "N/A"}`}
                      secondary={`${mov.tipo_movimiento.toUpperCase()} - $${Number(mov.monto || 0).toFixed(2)} 📅 ${dayjs(mov.fecha_movimiento).format("DD/MM/YYYY HH:mm")}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography align="center" sx={{ mt: 2, fontStyle: "italic", color: "gray" }}>
                📌 Este día no tiene movimientos de caja asociados.
              </Typography>
            )}
          </Paper>
        )}

        {/* Paginación */}
        {!isLoading && !error && data?.paginacion?.totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={data?.paginacion?.totalPages || 1}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default MovimientosCajaList;
