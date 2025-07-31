import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const DEFAULT_CENTER = { lat: -27.0676, lng: -70.8172 };

function isValidLatLng(obj) {
  return (
    obj &&
    typeof obj.lat === "number" &&
    typeof obj.lng === "number" &&
    isFinite(obj.lat) &&
    isFinite(obj.lng)
  );
}

export default function GoogleOrigenSelector({ origen, setOrigen }) {
  const mapRef = useRef();
  const mapInstance = useRef();
  const markerInstance = useRef();
  const [locating, setLocating] = useState(false);

  const handleMyLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setOrigen(coords);
        if (mapInstance.current) {
          mapInstance.current.setCenter(coords);
          mapInstance.current.setZoom(16);
        }
      },
      (err) => {
        console.log(err)
        setLocating(false);
        alert("No se pudo obtener tu ubicación.");
      }
    );
  };

  useEffect(() => {
    if (!window.google?.maps) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: isValidLatLng(origen) ? origen : DEFAULT_CENTER,
      zoom: isValidLatLng(origen) ? 16 : 13,
      mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP || undefined,
      disableDefaultUI: true,
      zoomControl: true,
    });

    mapInstance.current.addListener("click", (e) => {
      const lat =
        typeof e.latLng.lat === "function" ? e.latLng.lat() : e.latLng.lat;
      const lng =
        typeof e.latLng.lng === "function" ? e.latLng.lng() : e.latLng.lng;
      setOrigen({ lat, lng });
    });

    return () => {
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
        markerInstance.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!window.google?.maps || !mapInstance.current) return;

    if (markerInstance.current) {
      markerInstance.current.setMap(null);
      markerInstance.current = null;
    }

    if (isValidLatLng(origen)) {
      markerInstance.current = new window.google.maps.Marker({
        position: origen,
        map: mapInstance.current,
        draggable: true,
      });

      markerInstance.current.addListener("dragend", (e) => {
        setOrigen({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      });

      mapInstance.current.setCenter(origen);
      mapInstance.current.setZoom(16);
    }
    // eslint-disable-next-line
  }, [origen]);

  return (
    <>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: 350,
          borderRadius: 12,
          marginBottom: 16,
        }}
      />
      <Tooltip title="Usar mi ubicación">
        <IconButton
          onClick={handleMyLocation}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            bgcolor: "#fff",
            boxShadow: 3,
            "&:hover": { bgcolor: "#e3f2fd" },
            zIndex: 100,
          }}
        >
          {locating ? (
            <CircularProgress size={24} />
          ) : (
            <MyLocationIcon color="primary" />
          )}
        </IconButton>
      </Tooltip>
      <div style={{ marginBottom: 24, textAlign: "center", fontSize: 15 }}>
        <strong>Lat:</strong>{" "}
        {isValidLatLng(origen) ? origen.lat.toFixed(6) : "--"} &nbsp;
        <strong>Lng:</strong>{" "}
        {isValidLatLng(origen) ? origen.lng.toFixed(6) : "--"}
      </div>
    </>
  );
}

GoogleOrigenSelector.propTypes = {
  origen: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  setOrigen: PropTypes.func.isRequired,
};
