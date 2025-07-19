import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";

export default function AutocompleteDireccion({
  direccion,
  setDireccion,
  setCoords,
}) {
  const [input, setInput] = useState(direccion || "");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useMemo(
    () =>
      debounce(async (value) => {
        if (value.length < 4) {
          setOptions([]);
          setLoading(false);
          return;
        }

        setLoading(true);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              value
            )}&countrycodes=cl&limit=5`
          );
          const data = await res.json();

          const resultados = (data || [])
            .filter((f) => f.display_name && f.display_name.includes("Chile"))
            .map((f, i) => ({
              label: f.display_name,
              lat: parseFloat(f.lat),
              lng: parseFloat(f.lon),
              full: f.display_name,
              id: `${f.place_id}-${i}`,
            }));

          setOptions(resultados);
        } catch (error) {
          console.error("Error fetching autocomplete results", error);
        } finally {
          setLoading(false);
        }
      }, 500),
    []
  );

  useEffect(() => {
    fetchResults(input);
    return () => fetchResults.cancel();
  }, [input, fetchResults]);

  useEffect(() => {
    if (direccion !== input) {
      setInput(direccion);
    }
  }, [direccion]);

  return (
    <Autocomplete
      options={options}
      inputValue={input}
      onInputChange={(event, newInput, reason) => {
        if (reason === "input") {
          setInput(newInput);
        }
      }}
      onChange={(event, selected) => {
        if (selected) {
          setDireccion(selected.full);
          setCoords({ lat: selected.lat, lng: selected.lng });
          setInput(selected.full);
          console.log("Dirección seleccionada:", selected.full);
          console.log("Coordenadas:", { lat: selected.lat, lng: selected.lng });
        } else {
          setDireccion("");
          setCoords({ lat: null, lng: null });
        }
      }}
      loading={loading}
      getOptionLabel={(option) => option.label || ""}
      filterOptions={(x) => x} // Previene filtrado doble
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Dirección de Entrega"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{
        marginBottom: 3,
        backgroundColor: (theme) => theme.palette.background.default,
        borderRadius: 1,
      }}
    />
  );
}

AutocompleteDireccion.propTypes = {
  direccion: PropTypes.string.isRequired,
  setDireccion: PropTypes.func.isRequired,
  setCoords: PropTypes.func.isRequired,
};
