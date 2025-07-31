import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Box,
  Divider,
  Button,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { ordenarDestinosConGoogle } from "../../utils/ordenRutas";
import DestinosMapGoogle from "./DestinosMapGoogle";

const ListaDestinos = ({
  destinos,
  entregas,
  origen,
  origenInicial,
  onOpenEntrega,
  onVerDetallePedido,
}) => {
  const prioridadRank = {
    alta: 1,
    normal: 2,
    baja: 3,
  };

  const destinosEntregados = destinos
    .filter((d) => entregas[d.id_pedido]?.entregado)
    .map((d) => ({
      ...d,
      hora: entregas[d.id_pedido]?.entrega?.fecha_hora || null,
    }))
    .sort((a, b) => new Date(a.hora) - new Date(b.hora));

  const destinosPendientes = destinos.filter(
    (d) => d.lat && d.lng && !entregas[d.id_pedido]?.entregado
  );

  const destinosPendientesOrdenados = destinosPendientes
    .slice()
    .sort(
      (a, b) =>
        (prioridadRank[a.prioridad] || 99) -
          (prioridadRank[b.prioridad] || 99) ||
        new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
    );

  const recorridoReal = [
    origenInicial,
    ...destinosEntregados.map((d) => ({
      lat: d.lat,
      lng: d.lng,
      nombre_cliente: d.nombre_cliente,
      direccion: d.direccion,
      hora: d.hora,
    })),
  ];

  /**
   * Nuevo
   */

  const [usarGeolocalizacion, setUsarGeolocalizacion] = useState(false);
  const [rutaOptimizada, setRutaOptimizada] = useState([]);
  const [directionsResult, setDirectionsResult] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const solicitarGeolocalizacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setUsarGeolocalizacion(true);
        },
        (err) => {
          alert("No se pudo obtener la ubicación: " + err.message);
        }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  };

  const origenPendiente =
    (usarGeolocalizacion && userLocation) ||
    recorridoReal[recorridoReal.length - 1] ||
    origen;

  const pendientesKey = destinosPendientes
    .map((d) => `${d.id_pedido}-${d.lat}-${d.lng}`)
    .join("|");
  const lastParamsRef = useRef({ origen: null, pendientesKey: "" });

  useEffect(() => {
    if (!origenPendiente || !destinosPendientesOrdenados.length) {
      if (rutaOptimizada.length > 0) setRutaOptimizada([]);
      if (directionsResult) setDirectionsResult(null);
      return;
    }
    if (
      lastParamsRef.current.origen &&
      lastParamsRef.current.origen.lat === origenPendiente.lat &&
      lastParamsRef.current.origen.lng === origenPendiente.lng &&
      lastParamsRef.current.pendientesKey === pendientesKey
    ) {
      return;
    }
    lastParamsRef.current = {
      origen: { ...origenPendiente },
      pendientesKey,
    };

    let cancelado = false;

    ordenarDestinosConGoogle(destinosPendientesOrdenados, origenPendiente)
      .then(({ ordenados, directions }) => {
        if (cancelado) return;
        setRutaOptimizada([origenPendiente, ...ordenados]);
        setDirectionsResult(directions || null);
        // ...el resto igual, si necesitas
      })
      .catch(
        (e) =>
          !cancelado &&
          console.warn("Error al calcular ruta optimizada con Google:", e)
      );

    return () => {
      cancelado = true;
    };
    //eslint-disable-next-line
  }, [origenPendiente, pendientesKey]);

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button
          variant={usarGeolocalizacion ? "contained" : "outlined"}
          color="primary"
          onClick={() => {
            if (usarGeolocalizacion) {
              setUsarGeolocalizacion(false);
            } else {
              solicitarGeolocalizacion();
            }
          }}
        >
          {usarGeolocalizacion
            ? "Usar origen de la ruta logística"
            : "Recalcular desde mi ubicación"}
        </Button>
      </Box>

      <DestinosMapGoogle
        destinos={rutaOptimizada.slice(1)}
        ruta={rutaOptimizada}
        recorridoReal={recorridoReal}
        origenInicial={origenInicial}
        directions={directionsResult}
      />

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            📍 Destinos de Entrega
          </Typography>
          <List disablePadding>
            {/* --- PENDIENTES --- */}
            {destinosPendientesOrdenados.length > 0 && (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{ mt: 2, mb: 1, color: "#2d72d9", fontWeight: 700 }}
                >
                  Pendientes ({destinosPendientesOrdenados.length})
                </Typography>
                {destinosPendientesOrdenados.map((destino, index) => (
                  <Box key={destino.id_pedido}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <Paper
                        variant="outlined"
                        sx={{
                          width: "100%",
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "#fffde7",
                          border: "1.5px solid #2d72d911",
                          boxShadow: "0 2px 8px 0 #22223b11",
                        }}
                      >
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          alignItems={{ xs: "stretch", sm: "center" }}
                          spacing={2}
                          sx={{ width: "100%" }}
                        >
                          <Box>
                            {/* Badge de prioridad */}
                            <Chip
                              label={`Prioridad: ${
                                destino.prioridad?.toUpperCase() || "N/A"
                              }`}
                              size="small"
                              color={
                                destino.prioridad === "alta"
                                  ? "error"
                                  : destino.prioridad === "baja"
                                  ? "default"
                                  : "warning"
                              }
                              sx={{
                                fontWeight: 600,
                                mr: 1,
                                mb: 0.5,
                                fontSize: "0.85rem",
                                letterSpacing: 1,
                              }}
                            />
                            <Typography variant="body2">
                              Pedido: {destino.id_pedido}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              gutterBottom
                            >
                              {destino?.nombre_cliente}
                            </Typography>
                            <Typography variant="body2">
                              Dirección: {destino.direccion}
                            </Typography>
                            {destino.notas && (
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                Notas: {destino.notas}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              sx={{ color: "#777" }}
                            >
                              Creado:{" "}
                              {new Date(destino.fecha_creacion).toLocaleString(
                                "es-CL"
                              )}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 2,
                              alignItems: "center",
                              justifyContent: {
                                xs: "flex-start",
                                sm: "flex-end",
                              },
                              mt: { xs: 2, sm: 0 },
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="info"
                              startIcon={<LocalShippingIcon />}
                              onClick={() => onOpenEntrega(destino)}
                              sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                mr: 1,
                              }}
                            >
                              Registrar Entrega
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="inherit"
                              sx={{ textTransform: "none", fontWeight: 500 }}
                              onClick={() => onVerDetallePedido(destino)}
                            >
                              Ver Detalle
                            </Button>
                          </Box>
                        </Stack>
                      </Paper>
                    </ListItem>
                    {index < destinosPendientesOrdenados.length - 1 && (
                      <Divider />
                    )}
                  </Box>
                ))}
              </>
            )}

            {/* --- ENTREGADOS --- */}
            {destinosEntregados.length > 0 && (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{ mt: 3, mb: 1, color: "#3bb273", fontWeight: 700 }}
                >
                  Entregados ({destinosEntregados.length})
                </Typography>
                {destinosEntregados.map((destino, index) => (
                  <Box key={destino.id_pedido}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <Paper
                        variant="outlined"
                        sx={{
                          width: "100%",
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: (theme) =>
                            theme.palette.success.light,
                          color: (theme) =>
                            theme.palette.getContrastText(
                              theme.palette.success.light
                            ),
                          border: (theme) =>
                            `1.5px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          alignItems={{ xs: "stretch", sm: "center" }}
                          spacing={2}
                          sx={{ width: "100%" }}
                        >
                          <Box>
                            <Chip
                              icon={<CheckCircleOutlineIcon />}
                              label="Entregado"
                              color="success"
                              sx={{
                                fontWeight: 500,
                                mr: 1,
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.875rem",
                                height: 32,
                              }}
                            />
                            <Typography variant="body2">
                              Pedido: {destino.id_pedido}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              gutterBottom
                            >
                              {destino?.nombre_cliente}
                            </Typography>
                            <Typography variant="body2">
                              Dirección: {destino.direccion}
                            </Typography>
                            {destino.notas && (
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                Notas: {destino.notas}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              sx={{ color: "#777" }}
                            >
                              Entregado:{" "}
                              {destino.hora
                                ? new Date(destino.hora).toLocaleString("es-CL")
                                : "-"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 2,
                              alignItems: "center",
                              justifyContent: {
                                xs: "flex-start",
                                sm: "flex-end",
                              },
                              mt: { xs: 2, sm: 0 },
                            }}
                          >
                            <Button
                              size="medium"
                              variant="contained"
                              sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                ml: 1,
                                color: "inherit",
                                borderColor: "success.main",
                                "&:hover": {
                                  borderColor: "success.dark",
                                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                                },
                              }}
                              onClick={() => onVerDetallePedido(destino)}
                            >
                              Ver Detalle
                            </Button>
                          </Box>
                        </Stack>
                      </Paper>
                    </ListItem>
                    {index < destinosEntregados.length - 1 && <Divider />}
                  </Box>
                ))}
              </>
            )}
          </List>
        </CardContent>
      </Card>
    </>
  );
};

ListaDestinos.propTypes = {
  destinos: PropTypes.arrayOf(
    PropTypes.shape({
      id_pedido: PropTypes.number.isRequired,
      nombre_cliente: PropTypes.string.isRequired,
      direccion: PropTypes.string.isRequired,
      notas: PropTypes.string,
    })
  ).isRequired,
  entregas: PropTypes.objectOf(
    PropTypes.shape({
      entregado: PropTypes.bool,
      entrega: PropTypes.object,
    })
  ).isRequired,
  origen: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  origenInicial: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  onOpenEntrega: PropTypes.func.isRequired,
  onVerDetallePedido: PropTypes.func.isRequired,
};

export default ListaDestinos;
