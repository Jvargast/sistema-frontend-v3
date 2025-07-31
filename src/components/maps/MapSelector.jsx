import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

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

export default function MapSelectorGoogle({ coords, setCoords, setDireccion }) {
  const mapRef = useRef();
  const mapInstance = useRef();
  const markerInstance = useRef();
  const geocoder = useRef();

  useEffect(() => {
    if (!window.google?.maps) return;
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: isValidLatLng(coords) ? coords : DEFAULT_CENTER,
      zoom: isValidLatLng(coords) ? 16 : 13,
      mapId: `${import.meta.env.VITE_GOOGLE_MAPS_MAP}`,
    });

    geocoder.current = new window.google.maps.Geocoder();

    // SOLO AQUÍ: Listener para click en el mapa
    mapInstance.current.addListener("click", (e) => {
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
      if (markerInstance.current) {
        markerInstance.current.map = null;
        markerInstance.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    // Limpia marker anterior
    if (markerInstance.current) {
      markerInstance.current.map = null;
      markerInstance.current = null;
    }

    if (isValidLatLng(coords)) {
      window.google.maps
        .importLibrary("marker")
        .then(({ AdvancedMarkerElement }) => {
          markerInstance.current = new AdvancedMarkerElement({
            position: coords,
            map: mapInstance.current,
            draggable: true,
          });

          markerInstance.current.addListener("dragend", () => {
            const pos = markerInstance.current.position;
            let lat = typeof pos.lat === "function" ? pos.lat() : pos.lat;
            let lng = typeof pos.lng === "function" ? pos.lng() : pos.lng;
            setCoords({ lat, lng });
            if (setDireccion) {
              getAddressFromCoords(lat, lng);
            }
          });
        });

      mapInstance.current.setCenter(coords);
      mapInstance.current.setZoom(16);
    }
    // eslint-disable-next-line
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
    <>
      <div
        ref={mapRef}
        style={{ width: "100%", height: 350, marginBottom: 16 }}
      />
      <div style={{ marginBottom: 24, textAlign: "center", fontSize: 15 }}>
        <strong>Lat:</strong>{" "}
        {isValidLatLng(coords) ? coords.lat.toFixed(6) : "--"} &nbsp;
        <strong>Lng:</strong>{" "}
        {isValidLatLng(coords) ? coords.lng.toFixed(6) : "--"}
      </div>
    </>
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
