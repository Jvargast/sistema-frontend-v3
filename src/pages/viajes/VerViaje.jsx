import { useParams } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import InfoGeneral from "../../components/viaje/InfoGeneral";
import DestinosMap from "../../components/viaje/DestinosMap";
import { convertirFechaLocal } from "../../utils/fechaUtils";
import { useGetViajeByIdQuery } from "../../store/services/agendaViajesApi";
import { useGetEntregasByAgendaIdQuery } from "../../store/services/entregasApi";

const VerViaje = () => {
  const { id } = useParams();

  const { data: viaje, isLoading, error } = useGetViajeByIdQuery(id);
  const {
    data: entregasData,
    isLoading: loadingEntregas,
    error: errorEntregas,
  } = useGetEntregasByAgendaIdQuery({ id_agenda_viaje: id }, { skip: !id });

  if (isLoading || loadingEntregas)
    return (
      <Box p={4} textAlign="center">
        <CircularProgress size={36} />
        <Typography mt={2}>Cargando información del viaje...</Typography>
      </Box>
    );

  if (error || !viaje || errorEntregas)
    return (
      <Box p={4} textAlign="center">
        <Typography color="error" variant="h6">
          Error al cargar el viaje.
        </Typography>
      </Box>
    );

  const entregasPorPedido = {};
  if (entregasData?.data?.length > 0) {
    entregasData.data.forEach((entrega) => {
      const idPedido = entrega?.pedido?.id_pedido;
      if (idPedido) entregasPorPedido[idPedido] = entrega;
    });
  }

  const destinosEntregadosConCoords = viaje.destinos
    .filter(
      (d) =>
        entregasPorPedido[d.id_pedido] &&
        typeof d.lat === "number" &&
        typeof d.lng === "number"
    )
    .sort((a, b) => {
      const entregaA = entregasPorPedido[a.id_pedido];
      const entregaB = entregasPorPedido[b.id_pedido];
      return (
        new Date(entregaA.fecha_hora).getTime() -
        new Date(entregaB.fecha_hora).getTime()
      );
    })
    .map((d) => ({
      lat: d.lat,
      lng: d.lng,
      nombre_cliente: d.nombre_cliente,
      direccion: d.direccion,
      hora: entregasPorPedido[d.id_pedido]?.fecha_hora || null,
    }));

  const origenValido =
    viaje.origen_inicial &&
    typeof viaje.origen_inicial.lat === "number" &&
    typeof viaje.origen_inicial.lng === "number"
      ? {
          lat: viaje.origen_inicial.lat,
          lng: viaje.origen_inicial.lng,
          nombre_cliente: "Origen",
          direccion: viaje.origen_inicial.direccion,
          hora: null,
        }
      : null;

  const recorridoReal = [
    ...(origenValido ? [origenValido] : []),
    ...destinosEntregadosConCoords,
  ];

  /* const entregas = {};
  if (viaje.destinos && Array.isArray(viaje.destinos)) {
    viaje.destinos.forEach((e) => {
      const idPedido = e.pedido?.id_pedido;
      if (idPedido)
        entregas[idPedido] = {
          entregado: true,
          entrega: e,
          hora: e.fecha_hora,
        };
    });
  }
  const destinosEntregadosConCoords = viaje.destinos
    .filter(
      (d) =>
        entregas[d.id_pedido]?.entregado &&
        typeof d.lat === "number" &&
        typeof d.lng === "number"
    )
    .map((d) => ({
      lat: d.lat,
      lng: d.lng,
      nombre_cliente: d.nombre_cliente,
      direccion: d.direccion,
      hora: entregas[d.id_pedido]?.entrega?.fecha_hora || null,
    }));

  const origenValido =
    viaje.origen_inicial &&
    typeof viaje.origen_inicial.lat === "number" &&
    typeof viaje.origen_inicial.lng === "number"
      ? {
          lat: viaje.origen_inicial.lat,
          lng: viaje.origen_inicial.lng,
          nombre_cliente: "Origen",
          direccion: viaje.origen_inicial.direccion,
          hora: null,
        }
      : null;

  const recorridoReal = [
    ...(origenValido ? [origenValido] : []),
    ...destinosEntregadosConCoords,
  ]; */

  console.log(destinosEntregadosConCoords);

  return (
    <Box maxWidth="lg" mx="auto" px={{ xs: 1, md: 3 }} py={3}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Recorrido del Viaje #{viaje.id_agenda_viaje}
      </Typography>
      <InfoGeneral viaje={viaje} />

      <Paper
        elevation={4}
        sx={{
          p: 2,
          my: 3,
          borderRadius: 4,
          boxShadow: "0 6px 32px 0 #1a237e22",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Recorrido realizado
        </Typography>
        {recorridoReal.length > 1 ? (
          <DestinosMap ruta={recorridoReal} recorridoReal={recorridoReal} />
        ) : (
          <Typography color="text.secondary" sx={{ my: 2 }}>
            No hay datos de ubicación para este viaje.
          </Typography>
        )}
      </Paper>

      {/* Lista de destinos y su estado */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Paradas y entregas del viaje
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {viaje.destinos.length === 0 ? (
            <Typography color="text.secondary">
              No hay destinos registrados para este viaje.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {viaje.destinos.map((destino, idx) => {
                const entrega = entregasPorPedido[destino.id_pedido];
                const entregado = Boolean(entrega);
                const horaEntrega = entrega?.fecha_hora;
                return (
                  <Paper
                    key={destino.id_pedido}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: entregado
                        ? "linear-gradient(90deg,#e8f6ef 0%,#f7fff7 100%)"
                        : "#fff",
                      border: entregado
                        ? "1.5px solid #b9fbc0"
                        : "1.5px solid #e0e0e0",
                      boxShadow: entregado
                        ? "0 2px 16px 0 #81c78444"
                        : "0 1px 6px 0 #b0b0b022",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Box>
                        <Typography fontWeight={600}>
                          {destino.nombre_cliente}
                        </Typography>
                        <Typography variant="body2" mb={0.5}>
                          <b>Dirección:</b> {destino.direccion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pedido: #{destino.id_pedido}
                        </Typography>
                        {destino.notas && (
                          <Typography variant="body2" color="info.main">
                            {destino.notas}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          label={entregado ? "Entregado" : "Pendiente"}
                          color={entregado ? "success" : "warning"}
                        />
                        {entregado && (
                          <Typography
                            fontSize={13}
                            color="success.main"
                            fontWeight={600}
                          >
                            {horaEntrega
                              ? convertirFechaLocal(
                                  horaEntrega,
                                  "DD-MM-YYYY HH:mm"
                                )
                              : ""}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerViaje;
