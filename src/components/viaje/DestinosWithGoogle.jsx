import {
  GoogleMap,
  Polyline,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState, useMemo } from "react";
/* import { convertirFechaLocal } from "../../utils/fechaUtils"; */
import { useDirections } from "../../hooks/useDirections";
import AdvancedMarker from "./AdvancedMarker";

function isEntregado(destino, entregados) {
  if (!destino?.id_pedido) return false;
  return entregados.some((d) => d.id_pedido === destino.id_pedido);
}
function getMapCenter(points) {
  if (!points?.length) return { lat: -33.45, lng: -70.65 };
  const lat = points.reduce((s, p) => s + Number(p.lat), 0) / points.length;
  const lng = points.reduce((s, p) => s + Number(p.lng), 0) / points.length;
  return { lat, lng };
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
  origen: { ...markerBaseStyle, background: "#ef476f", fontSize: 22 },
  entregado: { ...markerBaseStyle, background: "#4caf50" },
  pendiente: { ...markerBaseStyle, background: "#4361ee" },
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
  const [infoIdx, setInfoIdx] = useState(null);
  const directions = useDirections(ruta);
  const center = useMemo(() => {
    if (ruta?.length) return getMapCenter(ruta);
    if (recorridoReal?.length) return getMapCenter(recorridoReal);
    return { lat: -33.45, lng: -70.65 };
  }, [ruta, recorridoReal]);

  return (
    <>
      {/* Leyenda */}
      <Box sx={{ display: "flex", gap: 2, mb: 1, alignItems: "center", ml: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div style={styles.origen}>🏠</div>
          <Typography variant="body2">Origen actual</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div style={styles.entregado}>✓</div>
          <Typography variant="body2">Entregados</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div style={styles.pendiente}>#</div>
          <Typography variant="body2">Pendiente</Typography>
        </Box>
      </Box>
      <GoogleMap
        mapContainerStyle={{
          height: 320,
          width: "100%",
          borderRadius: 14,
          marginBottom: 24,
        }}
        center={center}
        zoom={13}
        options={{
          disableDefaultUI: true,
          mapId: `${import.meta.env.VITE_GOOGLE_MAPS_MAP}`,
        }}
        onLoad={setMapInstance}
      >
        {/* Polyline de entregados */}
        {recorridoReal?.length > 1 && (
          <Polyline
            path={recorridoReal.map((p) => ({
              lat: Number(p.lat),
              lng: Number(p.lng),
            }))}
            options={{
              strokeColor: "#00b894",
              strokeOpacity: 0.7,
              strokeWeight: 7,
            }}
          />
        )}
        {/* Directions */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: true }}
          />
        )}

        {/* {mapInstance && ruta?.length > 0 && (
          <AdvancedMarker
            map={mapInstance}
            position={{ lat: Number(ruta[0].lat), lng: Number(ruta[0].lng) }}
            content={(() => {
              const div = document.createElement("div");
              div.style =
                "background: #ef476f; color: #fff; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; border: 2.5px solid #fff;";
              div.innerHTML = "🏠";
              return div;
            })()}
            onClick={() => setInfoIdx("origen")}
          />
        )} */}

        {mapInstance &&
          !terminado &&
          ruta
            ?.slice(1)
            .filter((d) => !isEntregado(d, recorridoReal))
            .map((d, i) => (
              <AdvancedMarker
                key={d.id_pedido}
                map={mapInstance}
                position={{ lat: Number(d.lat), lng: Number(d.lng) }}
                content={(() => {
                  const div = document.createElement("div");
                  div.style =
                    "background: #4361ee; color: #fff; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; border: 2.5px solid #fff;";
                  div.innerText = i + 1;
                  return div;
                })()}
                onClick={() => setInfoIdx(`pendiente-${d.id_pedido}`)}
              />
            ))}

        {/* Entregados */}
        {mapInstance &&
          recorridoReal.slice(1).map((d, i) => (
            <AdvancedMarker
              key={d.id_pedido}
              map={mapInstance}
              position={{ lat: Number(d.lat), lng: Number(d.lng) }}
              content={(() => {
                const div = document.createElement("div");
                div.style =
                  "background: #4caf50; color: #fff; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; border: 2.5px solid #fff;";
                div.innerText = i + 1;
                return div;
              })()}
              onClick={() => setInfoIdx(`entregado-${d.id_pedido}`)}
            />
          ))}

        {mapInstance && ubicacionActualChofer && !terminado && (
          <AdvancedMarker
            map={mapInstance}
            position={{
              lat: Number(ubicacionActualChofer.lat),
              lng: Number(ubicacionActualChofer.lng),
            }}
            content={(() => {
              const div = document.createElement("div");
              div.style =
                "background: #fff; color: #009688; border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; border: 3.5px solid #009688; box-shadow: 0 2px 8px 0 #00968844;";
              div.innerHTML = "🚚";
              return div;
            })()}
            onClick={() => setInfoIdx("chofer")}
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
