import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { useGetAgendaByIdQuery } from "../../store/services/agendaCargaApi";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BackButton from "../../components/common/BackButton";

const estadoColores = {
  pendiente: "warning",
  "en tránsito": "info",
  completado: "success",
  anulado: "error",
};

const VerAgendaCarga = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetAgendaByIdQuery(id);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        No se pudo cargar la información de la agenda.
      </Alert>
    );
  }

  const {
    id_agenda_carga,
    fecha_hora,
    estado,
    prioridad,
    camion,
    chofer,
    notas,
    detalles = [],
  } = data;

  return (
    <Box p={{ xs: 2, md: 4 }}>
      <BackButton to="/agendas" label="Volver" />
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🚛 Agenda de Carga #{id_agenda_carga}
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          mb: 4,
        }}
      >
        <Box display="flex" flexWrap="wrap" columnGap={4} rowGap={3}>
          <Box flex="1 1 250px">
            <Typography variant="overline" color="text.secondary">
              Fecha y Hora
            </Typography>
            <Typography fontWeight={500}>
              {new Date(fecha_hora).toLocaleString("es-CL")}
            </Typography>
          </Box>

          <Box flex="1 1 250px" display="flex" flexDirection="column">
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              Estado
            </Typography>
            <Chip
              label={estado}
              color={estadoColores[estado.toLowerCase()] || "default"}
              sx={{ alignSelf: "flex-start", fontWeight: "bold", px: 1.5 }}
            />
          </Box>

          <Box flex="1 1 250px">
            <Typography variant="overline" color="text.secondary">
              Prioridad
            </Typography>
            <Typography fontWeight={500}>{prioridad}</Typography>
          </Box>

          <Box flex="1 1 220px">
            <Stack direction="row" alignItems="center" spacing={1}>
              <PersonOutlineIcon color="action" />
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Chofer
                </Typography>
                <Typography fontWeight={500}>
                  {chofer?.nombre} ({chofer?.rut})
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box flex="1 1 220px">
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocalShippingOutlinedIcon color="action" />
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Camión
                </Typography>
                <Typography fontWeight={500}>{camion?.placa}</Typography>
              </Box>
            </Stack>
          </Box>

          <Box width="100%">
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1} alignItems="center">
              <DescriptionOutlinedIcon color="disabled" />
              <Typography variant="overline" color="text.secondary">
                Notas
              </Typography>
            </Stack>
            <Typography
              fontWeight="500"
              color={notas ? "text.primary" : "text.disabled"}
              sx={{ mt: 0.5 }}
            >
              {notas || "Sin notas registradas"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Typography
        variant="h5"
        fontWeight="bold"
        mb={2}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Inventory2OutlinedIcon color="primary" />
        Productos Asignados
      </Typography>

      {detalles.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No hay productos asignados a esta agenda.
        </Alert>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {detalles.map((item, idx) => {
            const esDePedido = item.notas?.includes("Pedido ID");
            return (
              <Card
                key={idx}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  flex: "1 1 280px",
                  transition: "0.3s",
                  borderLeft: `6px solid ${esDePedido ? "#1e88e5" : "#8e24aa"}`,
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {item.producto ? (
                          <>
                            🧴 {item.producto.nombre_producto}
                            {item.producto.es_retornable && (
                              <Chip
                                label="Retornable"
                                color="success"
                                size="small"
                                sx={{ ml: 1, fontSize: "0.7rem", height: 22 }}
                              />
                            )}
                          </>
                        ) : item.insumo ? (
                          <>🧰 {item.insumo.nombre_insumo}</>
                        ) : (
                          "Ítem desconocido"
                        )}
                      </Typography>
                      <Chip
                        label={esDePedido ? "Pedido" : "Adicional"}
                        size="small"
                        color={esDePedido ? "info" : "secondary"}
                        sx={{ fontWeight: "bold" }}
                      />
                    </Stack>

                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {item.cantidad} unidades
                    </Typography>

                    {item.producto && (
                      <Stack spacing={0.5}>
                        {item.producto.marca && (
                          <Typography variant="body2" color="text.secondary">
                            Marca: <strong>{item.producto.marca}</strong>
                          </Typography>
                        )}
                        {item.producto.codigo_barra && (
                          <Typography variant="body2" color="text.secondary">
                            Código de barra: {item.producto.codigo_barra}
                          </Typography>
                        )}
                        {item.producto.descripcion && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            {item.producto.descripcion}
                          </Typography>
                        )}
                      </Stack>
                    )}

                    {item.insumo && (
                      <Stack spacing={0.5}>
                        {item.insumo.unidad_de_medida && (
                          <Typography variant="body2" color="text.secondary">
                            Unidad:{" "}
                            <strong>{item.insumo.unidad_de_medida}</strong>
                          </Typography>
                        )}
                        {item.insumo.codigo_barra && (
                          <Typography variant="body2" color="text.secondary">
                            Código de barra: {item.insumo.codigo_barra}
                          </Typography>
                        )}
                        {item.insumo.descripcion && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            {item.insumo.descripcion}
                          </Typography>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default VerAgendaCarga;
