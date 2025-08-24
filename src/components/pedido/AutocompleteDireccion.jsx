import { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";

export default function AutocompleteDireccion({
  direccion,
  setDireccion,
  setCoords,
}) {
  const inputRef = useRef(null);
  const acRef = useRef(null);

  useEffect(() => {
    if (!window.google?.maps?.places || !inputRef.current) return;

    acRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: [
          "formatted_address",
          "geometry",
          "address_components",
          "place_id",
        ],
        componentRestrictions: { country: ["cl"] },
        types: ["geocode"],
      }
    );

    const listener = acRef.current.addListener("place_changed", () => {
      const place = acRef.current.getPlace();
      if (!place) return;

      if (place.formatted_address) setDireccion(place.formatted_address);
      if (place.geometry?.location) {
        setCoords({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });

    return () => {
      if (listener) window.google.maps.event.removeListener(listener);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && window.google?.maps?.Geocoder) {
      e.preventDefault();
      const geocoder = new window.google.maps.Geocoder();
      geocoder
        .geocode({
          address: direccion,
          componentRestrictions: { country: "CL" },
        })
        .then(({ results }) => {
          const r = results?.[0];
          if (r?.geometry?.location) {
            setDireccion(r.formatted_address || direccion);
            setCoords({
              lat: r.geometry.location.lat(),
              lng: r.geometry.location.lng(),
            });
          }
        })
        .catch(() => {});
    }
  };

  return (
    <TextField
      inputRef={inputRef}
      fullWidth
      label="Dirección de Origen"
      value={direccion}
      onChange={(e) => setDireccion(e.target.value)}
      onKeyDown={handleKeyDown}
      variant="outlined"
      sx={{ mb: 3, borderRadius: 1 }}
      autoComplete="off"
    />
  );
}

AutocompleteDireccion.propTypes = {
  direccion: PropTypes.string.isRequired,
  setDireccion: PropTypes.func.isRequired,
  setCoords: PropTypes.func.isRequired,
};
