import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { convertirFechaLocal } from "../../utils/fechaUtils";

const mapContainerStyle = {
  height: "300px",
  width: "100%",
  borderRadius: "12px",
  marginBottom: "24px",
};

function isEntregado(d, entregados) {
  return entregados.some(
    (e) => Number(e.lat) === Number(d.lat) && Number(e.lng) === Number(d.lng)
  );
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
  return typeof val === "number" && isFinite(val);
}

export default function DestinosMapGoogle({ ruta, recorridoReal, directions }) {
  const [activeMarker, setActiveMarker] = useState(null);

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

  const ultimoEntregado =
    recorridoReal?.length > 1 ? recorridoReal[recorridoReal.length - 1] : null;

  const center = useMemo(() => {
    if (
      ruta?.length > 0 &&
      isValidCoord(ruta[0]?.lat) &&
      isValidCoord(ruta[0]?.lng)
    ) {
      return { lat: ruta[0].lat, lng: ruta[0].lng };
    }
    if (
      ultimoEntregado &&
      isValidCoord(ultimoEntregado.lat) &&
      isValidCoord(ultimoEntregado.lng)
    ) {
      return { lat: ultimoEntregado.lat, lng: ultimoEntregado.lng };
    }
    return { lat: -27.0676, lng: -70.8172 };
  }, [ruta, ultimoEntregado]);

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
          width: "fit-content",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "#ef476f",
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
            🏠
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#2d3142" }}
          >
            Origen actual
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
          zoom={13}
          options={{
            disableDefaultUI: true,
          }}
        >
          {ruta.length === 0 && (
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
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{ suppressMarkers: true }}
            />
          )}

          {/* Marcador origen */}
          {ruta?.length > 0 && (
            <div>
              <Marker
                onClick={() => setActiveMarker("origen")}
                position={{ lat: ruta[0].lat, lng: ruta[0].lng }}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#ef476f",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#fff",
                }}
                label={{
                  text: "🏠",
                  color: "#fff",
                  fontSize: "16px",
                }}
              />
              {activeMarker === "origen" && (
                <InfoWindow
                  position={{ lat: ruta[0].lat, lng: ruta[0].lng }}
                  onCloseClick={() => setActiveMarker(null)}
                  options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                >
                  <div style={infoWindowStyle}>
                    <strong style={strongStyle}>Origen actual</strong>
                    <div>{ruta[0].direccion || "Sin dirección registrada"}</div>
                  </div>
                </InfoWindow>
              )}
            </div>
          )}

          {/* Marcadores pendientes */}
          {ruta
            ?.slice(1)
            .filter(
              (d) =>
                !isEntregado(d, recorridoReal) &&
                isValidCoord(d.lat) &&
                isValidCoord(d.lng)
            )
            .map((d, i) => (
              <Box key={`pendiente-wrap-${i}`}>
                <Marker
                  key={`pendiente-${i}`}
                  position={{ lat: d.lat, lng: d.lng }}
                  onClick={() => setActiveMarker(`pendiente-${i}`)}
                  icon={{
                    url: `data:image/svg+xml;utf-8,
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34">
        <circle cx="17" cy="17" r="16" fill="%234361ee" stroke="white" stroke-width="3"/>
        <text x="50%" y="56%" text-anchor="middle" fill="white" font-size="16" font-family="Roboto" font-weight="bold" dy=".3em">${
          i + 1
        }</text>
      </svg>`,
                    scaledSize: new window.google.maps.Size(34, 34),
                    anchor: new window.google.maps.Point(17, 5),
                  }}
                />
                {activeMarker === `pendiente-${i}` && (
                  <InfoWindow
                    position={{ lat: d.lat, lng: d.lng }}
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
            ))}

          {/* Marcadores entregados */}
          {recorridoReal
            ?.slice(1)
            .filter((d) => isValidCoord(d.lat) && isValidCoord(d.lng))
            .map((d, i) => (
              <Box key={`entregado-${i}`}>
                <Marker
                  onClick={() => setActiveMarker(`entregado-${i}`)}
                  position={{ lat: d.lat, lng: d.lng }}
                  icon={{
                    url: `data:image/svg+xml;utf-8,
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34">
        <circle cx="17" cy="17" r="16" fill="%234caf50" stroke="white" stroke-width="3"/>
        <text x="50%" y="56%" text-anchor="middle" fill="white" font-size="16" font-family="Roboto" font-weight="bold" dy=".3em">${
          i + 1
        }</text>
      </svg>`,
                    scaledSize: new window.google.maps.Size(34, 34),
                    anchor: new window.google.maps.Point(17, 5),
                  }}
                />
                {activeMarker === `entregado-${i}` && (
                  <InfoWindow
                    position={{ lat: d.lat, lng: d.lng }}
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
            ))}
        </GoogleMap>
      </Box>
    </>
  );
}

DestinosMapGoogle.propTypes = {
  ruta: PropTypes.array,
  recorridoReal: PropTypes.array,
  directions: PropTypes.object,
};
