import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function AdvancedMarker({
  map,
  position,
  content,
  onClick,
  title,
  zIndex,
}) {
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
      title,
      zIndex,
      gmpClickable: Boolean(onClick),
    });

    const handleClick = onClick ? (event) => onClick(event) : null;
    if (handleClick) {
      marker.addEventListener("gmp-click", handleClick);
    }

    markerRef.current = marker;

    return () => {
      if (handleClick) {
        marker.removeEventListener("gmp-click", handleClick);
      }
      marker.map = null;
    };
  }, [map, position, content, onClick, title, zIndex]);
  return null;
}

AdvancedMarker.propTypes = {
  map: PropTypes.object,
  position: PropTypes.object,
  content: PropTypes.object,
  onClick: PropTypes.func,
  title: PropTypes.string,
  zIndex: PropTypes.number,
};
