import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Button,
  Paper,
  Chip,
} from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NavigationIcon from "@mui/icons-material/Navigation";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { ordenarDestinosConGoogle } from "../../utils/ordenRutas";
import {
  buildFallbackRouteSegments,
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
const DESTINATION_LIST_MAX_HEIGHT = {
  xs: "34vh",
  sm: 320,
  md: 420,
};

const destinationSectionSx = {
  m: "0 !important",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  boxShadow: "none",
  overflow: "hidden",
  bgcolor: "background.paper",
  "&:before": { display: "none" },
  "&.Mui-expanded": { m: "0 !important" },
};

const destinationSectionsContainerSx = {
  display: "flex",
  flexDirection: "column",
  gap: { xs: 1.75, sm: 2.25 },
};

const destinationSummarySx = {
  minHeight: 52,
  px: { xs: 1.25, sm: 2 },
  bgcolor: "rgba(15, 23, 42, 0.02)",
  "&.Mui-expanded": { minHeight: 52 },
  "& .MuiAccordionSummary-content": {
    my: 1,
    alignItems: "center",
  },
};

const destinationScrollSx = {
  maxHeight: DESTINATION_LIST_MAX_HEIGHT,
  overflowY: "auto",
  pr: { xs: 0.25, sm: 0.75 },
  pb: 0.25,
  overscrollBehavior: "contain",
  WebkitOverflowScrolling: "touch",
};

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

function getGoogleMapsDirectionsUrl(destino) {
  if (!isValidRoutePoint(destino)) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${Number(
    destino.lat
  )},${Number(destino.lng)}&travelmode=driving`;
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

function PedidoTimelineMarker({
  number,
  color,
  label,
  showTopConnector,
  showBottomConnector,
}) {
  const showConnector = showTopConnector || showBottomConnector;

  return (
    <Box
      sx={{
        position: "relative",
        flex: "0 0 36px",
        width: 36,
        minHeight: 64,
        alignSelf: "stretch",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {showConnector && (
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            top: showTopConnector ? 0 : 40,
            bottom: showBottomConnector ? 0 : "calc(100% - 18px)",
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "2px dashed",
            borderColor: "rgba(100, 116, 139, 0.34)",
            pointerEvents: "none",
          }}
        />
      )}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <PedidoMarkerBadge number={number} color={color} label={label} />
      </Box>
    </Box>
  );
}

PedidoTimelineMarker.propTypes = {
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  showTopConnector: PropTypes.bool,
  showBottomConnector: PropTypes.bool,
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
  const [currentLegPath, setCurrentLegPath] = useState([]);
  const [futureLegPath, setFutureLegPath] = useState([]);
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
      if (currentLegPath.length > 0) setCurrentLegPath([]);
      if (futureLegPath.length > 0) setFutureLegPath([]);
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
    const fallbackSegments = buildFallbackRouteSegments(
      origenPendiente,
      destinosPendientesRuteables
    );

    setRutaOptimizada(rutaBase);
    setRoutePath(fallbackSegments.routePath);
    setCurrentLegPath(fallbackSegments.currentLegPath);
    setFutureLegPath(fallbackSegments.futureLegPath);

    ordenarDestinosConGoogle(destinosPendientesRuteables, origenPendiente)
      .then(({ ordenados, routePath, currentLegPath, futureLegPath }) => {
        if (cancelado) return;
        setRutaOptimizada([origenPendiente, ...ordenados]);
        setRoutePath(routePath || []);
        setCurrentLegPath(currentLegPath || []);
        setFutureLegPath(futureLegPath || []);
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
        setRoutePath(fallbackSegments.routePath);
        setCurrentLegPath(fallbackSegments.currentLegPath);
        setFutureLegPath(fallbackSegments.futureLegPath);
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
  const proximoDestino =
    rutaPendiente[0] || destinosPendientesOrdenados[0] || null;
  const proximoDestinoUrl = getGoogleMapsDirectionsUrl(proximoDestino);

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button
          variant={usarGeolocalizacion ? "contained" : "outlined"}
          color="primary"
          sx={{
            width: { xs: "100%", sm: "auto" },
            minHeight: 44,
            textTransform: "none",
            fontWeight: 700,
          }}
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

      {proximoDestino && (
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: 2,
            borderRadius: 1.5,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <PedidoMarkerBadge
                number={pendingMarkerIndexByPedido.get(
                  proximoDestino.id_pedido
                )}
                color={PENDING_MARKER_COLOR}
                label={`Puntero del mapa para pedido ${proximoDestino.id_pedido}`}
              />
              <Box sx={{ minWidth: 0 }}>
                <Chip
                  label="Próxima parada"
                  size="small"
                  sx={{
                    mb: 0.75,
                    fontWeight: 700,
                    bgcolor: "rgba(15, 23, 42, 0.06)",
                    color: "#0F172A",
                  }}
                />
                <Typography variant="subtitle1" fontWeight={700}>
                  {proximoDestino.nombre_cliente}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pedido: {proximoDestino.id_pedido}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {proximoDestino.direccion}
                </Typography>
              </Box>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ minWidth: { md: 390 } }}
            >
              <Button
                variant="contained"
                color="info"
                size="large"
                startIcon={<LocalShippingIcon />}
                onClick={() => onOpenEntrega(proximoDestino)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  minHeight: 46,
                  flex: 1,
                }}
              >
                Entregar
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                startIcon={<ReceiptLongIcon />}
                onClick={() => onVerDetallePedido(proximoDestino)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  minHeight: 46,
                  flex: 1,
                }}
              >
                Detalle
              </Button>
              {proximoDestinoUrl && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<NavigationIcon />}
                  href={proximoDestinoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    minHeight: 46,
                    flex: 1,
                  }}
                >
                  Navegar
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>
      )}

      <DestinosMapGoogle
        destinos={destinosPendientesRuteables}
        ruta={rutaOptimizada}
        recorridoReal={recorridoReal}
        origenInicial={origenInicial}
        routePath={routePath}
        currentLegPath={currentLegPath}
        futureLegPath={futureLegPath}
      />

      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.5,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.07)",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1.5, sm: 2 },
            "&:last-child": { pb: { xs: 1.5, sm: 2 } },
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
            Destinos de Entrega
          </Typography>
          <Box sx={destinationSectionsContainerSx}>
            {destinosPendientesOrdenados.length > 0 && (
              <Accordion
                defaultExpanded
                disableGutters
                elevation={0}
                sx={destinationSectionSx}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={destinationSummarySx}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ width: "100%", minWidth: 0 }}
                  >
                    <Typography fontWeight={800}>Pendientes</Typography>
                    <Chip
                      label={`${destinosPendientesOrdenados.length} destinos`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        borderColor: "divider",
                      }}
                    />
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    p: { xs: 1, sm: 1.25 },
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={destinationScrollSx}>
                    <List disablePadding>
                      {destinosPendientesOrdenados.map((destino, index) => (
                        <Box key={destino.id_pedido}>
                          <ListItem sx={{ px: 0, py: 1.25 }}>
                            <Paper
                              elevation={0}
                              sx={{
                                width: "100%",
                                p: { xs: 1.5, sm: 2 },
                                borderRadius: 1,
                                backgroundColor: "rgba(15, 23, 42, 0.025)",
                                boxShadow: "none",
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
                                  <PedidoTimelineMarker
                                    number={pendingMarkerIndexByPedido.get(
                                      destino.id_pedido
                                    )}
                                    color={PENDING_MARKER_COLOR}
                                    label={`Puntero del mapa para pedido ${destino.id_pedido}`}
                                    showTopConnector={index > 0}
                                    showBottomConnector={
                                      index <
                                      destinosPendientesOrdenados.length - 1
                                    }
                                  />
                                  <Box sx={{ minWidth: 0 }}>
                                    <Chip
                                      label={`Prioridad: ${
                                        destino.prioridad?.toUpperCase() ||
                                        "N/A"
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
                                      <Typography
                                        variant="body2"
                                        sx={{ mt: 0.5 }}
                                      >
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
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: 1,
                                    alignItems: {
                                      xs: "stretch",
                                      sm: "center",
                                    },
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
                                      fontWeight: 700,
                                      minHeight: 44,
                                      width: { xs: "100%", sm: "auto" },
                                    }}
                                  >
                                    Registrar Entrega
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="inherit"
                                    sx={{
                                      textTransform: "none",
                                      fontWeight: 700,
                                      minHeight: 44,
                                      width: { xs: "100%", sm: "auto" },
                                    }}
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
                    </List>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {destinosEntregados.length > 0 && (
              <Accordion
                disableGutters
                elevation={0}
                sx={destinationSectionSx}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={destinationSummarySx}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ width: "100%", minWidth: 0 }}
                  >
                    <Typography fontWeight={800}>Entregados</Typography>
                    <Chip
                      label={`${destinosEntregados.length} entregas`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        borderColor: "divider",
                      }}
                    />
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    p: { xs: 1, sm: 1.25 },
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={destinationScrollSx}>
                    <List disablePadding>
                      {destinosEntregados.map((destino, index) => (
                        <Box key={destino.id_pedido}>
                          <ListItem sx={{ px: 0, py: 1.25 }}>
                            <Paper
                              elevation={0}
                              sx={{
                                width: "100%",
                                p: { xs: 1.5, sm: 2 },
                                borderRadius: 1,
                                backgroundColor: "rgba(15, 23, 42, 0.025)",
                                boxShadow: "none",
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
                                  <PedidoTimelineMarker
                                    number={deliveredMarkerIndexByPedido.get(
                                      destino.id_pedido
                                    )}
                                    color={DELIVERED_MARKER_COLOR}
                                    label={`Puntero entregado del mapa para pedido ${destino.id_pedido}`}
                                    showTopConnector={index > 0}
                                    showBottomConnector={
                                      index < destinosEntregados.length - 1
                                    }
                                  />
                                  <Box sx={{ minWidth: 0 }}>
                                    <Chip
                                      icon={
                                        <CheckCircleOutlineOutlinedIcon />
                                      }
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
                                      <Typography
                                        variant="body2"
                                        sx={{ mt: 0.5 }}
                                      >
                                        Notas: {destino.notas}
                                      </Typography>
                                    )}
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "#777" }}
                                    >
                                      Entregado:{" "}
                                      {destino.hora
                                        ? new Date(
                                            destino.hora
                                          ).toLocaleString("es-CL")
                                        : "-"}
                                    </Typography>
                                  </Box>
                                </Stack>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: 1,
                                    alignItems: {
                                      xs: "stretch",
                                      sm: "center",
                                    },
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
                                      fontWeight: 700,
                                      minHeight: 44,
                                      width: { xs: "100%", sm: "auto" },
                                      color: "inherit",
                                      borderColor: "success.main",
                                      "&:hover": {
                                        borderColor: "success.dark",
                                        backgroundColor:
                                          "rgba(46, 125, 50, 0.08)",
                                      },
                                    }}
                                    onClick={() =>
                                      onVerDetallePedido(destino)
                                    }
                                  >
                                    Ver Detalle
                                  </Button>
                                </Box>
                              </Stack>
                            </Paper>
                          </ListItem>
                          {index < destinosEntregados.length - 1 && (
                            <Divider />
                          )}
                        </Box>
                      ))}
                    </List>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
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
