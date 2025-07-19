import { TileLayer, Marker, useMapEvents } from "react-leaflet";
import PropTypes from "prop-types";

function OrigenSelectorMap({ origen, setOrigen }) {
  useMapEvents({
    click(e) {
      setOrigen({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  const handleDragEnd = (e) => {
    const marker = e.target;
    const position = marker.getLatLng();
    setOrigen({ lat: position.lat, lng: position.lng });
  };
  return (
    <>
      <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
      <Marker
        position={origen}
        draggable={true}
        eventHandlers={{
          dragend: handleDragEnd,
        }}
      />
    </>
  );
}

export default OrigenSelectorMap;

OrigenSelectorMap.propTypes = {
  origen: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  setOrigen: PropTypes.func.isRequired,
};
