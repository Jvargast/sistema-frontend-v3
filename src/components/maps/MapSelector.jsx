import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const DEFAULT_CENTER = { lat: -27.0676, lng: -70.8172 };
const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP?.trim();

function isValidLatLng(obj) {
  return (
    obj &&
    typeof obj.lat === "number" &&
    typeof obj.lng === "number" &&
    isFinite(obj.lat) &&
    isFinite(obj.lng)
  );
}

function clearMarker(markerRef) {
  if (!markerRef.current) return;
  markerRef.current.map = null;
  markerRef.current = null;
}

export default function MapSelectorGoogle({ coords, setCoords, setDireccion }) {
  const theme = useTheme();
  const mapRef = useRef();
  const mapInstance = useRef();
  const markerInstance = useRef();
  const geocoder = useRef();

  useEffect(() => {
    if (!window.google?.maps || !mapRef.current) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: isValidLatLng(coords) ? coords : DEFAULT_CENTER,
      zoom: isValidLatLng(coords) ? 16 : 13,
      mapId: GOOGLE_MAPS_MAP_ID || undefined,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    });

    geocoder.current = new window.google.maps.Geocoder();

    const listener = mapInstance.current.addListener("click", (e) => {
      const lat =
        typeof e.latLng.lat === "function" ? e.latLng.lat() : e.latLng.lat;
      const lng =
        typeof e.latLng.lng === "function" ? e.latLng.lng() : e.latLng.lng;
      setCoords({ lat, lng });
      if (setDireccion) {
        getAddressFromCoords(lat, lng);
      }
    });

    return () => {
      if (listener) window.google.maps.event.removeListener(listener);
      clearMarker(markerInstance);
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !window.google?.maps) return;

    clearMarker(markerInstance);

    if (isValidLatLng(coords)) {
      markerInstance.current = new window.google.maps.marker.AdvancedMarkerElement({
        position: coords,
        map: mapInstance.current,
        gmpDraggable: true,
        title: "Ubicación seleccionada",
      });

      markerInstance.current.addListener("dragend", () => {
        const pos = markerInstance.current.position;
        const lat = typeof pos.lat === "function" ? pos.lat() : pos.lat;
        const lng = typeof pos.lng === "function" ? pos.lng() : pos.lng;
        setCoords({ lat: Number(lat), lng: Number(lng) });
        if (setDireccion) {
          getAddressFromCoords(lat, lng);
        }
      });

      mapInstance.current.setCenter(coords);
      mapInstance.current.setZoom(16);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, setCoords, setDireccion]);

  function getAddressFromCoords(lat, lng) {
    if (!geocoder.current) return;
    geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setDireccion(results[0].formatted_address);
      }
    });
  }

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box ref={mapRef} sx={{ width: "100%", height: { xs: 260, md: 340 } }} />
      <Box
        sx={{
          px: 1.5,
          py: 1,
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor:
            theme.palette.mode === "light"
              ? alpha(theme.palette.grey[100], 0.65)
              : alpha(theme.palette.common.white, 0.04),
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          Lat: {isValidLatLng(coords) ? coords.lat.toFixed(6) : "--"}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          Lng: {isValidLatLng(coords) ? coords.lng.toFixed(6) : "--"}
        </Typography>
      </Box>
    </Box>
  );
}

MapSelectorGoogle.propTypes = {
  coords: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  setCoords: PropTypes.func.isRequired,
  setDireccion: PropTypes.func,
};
