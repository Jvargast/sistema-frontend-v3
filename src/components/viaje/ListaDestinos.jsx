import { Card, CardContent, List, ListItem, Divider, Button, Paper, Chip } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { ordenarDestinosConGoogle } from "../../utils/ordenRutas";
import {
  buildFallbackRoutePath,
  isValidRoutePoint,
} from "../../utils/googleRoutesApi";
import {
  canUseGeolocation,
  getGeolocationBlockedMessage,
} from "../../utils/geolocation";
import DestinosMapGoogle from "./DestinosMapGoogle";
import Box from "../common/CompatBox";
import Stack from "../common/CompatStack";
import Typography from "../common/CompatTypography";

const PENDING_MARKER_COLOR = "#4361ee";
const DELIVERED_MARKER_COLOR = "#4caf50";

function getDestinoKey(destino) {
  if (destino?.id_pedido != null) return `pedido-${destino.id_pedido}`;
  return `coords-${destino?.lat}-${destino?.lng}-${destino?.direccion || ""}`;
}

function buildMarkerIndexByPedido(primary = [], fallback = []) {
  const ordered = [];
  const seen = new Set();

  [...primary, ...fallback].filter(isValidRoutePoint).forEach((destino) => {
    const key = getDestinoKey(destino);
    if (seen.has(key)) return;
    seen.add(key);
    ordered.push(destino);
  });

  return ordered.reduce((acc, destino, index) => {
    if (destino?.id_pedido != null) {
      acc.set(destino.id_pedido, index + 1);
    }
    return acc;
  }, new Map());
}

function PedidoMarkerBadge({ number, color, label }) {
  const hasNumber = Number.isFinite(Number(number));

  return (
    <Box
      aria-label={label}
      title={label}
      sx={{
        flex: "0 0 auto",
        width: 36,
        height: 36,
        borderRadius: "50%",
        bgcolor: hasNumber ? color : "#eef2f7",
        color: hasNumber ? "#fff" : "#6b7280",
        border: "3px solid #fff",
        boxShadow: "0 2px 8px 0 #22223b33",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 800,
        lineHeight: 1,
        mt: 0.25,
      }}
    >
      {hasNumber ? number : "-"}
    </Box>
  );
}

