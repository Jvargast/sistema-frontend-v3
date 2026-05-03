import {
  GoogleMap,
  Polyline,
} from "@react-google-maps/api";
import Typography from "../common/CompatTypography";

import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";
import Box from "../common/CompatBox";
/* import { convertirFechaLocal } from "../../utils/fechaUtils"; */
import { useDirections } from "../../hooks/useDirections";
import AdvancedMarker from "./AdvancedMarker";
import { isValidRoutePoint } from "../../utils/googleRoutesApi";

const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP?.trim();
const START_MARKER_COLOR = "#ef476f";
const PENDING_MARKER_COLOR = "#4361ee";
const DELIVERED_MARKER_COLOR = "#4caf50";
const DRIVER_MARKER_COLOR = "#009688";

function isEntregado(destino, entregados) {
  if (!destino?.id_pedido) return false;
  return entregados.some((d) => d.id_pedido === destino.id_pedido);
}
function getMapCenter(points) {
  const validPoints = points?.filter(isValidRoutePoint) || [];
  if (!validPoints.length) return { lat: -33.45, lng: -70.65 };
  const lat =
    validPoints.reduce((s, p) => s + Number(p.lat), 0) / validPoints.length;
  const lng =
    validPoints.reduce((s, p) => s + Number(p.lng), 0) / validPoints.length;
  return { lat, lng };
}

function toLatLng(point) {
  return {
    lat: Number(point.lat),
    lng: Number(point.lng),
  };
}

function createMarkerContent({
  text,
  background,
  color = "#fff",
  size = 34,
  borderColor = "#fff",
}) {
  const div = document.createElement("div");
  div.style.background = background;
  div.style.color = color;
  div.style.borderRadius = "50%";
  div.style.width = `${size}px`;
  div.style.height = `${size}px`;
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.fontSize = text === "🚚" ? "28px" : "16px";
  div.style.fontWeight = "bold";
  div.style.border = `${
    text === "🚚" ? "3.5px" : "2.5px"
  } solid ${borderColor}`;
  div.style.boxShadow = "0 2px 8px 0 #22223b44";
  div.innerText = text;
  return div;
}

const markerBaseStyle = {
  position: "relative",
  width: 34,
  height: 34,
  borderRadius: "50%",
  color: "#fff",
  fontWeight: 800,
  boxShadow: "0 2px 8px 0 #22223b44",
  fontSize: 16,
  border: "2.5px solid #fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const styles = {
  origen: { ...markerBaseStyle, background: START_MARKER_COLOR, fontSize: 22 },
  entregado: { ...markerBaseStyle, background: DELIVERED_MARKER_COLOR },
  pendiente: { ...markerBaseStyle, background: PENDING_MARKER_COLOR },
  popup: {
    minWidth: 180,
    background: "#fff",
    color: "#22223b",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 14,
    boxShadow: "0 6px 32px 0 #1a237e22",
    border: "1px solid #e0e0e0",
    position: "absolute",
    left: "50%",
    top: "110%",
    transform: "translateX(-50%)",
    zIndex: 5,
  },
};

