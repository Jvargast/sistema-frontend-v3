import { useRef } from "react";
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🚛 Icono personalizado para los camiones de entrega
const truckIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2942/2942263.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// 📍 Lista de entregas con ubicación y estado
const deliveries = [
  { id: 1, lat: -33.45, lng: -70.65, driver: "Juan Pérez", status: "En camino", carga: "Bidones 20L" },
  { id: 2, lat: -33.47, lng: -70.67, driver: "María Gómez", status: "Entregado", carga: "Hielo 5kg" },
  { id: 3, lat: -33.44, lng: -70.63, driver: "Carlos Ramírez", status: "Retrasado", carga: "Dispensadores" },
];

// 🔄 Componente para mover el mapa hacia una ubicación específica al hacer clic en un camión
const FlyToLocation = ({ lat, lng }) => {
  const map = useMap();
  map.flyTo([lat, lng], 15, { animate: true, duration: 1.5 });
  return null;
};
FlyToLocation.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

const DeliveryMap = () => {
  const mapRef = useRef();

  return (
    <MapContainer center={[-33.45, -70.65]} zoom={12} style={{ height: "400px", width: "100%", borderRadius: "10px" }} whenCreated={mapInstance => (mapRef.current = mapInstance)}>
      {/* 🌍 Mapa con un diseño más profesional */}
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>' />

      {/* 🚛 Marcadores de los camiones */}
      {deliveries.map((delivery) => (
        <Marker key={delivery.id} position={[delivery.lat, delivery.lng]} icon={truckIcon} eventHandlers={{ click: () => mapRef.current.flyTo([delivery.lat, delivery.lng], 14, { animate: true }) }}>
          <Popup>
            <strong>🚚 Conductor:</strong> {delivery.driver} <br />
            <strong>📦 Carga:</strong> {delivery.carga} <br />
            <strong>⏳ Estado:</strong> {delivery.status} <br />
            <FlyToLocation lat={delivery.lat} lng={delivery.lng} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DeliveryMap;
