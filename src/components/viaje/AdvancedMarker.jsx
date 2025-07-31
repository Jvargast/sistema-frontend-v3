import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function AdvancedMarker({ map, position, content, onClick }) {
  const markerRef = useRef();

  useEffect(() => {
    if (!map || !window.google?.maps?.marker?.AdvancedMarkerElement) return;

    if (markerRef.current) {
      markerRef.current.map = null;
    }

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content,
    });

    if (onClick) {
      marker.addListener("click", onClick);
    }

    markerRef.current = marker;

    return () => {
      marker.map = null;
    };
  }, [map, position, content, onClick]);
  return null;
}

AdvancedMarker.propTypes = {
  map: PropTypes.object,
  position: PropTypes.object,
  content: PropTypes.object,
  onClick: PropTypes.func,
};