export default function DestinosWithGoogle({
  ruta = [],
  recorridoReal = [],
  ubicacionActualChofer,
  terminado,
}) {
  const [mapInstance, setMapInstance] = useState(null);
  const [, setInfoIdx] = useState(null);
  const routePath = useDirections(ruta);
  const puntoPartida = useMemo(
    () => (isValidRoutePoint(ruta?.[0]) ? ruta[0] : null),
    [ruta]
  );
  const center = useMemo(() => {
    if (ruta?.length) return getMapCenter(ruta);
    if (recorridoReal?.length) return getMapCenter(recorridoReal);
    return { lat: -33.45, lng: -70.65 };
  }, [ruta, recorridoReal]);

  const lastEntregaAt = useMemo(() => {
    const t = recorridoReal.slice(1).reduce((max, d) => {
      const ts = new Date(d.hora || 0).getTime();
      return Number.isFinite(ts) ? Math.max(max, ts) : max;
    }, 0);
    return t || 0;
  }, [recorridoReal]);

  useEffect(() => {
    if (!mapInstance || !window.google?.maps?.LatLngBounds) return;
    const bounds = new window.google.maps.LatLngBounds();
    [...ruta, ...recorridoReal, ubicacionActualChofer].forEach((p) => {
      if (isValidRoutePoint(p)) bounds.extend(toLatLng(p));
    });
    if (!bounds.isEmpty?.() && typeof mapInstance.fitBounds === "function") {
      mapInstance.fitBounds(bounds, 48);
      window.setTimeout(() => {
        if (typeof mapInstance.getZoom !== "function") return;
        const currentZoom = mapInstance.getZoom();
        if (typeof currentZoom === "number" && currentZoom < 14) {
          mapInstance.setZoom(14);
        }
      }, 0);
    }
  }, [mapInstance, ruta, recorridoReal, ubicacionActualChofer]);

  return (
    <>
      {/* Leyenda */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 1.5 },
          mb: 1,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div style={styles.origen}>🏁</div>
          <Typography variant="caption">Punto de partida</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div style={styles.entregado}>✓</div>
          <Typography variant="caption">Entregados</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div style={styles.pendiente}>#</div>
          <Typography variant="caption">Pendiente</Typography>
        </Box>
      </Box>
      <GoogleMap
        key={`map-${lastEntregaAt}`}
        mapContainerStyle={{
          height: "clamp(340px, 52vh, 560px)",
          width: "100%",
          borderRadius: 10,
          marginBottom: 0,
        }}
        center={center}
        zoom={15}
        options={{
          disableDefaultUI: true,
          mapId: GOOGLE_MAPS_MAP_ID || undefined,
        }}
        onLoad={setMapInstance}
      >
        {/* Ruta planificada */}
        {routePath?.length > 1 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: "#38bdf8",
              strokeOpacity: 0.82,
              strokeWeight: 5,
            }}
          />
        )}

        {/* Polyline de entregados */}
        {recorridoReal?.length > 1 && (
          <Polyline
            key={`path-${lastEntregaAt}`}
            path={recorridoReal.map((p) => ({
              lat: Number(p.lat),
              lng: Number(p.lng),
            }))}
            options={{
              strokeColor: "#22d3ee",
              strokeOpacity: 0.9,
              strokeWeight: 6,
            }}
          />
        )}

        {mapInstance && puntoPartida && (
          <AdvancedMarker
            map={mapInstance}
            position={toLatLng(puntoPartida)}
            content={createMarkerContent({
              text: "🏁",
              background: START_MARKER_COLOR,
            })}
            title="Punto de partida"
          />
        )}

        {mapInstance &&
          !terminado &&
          ruta
            ?.slice(1)
            .filter((d) => !isEntregado(d, recorridoReal))
            .map((d, i) => (
              <AdvancedMarker
                key={d.id_pedido}
                map={mapInstance}
                position={toLatLng(d)}
                content={createMarkerContent({
                  text: String(i + 1),
                  background: PENDING_MARKER_COLOR,
                })}
                onClick={() => setInfoIdx(`pendiente-${d.id_pedido}`)}
              />
            ))}

        {/* Entregados */}
        {mapInstance &&
          recorridoReal.slice(1).map((d, i) => (
            <AdvancedMarker
              key={d.id_pedido}
              map={mapInstance}
              position={toLatLng(d)}
              content={createMarkerContent({
                text: String(i + 1),
                background: DELIVERED_MARKER_COLOR,
              })}
              onClick={() => setInfoIdx(`entregado-${d.id_pedido}`)}
            />
          ))}

        {mapInstance && ubicacionActualChofer && !terminado && (
          <AdvancedMarker
            map={mapInstance}
            position={toLatLng(ubicacionActualChofer)}
            content={createMarkerContent({
              text: "🚚",
              background: "#fff",
              color: DRIVER_MARKER_COLOR,
              borderColor: DRIVER_MARKER_COLOR,
              size: 42,
            })}
            onClick={() => setInfoIdx("chofer")}
            title="Ubicación actual del chofer"
          />
        )}
      </GoogleMap>
    </>
  );
}

DestinosWithGoogle.propTypes = {
  ruta: PropTypes.array,
  recorridoReal: PropTypes.array,
  ubicacionActualChofer: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  terminado: PropTypes.bool,
};
