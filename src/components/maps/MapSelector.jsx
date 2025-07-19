import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import CenterMapOnMarker from "./CenterMapOnMarker";
import L from "leaflet";
import reverseGeocode from "../../utils/reverseGeocode";

const DEFAULT_POSITION = { lat: -27.0676, lng: -70.8172 };

export default function MapSelector({
  coords,
  setCoords,
  /*   direccion, */
  setDireccion,
}) {
  const [position, setPosition] = useState(
    coords && coords.lat ? coords : DEFAULT_POSITION
  );

  useEffect(() => {
    if ((!coords || !coords.lat) && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          setCoords({ lat: latitude, lng: longitude });
        },
        () => {}
      );
    }
  }, [coords, setCoords]);

  useEffect(() => {
    if (coords?.lat && coords?.lng) {
      setPosition(coords);
    }
  }, [coords]);

  const handleChangePosition = useCallback(
    async ({ lat, lng }) => {
      setPosition({ lat, lng });
      setCoords({ lat, lng });
      const address = await reverseGeocode({ lat, lng });
      setDireccion(address);
    },
    [setCoords, setDireccion]
  );

  function LocationMarker() {
    useMapEvents({
      click: (e) => {
        handleChangePosition(e.latlng);
      },
    });

    const svgString = `
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="15" r="8" fill="#4361ee" stroke="white" stroke-width="4"/>
    <ellipse cx="18" cy="29" rx="6" ry="3" fill="#adb5bd" opacity="0.5"/>
    <path d="M18 4C11.9249 4 7 8.92487 7 15C7 24 18 32 18 32C18 32 29 24 29 15C29 8.92487 24.0751 4 18 4Z" fill="#4361ee" stroke="white" stroke-width="2"/>
    <circle cx="18" cy="15" r="3" fill="white"/>
  </svg>
`;
    const svgUrl = "data:image/svg+xml;utf8," + encodeURIComponent(svgString);

    const customIcon = new L.Icon({
      iconUrl: svgUrl,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
      className: "",
    });

    return (
      <Marker
        position={position}
        icon={customIcon}
        draggable
        eventHandlers={{
          dragend: async (e) => {
            const { lat, lng } = e.target.getLatLng();
            await handleChangePosition({ lat, lng });
          },
        }}
      />
    );
  }

  return (
    <div>
      <MapContainer
        center={position}
        zoom={16}
        style={{
          height: 350,
          width: "100%",
          borderRadius: 16,
          boxShadow: "0 6px 32px 0 rgba(36,54,99,0.16)",
          overflow: "hidden",
          border: "2px solid #22223b",
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        />

        <LocationMarker />
        <CenterMapOnMarker position={position} />
      </MapContainer>
      <div style={{ marginTop: 8, textAlign: "center" }}>
        <strong>Lat:</strong> {position.lat.toFixed(6)} &nbsp;
        <strong>Lng:</strong> {position.lng.toFixed(6)}
      </div>
    </div>
  );
}

MapSelector.propTypes = {
  coords: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  setCoords: PropTypes.func.isRequired,
  direccion: PropTypes.string,
  setDireccion: PropTypes.func.isRequired,
};
