import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { convertirFechaLocal } from "../../utils/fechaUtils";

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

FitBounds.propTypes = {
  points: PropTypes.array.isRequired,
};

const getNumeroIcon = (numero) =>
  new L.DivIcon({
    html: `<div style="
      background: #fff;
      border: 2.5px solid #4361ee;
      color: #4361ee;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
      box-shadow: 0 2px 8px 0 #22223b33;
    ">${numero}</div>`,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });

const getEntregadoIcon = (nro) =>
  new L.DivIcon({
    html: `<div style="
      background: #e8f6ef;
      border: 2.5px solid #00b894;
      color: #00b894;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
      box-shadow: 0 2px 8px 0 #00b89444;
    ">✓${nro}</div>`,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });

export default function DestinosMap({ ruta, recorridoReal }) {
  const center =
    ruta && ruta.length
      ? { lat: ruta[0].lat, lng: ruta[0].lng }
      : { lat: -33.45, lng: -70.65 };

  return (
    <>
      {" "}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 1,
          alignItems: "center",
          ml: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#ef476f",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 18,
              fontWeight: 900,
              border: "2.5px solid #fff",
            }}
          >
            🏠
          </div>
          <Typography variant="body2">Origen actual</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#e8f6ef",
              color: "#00b894",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 18,
              fontWeight: 900,
              border: "2.5px solid #00b894",
            }}
          >
            E
          </div>
          <Typography variant="body2">Entregado</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#fff",
              color: "#4361ee",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 18,
              fontWeight: 900,
              border: "2.5px solid #4361ee",
            }}
          >
            P
          </div>
          <Typography variant="body2">Pendiente</Typography>
        </Box>
      </Box>
      <MapContainer
        center={center}
        zoom={12}
        style={{
          height: 300,
          width: "100%",
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />

        <FitBounds points={ruta || []} />

        {recorridoReal && recorridoReal.length > 1 && (
          <Polyline
            positions={recorridoReal.map((p) => [p.lat, p.lng])}
            color="#00b894"
            weight={6}
            opacity={0.8}
            dashArray="8 12"
          />
        )}

        {ruta && ruta.length > 1 && (
          <Polyline
            positions={ruta.map((p) => [p.lat, p.lng])}
            color="#ef476f"
            weight={6}
            opacity={0.9}
          />
        )}

        {ruta && ruta.length > 0 && (
          <Marker
            key="origen"
            position={{ lat: ruta[0].lat, lng: ruta[0].lng }}
            icon={
              new L.DivIcon({
                html: `<div style="
            background: #ef476f;
            border: 2.5px solid #fff;
            color: #fff;
            border-radius: 50%;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.1rem;
            box-shadow: 0 2px 8px 0 #22223b33;
          ">🏠</div>`,
                className: "",
                iconSize: [34, 34],
                iconAnchor: [17, 34],
                popupAnchor: [0, -34],
              })
            }
          />
        )}
        {ruta &&
          ruta.slice(1).map((d, i) => {
            if (i === 0) {
              return (
                <Marker
                  key={`origen`}
                  position={{ lat: d.lat, lng: d.lng }}
                  icon={
                    new L.DivIcon({
                      html: `<div style="
                background: #ef476f;
                border: 2.5px solid #fff;
                color: #fff;
                border-radius: 50%;
                width: 34px;
                height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 1.1rem;
                box-shadow: 0 2px 8px 0 #22223b33;
              ">🏠</div>`,
                      className: "",
                      iconSize: [34, 34],
                      iconAnchor: [17, 34],
                      popupAnchor: [0, -34],
                    })
                  }
                />
              );
            }
            return (
              <Marker
                key={d.id_pedido || `${d.lat},${d.lng}`}
                position={{ lat: d.lat, lng: d.lng }}
                icon={getNumeroIcon(i)}
              />
            );
          })}
        {recorridoReal &&
          recorridoReal.slice(1).map((p, i) => (
            <Marker
              key={`entregado-${i}`}
              position={{ lat: p.lat, lng: p.lng }}
              icon={getEntregadoIcon(i + 1)}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                <div style={{ minWidth: 80 }}>
                  {p.hora
                    ? `Entregada: ${convertirFechaLocal(
                        p.hora,
                        "DD-MM-YYYY HH:mm"
                      )}`
                    : "Entregado"}
                </div>
              </Tooltip>
            </Marker>
          ))}
      </MapContainer>
    </>
  );
}

DestinosMap.propTypes = {
  ruta: PropTypes.array,
  recorridoReal: PropTypes.array,
};
