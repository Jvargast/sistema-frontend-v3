import { useState, useRef } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce"; // ← 1) instala:  npm i lodash.debounce
import {
  TextField,
  List,
  Paper,
  Popper,
  CircularProgress,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const GooglePlacesInput = ({
  onSelect,
  placeholder = "Ingrese la dirección",
}) => {
  /* -------------------- STATE -------------------- */
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const apiKey = import.meta.env.VITE_API_GOOGLE_MAPS;

  /* -------------------- CONTROL DE PETICIONES -------------------- */
  // guardamos un AbortController para anular la fetch previa
  const controllerRef = useRef(null);

  // función real que consulta la API (NO se usa directamente, sino con debounce)
  const fetchSuggestions = async (value) => {
    // cancela la petición anterior si aún vive
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    try {
      const res = await fetch(
        "https://places.googleapis.com/v1/places:autocomplete",
        {
          method: "POST",
          signal: controllerRef.current.signal,
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
          },
          body: JSON.stringify({
            input: value,
            languageCode: "es",
            regionCode: "CL",
          }),
        }
      );

      const data = await res.json();
      const places =
        data.suggestions
          ?.filter((s) => s.placePrediction)
          .map((s) => s.placePrediction) || [];
      setPredictions(places);
    } catch (err) {
      if (err.name !== "AbortError") console.error("Autocomplete error:", err);
    } finally {
      setLoading(false);
    }
  };

  // versión debounced (300 ms) que sí vamos a llamar desde el input
  const debouncedFetch = useRef(debounce(fetchSuggestions, 300)).current;

  /* -------------------- HANDLER DEL INPUT -------------------- */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setAnchorEl(e.currentTarget);

    if (!value.trim()) {
      setPredictions([]);
      return;
    }
    setLoading(true);
    debouncedFetch(value);
  };

  /* -------------------- DETALLE -------------------- */
  const handleSelect = async (placeId, fallbackText) => {
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: "GET",
          headers: {
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "formattedAddress",
          },
        }
      );
      const data = await res.json();

      const address = data.formattedAddress || fallbackText;
      onSelect(address);
      setQuery(address);
      setPredictions([]);
    } catch (err) {
      console.error("Error place details:", err);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <>
      <TextField
        fullWidth
        label="Dirección*"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        variant="outlined"
        InputProps={{
          endAdornment: loading ? <CircularProgress size={20} /> : null,
        }}
      />

      <Popper
        open={predictions.length > 0}
        anchorEl={anchorEl}
        style={{ zIndex: 1300 }}
      >
        <Paper style={{ width: anchorEl ? anchorEl.clientWidth : undefined }}>
          <List>
            {predictions.map((p) => (
              <ListItemButton
                key={p.placeId}
                onClick={() => handleSelect(p.placeId, p.text.text)}
              >
                <ListItemText primary={p.text.text} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Popper>
    </>
  );
};

GooglePlacesInput.propTypes = {
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default GooglePlacesInput;
