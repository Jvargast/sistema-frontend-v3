import {
  Box,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Button,
} from "@mui/material";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { useGetAllViajesQuery } from "../../store/services/agendaViajesApi";
import ViajeCard from "../../components/viaje/ViajeCard";
import BackButton from "../../components/common/BackButton";

const EstadosViaje = ["Todos", "Pendiente", "En Tránsito", "Finalizado"];

const AdminHistorialViajes = () => {
  const { data: viajes, isLoading, isError } = useGetAllViajesQuery();
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroChofer, setFiltroChofer] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const viajesFiltrados = useMemo(() => {
    if (!viajes?.length) return [];

    return viajes.filter((viaje) => {
      const coincideEstado =
        filtroEstado === "Todos" || viaje.estado === filtroEstado;
      const coincideChofer =
        !filtroChofer ||
        viaje.chofer?.nombre
          ?.toLowerCase()
          .includes(filtroChofer.toLowerCase()) ||
        viaje.chofer?.apellido
          ?.toLowerCase()
          .includes(filtroChofer.toLowerCase());
      const coincideFecha = !filtroFecha
        ? true
        : dayjs(viaje.fecha_inicio).format("YYYY-MM-DD") === filtroFecha;

      return coincideEstado && coincideChofer && coincideFecha;
    });
  }, [viajes, filtroEstado, filtroChofer, filtroFecha]);

  return (
    <Box px={2} py={4}>
      <BackButton to="/admin" label="Volver al menú"/>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Historial de Viajes
      </Typography>

      <Paper
        elevation={2}
        sx={{ p: 3, borderRadius: 3, mb: 4, backgroundColor: "#fefefe" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtroEstado}
                label="Estado"
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                {EstadosViaje.map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    {estado}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar chofer"
              value={filtroChofer}
              onChange={(e) => setFiltroChofer(e.target.value)}
              placeholder="Nombre o apellido"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="date"
              label="Fecha del viaje"
              InputLabelProps={{ shrink: true }}
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                setFiltroEstado("Todos");
                setFiltroChofer("");
                setFiltroFecha("");
              }}
            >
              Reiniciar filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Typography textAlign="center">Cargando viajes...</Typography>
      ) : isError ? (
        <Typography color="error" textAlign="center">
          Error al cargar los viajes.
        </Typography>
      ) : viajesFiltrados.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No se encontraron viajes con los filtros aplicados.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {viajesFiltrados.map((viaje) => (
            <Grid item key={viaje.id_agenda_viaje} xs={12} sm={6} md={4}>
              <ViajeCard viaje={viaje} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminHistorialViajes;