PedidoMarkerBadge.propTypes = {
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const ListaDestinos = ({
  destinos = [],
  entregas = {},
  origen,
  origenInicial,
  onOpenEntrega,
  onVerDetallePedido,
}) => {
  const prioridadRank = {
    urgente: 1,
    alta: 1,
    normal: 2,
    media: 2,
    baja: 3,
  };
  const getPrioridadRank = (destino) =>
    prioridadRank[String(destino?.prioridad || "").toLowerCase()] || 99;
  const getFechaCreacionTime = (destino) => {
    const time = new Date(destino?.fecha_creacion || 0).getTime();
    return Number.isFinite(time) ? time : 0;
  };

  const destinosEntregados = destinos
    .filter((d) => d && entregas[d.id_pedido]?.entregado)
    .map((d) => ({
      ...d,
      hora: entregas[d.id_pedido]?.entrega?.fecha_hora || null,
    }))
    .sort((a, b) => new Date(a.hora) - new Date(b.hora));

  const destinosPendientes = destinos.filter(
    (d) => d && !entregas[d.id_pedido]?.entregado
  );

  const destinosPendientesOrdenados = destinosPendientes
    .slice()
    .sort(
      (a, b) =>
        getPrioridadRank(a) - getPrioridadRank(b) ||
        getFechaCreacionTime(a) - getFechaCreacionTime(b)
    );

  const destinosPendientesRuteables = destinosPendientesOrdenados.filter(
    isValidRoutePoint
  );

  const recorridoReal = [
    origenInicial,
    ...destinosEntregados
      .filter(isValidRoutePoint)
      .map((d) => ({
        id_pedido: d.id_pedido,
        lat: d.lat,
        lng: d.lng,
        nombre_cliente: d.nombre_cliente,
        direccion: d.direccion,
        hora: d.hora,
      })),
  ].filter(isValidRoutePoint);

  /**
   * Nuevo
   */

  const [usarGeolocalizacion, setUsarGeolocalizacion] = useState(false);
  const [rutaOptimizada, setRutaOptimizada] = useState([]);
  const [routePath, setRoutePath] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const solicitarGeolocalizacion = () => {
    if (!canUseGeolocation()) {
      alert(getGeolocationBlockedMessage());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setUsarGeolocalizacion(true);
      },
      (err) => {
        alert(`No se pudo obtener la ubicación: ${err.message}`);
      }
    );
  };

  const ultimoPuntoRecorrido = recorridoReal[recorridoReal.length - 1];
  const origenPendiente =
    (usarGeolocalizacion && isValidRoutePoint(userLocation) && userLocation) ||
    ultimoPuntoRecorrido ||
    (isValidRoutePoint(origen) ? origen : null);

  const pendientesKey = destinosPendientesRuteables
    .map(
      (d) =>
        `${d.id_pedido}-${d.lat}-${d.lng}-${d.prioridad || ""}-${
          d.fecha_creacion || ""
        }`
    )
    .join("|");
  const lastParamsRef = useRef({ origen: null, pendientesKey: "" });

  useEffect(() => {
    if (!origenPendiente || !destinosPendientesRuteables.length) {
      lastParamsRef.current = { origen: null, pendientesKey: "" };
      if (rutaOptimizada.length > 0) setRutaOptimizada([]);
      if (routePath.length > 0) setRoutePath([]);
      return;
    }
    if (
      lastParamsRef.current.origen &&
      Number(lastParamsRef.current.origen.lat) ===
        Number(origenPendiente.lat) &&
      Number(lastParamsRef.current.origen.lng) ===
        Number(origenPendiente.lng) &&
      lastParamsRef.current.pendientesKey === pendientesKey
    ) {
      return;
    }
    lastParamsRef.current = {
      origen: { ...origenPendiente },
      pendientesKey,
    };

    let cancelado = false;
    const rutaBase = [origenPendiente, ...destinosPendientesRuteables];

    setRutaOptimizada(rutaBase);
    setRoutePath(buildFallbackRoutePath(rutaBase));

    ordenarDestinosConGoogle(destinosPendientesRuteables, origenPendiente)
      .then(({ ordenados, routePath }) => {
        if (cancelado) return;
        setRutaOptimizada([origenPendiente, ...ordenados]);
        setRoutePath(routePath || []);
        // ...el resto igual, si necesitas
      })
      .catch((e) => {
        if (cancelado) return;
        const fallbackRoute = [origenPendiente, ...destinosPendientesRuteables];
        console.warn(
          "Error al calcular ruta optimizada con Google Routes API:",
          e
        );
        setRutaOptimizada(fallbackRoute);
        setRoutePath(buildFallbackRoutePath(fallbackRoute));
      });

    return () => {
      cancelado = true;
    };
    //eslint-disable-next-line
  }, [origenPendiente, pendientesKey]);

  const rutaPendiente = rutaOptimizada
    .slice(1)
    .filter((destino) => destino && !entregas[destino.id_pedido]?.entregado);
  const pendingMarkerIndexByPedido = buildMarkerIndexByPedido(
    rutaPendiente,
    destinosPendientesRuteables
  );
  const deliveredMarkerIndexByPedido = buildMarkerIndexByPedido(
    destinosEntregados,
    []
  );

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
        destinos={destinosPendientesRuteables}
        ruta={rutaOptimizada}
        recorridoReal={recorridoReal}
        origenInicial={origenInicial}
        routePath={routePath}
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
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                            sx={{ minWidth: 0, flex: 1 }}
                          >
                            <PedidoMarkerBadge
                              number={pendingMarkerIndexByPedido.get(
                                destino.id_pedido
                              )}
                              color={PENDING_MARKER_COLOR}
                              label={`Puntero del mapa para pedido ${destino.id_pedido}`}
                            />
                            <Box sx={{ minWidth: 0 }}>
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
                                {new Date(
                                  destino.fecha_creacion
                                ).toLocaleString("es-CL")}
                              </Typography>
                            </Box>
                          </Stack>
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
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                            sx={{ minWidth: 0, flex: 1 }}
                          >
                            <PedidoMarkerBadge
                              number={deliveredMarkerIndexByPedido.get(
                                destino.id_pedido
                              )}
                              color={DELIVERED_MARKER_COLOR}
                              label={`Puntero entregado del mapa para pedido ${destino.id_pedido}`}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Chip
                                icon={<CheckCircleOutlineOutlinedIcon />}
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
                                  ? new Date(destino.hora).toLocaleString(
                                      "es-CL"
                                    )
                                  : "-"}
                              </Typography>
                            </Box>
                          </Stack>
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
