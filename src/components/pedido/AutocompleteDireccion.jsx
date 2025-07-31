import { useRef } from "react";
import { TextField } from "@mui/material";
import { Autocomplete as GoogleAutocomplete } from "@react-google-maps/api";
import PropTypes from "prop-types";

export default function AutocompleteDireccion({
  direccion,
  setDireccion,
  setCoords,
}) {
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (place && place.formatted_address && place.geometry) {
      setDireccion(place.formatted_address);
      setCoords({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  return (
    <GoogleAutocomplete
      onLoad={(ac) => (autocompleteRef.current = ac)}
      onPlaceChanged={handlePlaceChanged}
      fields={["formatted_address", "geometry", "address_components"]}
    >
      <TextField
        fullWidth
        label="Dirección de Entrega"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        variant="outlined"
        sx={{
          mb: 3,
          backgroundColor: (theme) => theme.palette.background.default,
          borderRadius: 1,
        }}
        autoComplete="off"
      />
    </GoogleAutocomplete>
  );
}

AutocompleteDireccion.propTypes = {
  direccion: PropTypes.string.isRequired,
  setDireccion: PropTypes.func.isRequired,
  setCoords: PropTypes.func.isRequired,
};
