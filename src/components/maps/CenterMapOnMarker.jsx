import { useMap } from "react-leaflet";
import { useEffect } from "react";
import PropTypes from "prop-types";

function CenterMapOnMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position?.lat && position?.lng) {
      map.setView([position.lat, position.lng], map.getZoom(), {
        animate: true,
      });
    }
  }, [position, map]);
  return null;
}
CenterMapOnMarker.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

export default CenterMapOnMarker;
