import {
  GoogleMap,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import Typography from "../common/CompatTypography";

import { convertirFechaLocal } from "../../utils/fechaUtils";
import Box from "../common/CompatBox";
import AdvancedMarker from "./AdvancedMarker";

const mapContainerStyle = {
  height: "clamp(320px, 52vh, 540px)",
  width: "100%",
  borderRadius: "10px",
  marginBottom: "20px",
};

const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP?.trim();
const CURRENT_ROUTE_COLOR = "#38bdf8";
const FUTURE_ROUTE_COLOR = "#f472b6";
const START_MARKER_COLOR = "#ef476f";
const CURRENT_ORIGIN_COLOR = "#0ea5e9";

function isValidPoint(point) {
  return isValidCoord(point?.lat) && isValidCoord(point?.lng);
}

function getDestinoKey(point) {
  if (point?.id_pedido != null) return `pedido-${point.id_pedido}`;

  const lat = Number(point?.lat);
  const lng = Number(point?.lng);
  const address = point?.direccion || "";
  return `coords-${lat.toFixed(6)}-${lng.toFixed(6)}-${address}`;
}

function isEntregado(d, entregados = []) {
  if (!isValidPoint(d)) return false;
  const destinoKey = getDestinoKey(d);
  return entregados.filter(isValidPoint).some((e) => {
    if (e?.id_pedido != null || d?.id_pedido != null) {
      return getDestinoKey(e) === destinoKey;
    }

    return (
      Number(e.lat) === Number(d.lat) &&
      Number(e.lng) === Number(d.lng) &&
      (e.direccion || "") === (d.direccion || "")
    );
  });
}

const infoWindowStyle = {
  maxWidth: "250px",
  minWidth: "200px",
  fontFamily: "Roboto, sans-serif",
  fontSize: "13.3px",
  background: "#fff",
  borderRadius: "14px",
  boxShadow: "0 6px 32px rgba(32,40,60,.16)",
  border: "1px solid #104e94",
  padding: "13px 16px 11px 16px",
  color: "#23272f",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const buttonClose = {
  position: "absolute",
  top: "1.3rem",
  right: 10,
  border: "none",
  background: "transparent",
  fontSize: 18,
  fontWeight: "bold",
  color: "#bdbdbd",
  cursor: "pointer",
  zIndex: 10,
  lineHeight: 1,
  transition: "color 0.14s",
};

const badgeStyle = {
  background: "#e3f2fd",
  color: "#1976d2",
  fontWeight: 600,
  fontSize: "12px",
  borderRadius: "9px",
  padding: "2px 8px",
  display: "inline-block",
  marginBottom: "7px",
};

const idStyle = {
  fontSize: "12px",
  color: "#bdbdbd",
  fontWeight: 500,
  marginBottom: "5px",
  letterSpacing: 1,
  fontFamily: "monospace",
};

const nameStyle = {
  fontWeight: 700,
  fontSize: "15px",
  marginBottom: "2px",
  color: "#23272f",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

const addressStyle = {
  fontSize: "13px",
  color: "#50576b",
  marginBottom: "4px",
  whiteSpace: "normal",
  overflowWrap: "break-word",
  maxWidth: "220px",
};

const estadoStyle = {
  marginTop: "7px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const dotStyle = {
  display: "inline-block",
  width: "10px",
  height: "10px",
  borderRadius: "100%",
  background: "#fbc02d",
  marginRight: "3px",
};

const strongStyle = {
  display: "block",
  marginBottom: 4,
  fontWeight: "bold",
};

const entregadoInfoWindowStyle = {
  maxWidth: "260px",
  minWidth: "200px",
  fontFamily: "Roboto, sans-serif",
  fontSize: "13.3px",
  background: "#fff",
  borderRadius: "14px",
  boxShadow: "0 6px 32px rgba(32,40,60,.16)",
  padding: "17px 18px 14px 18px",
  color: "#23272f",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  position: "relative",
};

const badgeEntregadoStyle = {
  background: "#e8f5e9",
  color: "#2e7d32",
  fontWeight: 600,
  fontSize: "12.2px",
  borderRadius: "9px",
  padding: "3px 13px",
  display: "inline-block",
  marginBottom: "10px",
  letterSpacing: 0.5,
};

const strongEntregadoStyle = {
  fontWeight: 700,
  fontSize: "15.5px",
  color: "#23272f",
  marginBottom: 1,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

const addressEntregadoStyle = {
  fontSize: "13.3px",
  color: "#50576b",
  marginBottom: "7px",
  whiteSpace: "normal",
  overflowWrap: "break-word",
};

const horaEntregadoStyle = {
  marginTop: 5,
  fontSize: "12.2px",
  color: "#388e3c",
  display: "flex",
  alignItems: "center",
  gap: 5,
};

const checkDotStyle = {
  display: "inline-block",
  width: "11px",
  height: "11px",
  borderRadius: "50%",
  background: "#4caf50",
  marginRight: "7px",
  boxShadow: "0 0 3px #a5d6a7",
};

function isValidCoord(val) {
  if (val === null || val === undefined) return false;
  if (typeof val === "boolean") return false;
  if (typeof val === "string" && val.trim() === "") return false;
  return Number.isFinite(Number(val));
}

function isSamePosition(a, b) {
  return (
    isValidPoint(a) &&
    isValidPoint(b) &&
    Number(a.lat) === Number(b.lat) &&
    Number(a.lng) === Number(b.lng)
  );
}

function toLatLng(point) {
  return {
    lat: Number(point.lat),
    lng: Number(point.lng),
  };
}

function getSquaredDistance(a, b) {
  const latDiff = Number(a.lat) - Number(b.lat);
  const lngDiff = Number(a.lng) - Number(b.lng);
  return latDiff * latDiff + lngDiff * lngDiff;
}

function appendUniquePoint(path, point) {
  const normalizedPoint = toLatLng(point);
  const lastPoint = path[path.length - 1];

  if (!lastPoint || getSquaredDistance(lastPoint, normalizedPoint) > 0) {
    path.push(normalizedPoint);
  }

  return path;
}

function splitRoutePathByFirstDestination(path = [], firstDestination) {
  const normalizedPath = path.filter(isValidPoint).map(toLatLng);

  if (normalizedPath.length < 2 || !isValidPoint(firstDestination)) {
    return {
      currentLegPath: normalizedPath,
      futureLegPath: [],
    };
  }

  const destination = toLatLng(firstDestination);
  let closestIndex = 1;
  let closestDistance = Infinity;

  normalizedPath.forEach((point, index) => {
    if (index === 0) return;
    const distance = getSquaredDistance(point, destination);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  const currentLegPath = normalizedPath.slice(0, closestIndex + 1);
  appendUniquePoint(currentLegPath, destination);

  const futureLegPath = [destination];
  normalizedPath.slice(closestIndex + 1).forEach((point) => {
    appendUniquePoint(futureLegPath, point);
  });

  return {
    currentLegPath,
    futureLegPath: futureLegPath.length > 1 ? futureLegPath : [],
  };
}

function getFutureRouteLineOptions() {
  return {
    strokeColor: FUTURE_ROUTE_COLOR,
    strokeOpacity: 0,
    strokeWeight: 4,
    zIndex: 1,
    icons: [
      {
        icon: {
          path: "M 0,-1 0,1",
          strokeColor: FUTURE_ROUTE_COLOR,
          strokeOpacity: 1,
          scale: 3,
        },
        offset: "0",
        repeat: "18px",
      },
    ],
  };
}

function getCoordKey(point) {
  return `${Number(point.lat).toFixed(6)}:${Number(point.lng).toFixed(6)}`;
}

function getOffsetPosition(point, duplicateIndex, duplicateTotal) {
  if (duplicateTotal <= 1) return toLatLng(point);

  const angle = (Math.PI * 2 * duplicateIndex) / duplicateTotal;
  const radius = 0.000035;
  return {
    lat: Number(point.lat) + Math.sin(angle) * radius,
    lng: Number(point.lng) + Math.cos(angle) * radius,
  };
}

function withMarkerPositions(points = []) {
  const totals = new Map();
  const seen = new Map();

  points.forEach((point) => {
    const key = getCoordKey(point);
    totals.set(key, (totals.get(key) || 0) + 1);
  });

  return points.map((point) => {
    const key = getCoordKey(point);
    const duplicateIndex = seen.get(key) || 0;
    seen.set(key, duplicateIndex + 1);

    return {
      point,
      markerPosition: getOffsetPosition(point, duplicateIndex, totals.get(key)),
    };
  });
}

function createMarkerContent({ text, background, color = "#fff", size = 34 }) {
  const marker = document.createElement("div");
  marker.textContent = text;
  marker.style.width = `${size}px`;
  marker.style.height = `${size}px`;
  marker.style.borderRadius = "50%";
  marker.style.background = background;
  marker.style.color = color;
  marker.style.border = "3px solid #fff";
  marker.style.boxShadow = "0 2px 8px 0 #22223b44";
  marker.style.display = "flex";
  marker.style.alignItems = "center";
  marker.style.justifyContent = "center";
  marker.style.fontSize = ["🏁", "▶"].includes(text) ? "18px" : "16px";
  marker.style.fontWeight = "800";
  marker.style.cursor = "pointer";
  return marker;
}

export default function DestinosMapGoogle({
  destinos = [],
  ruta = [],
  recorridoReal = [],
  origenInicial,
  routePath = [],
  currentLegPath = [],
  futureLegPath = [],
}) {
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    .gm-style .gm-style-iw-tc::after,
    .gm-style-iw-tc::after {
      background: #ce3838 !important;
    }
    .gm-ui-hover-effect {
      display: none !important;
    }
    .gm-style-iw-c,
    .gm-style-iw,
    .gm-style-iw-d {
      border-radius: 14px !important;
      padding: 0 !important;
      box-shadow: none !important;
      background: #fff !important;
    }
  `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const puntosRecorrido = useMemo(
    () =>
      Array.isArray(recorridoReal) ? recorridoReal.filter(isValidPoint) : [],
    [recorridoReal]
  );
  const puntosRuta = useMemo(
    () => (Array.isArray(ruta) ? ruta.filter(isValidPoint) : []),
    [ruta]
  );
  const puntosDestino = useMemo(
    () => (Array.isArray(destinos) ? destinos.filter(isValidPoint) : []),
    [destinos]
  );
  const puntoPartida = useMemo(() => {
    if (isValidPoint(origenInicial)) return origenInicial;
    return puntosRecorrido[0] || null;
  }, [origenInicial, puntosRecorrido]);
  const puntosPendientes = useMemo(() => {
    const ordered = new Map();

    puntosRuta.slice(1).forEach((punto) => {
      ordered.set(getDestinoKey(punto), punto);
    });
    puntosDestino.forEach((punto) => {
      const key = getDestinoKey(punto);
      if (!ordered.has(key)) ordered.set(key, punto);
    });

    return Array.from(ordered.values()).filter(
      (punto) => !isEntregado(punto, puntosRecorrido)
    );
  }, [puntosDestino, puntosRecorrido, puntosRuta]);
  const marcadoresPendientes = useMemo(
    () => withMarkerPositions(puntosPendientes),
    [puntosPendientes]
  );
  const puntosEntregados = useMemo(
    () => puntosRecorrido.slice(1).filter(isValidPoint),
    [puntosRecorrido]
  );
  const marcadoresEntregados = useMemo(
    () => withMarkerPositions(puntosEntregados),
    [puntosEntregados]
  );
  const primerDestinoPendiente = puntosPendientes[0] || null;
  const fallbackRouteSegments = useMemo(
    () => splitRoutePathByFirstDestination(routePath, primerDestinoPendiente),
    [primerDestinoPendiente, routePath]
  );
  const routePathActual = useMemo(
    () =>
      Array.isArray(currentLegPath)
        ? currentLegPath.filter(isValidPoint).map(toLatLng)
        : [],
    [currentLegPath]
  );
  const routePathSiguiente = useMemo(
    () =>
      Array.isArray(futureLegPath)
        ? futureLegPath.filter(isValidPoint).map(toLatLng)
        : [],
    [futureLegPath]
  );
  const tramoActualPath =
    routePathActual.length > 1
      ? routePathActual
      : fallbackRouteSegments.currentLegPath;
  const tramosSiguientesPath =
    routePathSiguiente.length > 1
      ? routePathSiguiente
      : fallbackRouteSegments.futureLegPath;
  const ultimoEntregado =
    puntosRecorrido.length > 1
      ? puntosRecorrido[puntosRecorrido.length - 1]
      : null;
  const origenActualRuta = puntosRuta[0] || null;
  const mostrarPuntoPartida =
    puntoPartida && !isSamePosition(puntoPartida, origenActualRuta);

  const center = useMemo(() => {
    if (puntosRuta.length > 0) {
      return toLatLng(puntosRuta[0]);
    }
    if (puntosDestino.length > 0) {
      return toLatLng(puntosDestino[0]);
    }
    if (
      ultimoEntregado &&
      isValidCoord(ultimoEntregado.lat) &&
      isValidCoord(ultimoEntregado.lng)
    ) {
      return toLatLng(ultimoEntregado);
    }
    return { lat: -27.0676, lng: -70.8172 };
  }, [puntosDestino, puntosRuta, ultimoEntregado]);

  useEffect(() => {
    if (!mapInstance || !window.google?.maps?.LatLngBounds) return;

    const puntosVisibles = [
      ...puntosRuta,
      ...puntosDestino,
      ...puntosRecorrido,
      puntoPartida,
      ...(Array.isArray(routePath) ? routePath : []),
      ...tramoActualPath,
      ...tramosSiguientesPath,
    ].filter(isValidPoint);

    if (!puntosVisibles.length) return;

    if (puntosVisibles.length === 1) {
      mapInstance.setCenter(toLatLng(puntosVisibles[0]));
      mapInstance.setZoom(15);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    puntosVisibles.forEach((punto) => bounds.extend(toLatLng(punto)));

    if (!bounds.isEmpty?.() && typeof mapInstance.fitBounds === "function") {
      mapInstance.fitBounds(bounds, 56);
      window.setTimeout(() => {
        if (typeof mapInstance.getZoom !== "function") return;
        const currentZoom = mapInstance.getZoom();
        if (typeof currentZoom === "number" && currentZoom < 13) {
          mapInstance.setZoom(13);
        }
        if (typeof currentZoom === "number" && currentZoom > 16) {
          mapInstance.setZoom(16);
        }
      }, 0);
    }
  }, [
    mapInstance,
    puntosDestino,
    puntosRecorrido,
    puntosRuta,
    puntoPartida,
    routePath,
    tramoActualPath,
    tramosSiguientesPath,
  ]);

  return (
    <>
      {/* Leyenda */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, sm: 3 },
          p: 1.5,
          px: 2.5,
          mb: 2,
          mt: 0.5,
          borderRadius: 3,
          bgcolor: "#f9fafb",
          boxShadow: "0 2px 10px 0 #00000011",
          width: { xs: "100%", sm: "fit-content" },
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: START_MARKER_COLOR,
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 22,
              fontWeight: 900,
              boxShadow: "0 0 0 3px #fff",
              mr: 0.5,
            }}
          >
            🏁
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#2d3142" }}
          >
            Punto de partida
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: CURRENT_ORIGIN_COLOR,
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 20,
              fontWeight: 900,
              boxShadow: "0 0 0 3px #fff",
              mr: 0.5,
            }}
          >
            ▶
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#2d3142" }}
          >
            Inicio próximo tramo
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "#e8f6ef",
              color: "#00b894",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 22,
              fontWeight: 900,
              border: "2px solid #00b894",
              mr: 0.5,
            }}
          >
            ✓
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#2d3142" }}
          >
            Entregado
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "#4361ee",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 20,
              fontWeight: 900,
              boxShadow: "0 0 0 3px #fff",
              mr: 0.5,
            }}
          >
            #
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#2d3142" }}
          >
            Pendiente
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 34,
              borderTop: `5px solid ${CURRENT_ROUTE_COLOR}`,
              borderRadius: 4,
            }}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#2d3142" }}
          >
            Tramo actual
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 34,
              borderTop: `4px dashed ${FUTURE_ROUTE_COLOR}`,
              borderRadius: 4,
            }}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#2d3142" }}
          >
            Siguientes
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          mb: 3,
        }}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={{
            disableDefaultUI: true,
            mapId: GOOGLE_MAPS_MAP_ID || undefined,
          }}
          onLoad={setMapInstance}
        >
          {puntosPendientes.length === 0 && (
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                background: "#fff9",
                borderRadius: "12px",
                boxShadow: 2,
                p: 3,
              }}
            >
              <Typography color="text.secondary" fontWeight={500}>
                No hay destinos pendientes. Ruta completada. 🎉
              </Typography>
            </Box>
          )}
          {tramosSiguientesPath.length > 1 && (
            <Polyline
              path={tramosSiguientesPath}
              options={getFutureRouteLineOptions()}
            />
          )}
          {tramoActualPath.length > 1 && (
            <Polyline
              path={tramoActualPath}
              options={{
                strokeColor: CURRENT_ROUTE_COLOR,
                strokeOpacity: 0.85,
                strokeWeight: 5,
                zIndex: 2,
              }}
            />
          )}

          {/* Punto de partida fijo */}
          {mapInstance && mostrarPuntoPartida && (
            <div>
              <AdvancedMarker
                map={mapInstance}
                onClick={() => setActiveMarker("punto-partida")}
                position={toLatLng(puntoPartida)}
                content={createMarkerContent({
                  text: "🏁",
                  background: START_MARKER_COLOR,
                })}
                title="Punto de partida"
                zIndex={700}
              />
              {activeMarker === "punto-partida" && (
                <InfoWindow
                  position={toLatLng(puntoPartida)}
                  onCloseClick={() => setActiveMarker(null)}
                  options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                >
                  <div style={infoWindowStyle}>
                    <strong style={strongStyle}>Punto de partida</strong>
                    <div>
                      {puntoPartida.direccion || "Sin dirección registrada"}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </div>
          )}

          {/* Marcador origen */}
          {mapInstance && puntosRuta.length > 0 && (
            <div>
              <AdvancedMarker
                map={mapInstance}
                onClick={() => setActiveMarker("origen")}
                position={toLatLng(puntosRuta[0])}
                content={createMarkerContent({
                  text: mostrarPuntoPartida ? "▶" : "🏁",
                  background: mostrarPuntoPartida
                    ? CURRENT_ORIGIN_COLOR
                    : START_MARKER_COLOR,
                })}
                title={
                  mostrarPuntoPartida
                    ? "Inicio del próximo tramo"
                    : "Punto de partida"
                }
                zIndex={800}
              />
              {activeMarker === "origen" && (
                <InfoWindow
                  position={toLatLng(puntosRuta[0])}
                  onCloseClick={() => setActiveMarker(null)}
                  options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                >
                  <div style={infoWindowStyle}>
                    <strong style={strongStyle}>
                      {mostrarPuntoPartida
                        ? "Inicio del próximo tramo"
                        : "Punto de partida"}
                    </strong>
                    <div>
                      {puntosRuta[0].direccion || "Sin dirección registrada"}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </div>
          )}

          {/* Marcadores pendientes */}
          {mapInstance &&
            marcadoresPendientes.map(({ point: d, markerPosition }, i) => {
              const markerKey = getDestinoKey(d);
              const activeKey = `pendiente-${markerKey}`;

              return (
                <Box key={`pendiente-wrap-${markerKey}`}>
                  <AdvancedMarker
                    key={`pendiente-${markerKey}`}
                    map={mapInstance}
                    position={markerPosition}
                    onClick={() => setActiveMarker(activeKey)}
                    content={createMarkerContent({
                      text: String(i + 1),
                      background: "#4361ee",
                    })}
                    title={`Pedido pendiente #${d.id_pedido || i + 1}`}
                    zIndex={1000 + i}
                  />
                  {activeMarker === activeKey && (
                    <InfoWindow
                      position={markerPosition}
                      onCloseClick={() => setActiveMarker(null)}
                    >
                      <div style={infoWindowStyle}>
                        <button
                          onClick={() => setActiveMarker(null)}
                          style={buttonClose}
                          aria-label="Cerrar"
                          tabIndex={0}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.color = "#e53935")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.color = "#bdbdbd")
                          }
                        >
                          ×
                        </button>
                        <span style={badgeStyle}>Pedido pendiente</span>
                        <span style={idStyle}>#{d.id_pedido}</span>
                        <span style={nameStyle}>{d.nombre_cliente}</span>
                        <span style={addressStyle}>{d.direccion}</span>
                        <div style={estadoStyle}>
                          <span style={dotStyle}></span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#fbc02d",
                              fontWeight: 600,
                            }}
                          >
                            Pendiente
                          </span>{" "}
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Box>
              );
            })}

          {/* Marcadores entregados */}
          {mapInstance &&
            marcadoresEntregados.map(({ point: d, markerPosition }, i) => {
              const markerKey = getDestinoKey(d);
              const activeKey = `entregado-${markerKey}`;

              return (
                <Box key={`entregado-${markerKey}`}>
                  <AdvancedMarker
                    map={mapInstance}
                    onClick={() => setActiveMarker(activeKey)}
                    position={markerPosition}
                    content={createMarkerContent({
                      text: String(i + 1),
                      background: "#4caf50",
                    })}
                    title={`Entrega realizada #${d.id_pedido || i + 1}`}
                    zIndex={500 + i}
                  />
                  {activeMarker === activeKey && (
                    <InfoWindow
                      position={markerPosition}
                      onCloseClick={() => setActiveMarker(null)}
                      options={{
                        pixelOffset: new window.google.maps.Size(0, -30),
                      }}
                    >
                      <div style={entregadoInfoWindowStyle}>
                        <button
                          onClick={() => setActiveMarker(null)}
                          style={buttonClose}
                          aria-label="Cerrar"
                          tabIndex={0}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.color = "#e53935")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.color = "#bdbdbd")
                          }
                        >
                          ×
                        </button>
                        <span style={badgeEntregadoStyle}>Entregado</span>
                        <strong style={strongEntregadoStyle}>
                          {d.nombre_cliente}
                        </strong>
                        <div style={addressEntregadoStyle}>{d.direccion}</div>
                        {d.hora && (
                          <div style={horaEntregadoStyle}>
                            <span style={checkDotStyle}></span>
                            <span>
                              <b>Entregado:</b>{" "}
                              {convertirFechaLocal(d.hora, "DD-MM-YYYY HH:mm")}
                            </span>
                          </div>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </Box>
              );
            })}
        </GoogleMap>
      </Box>
    </>
  );
}

DestinosMapGoogle.propTypes = {
  destinos: PropTypes.array,
  ruta: PropTypes.array,
  recorridoReal: PropTypes.array,
  origenInicial: PropTypes.object,
  routePath: PropTypes.array,
  currentLegPath: PropTypes.array,
  futureLegPath: PropTypes.array,
};
