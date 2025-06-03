import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AutocompleteProducto = ({
  productos = [],
  productosQuery, 
  getOptionLabel = (o) => o?.nombre || "",
  selected = null,
  onSelect, 
  showCantidad = true, 
  label = "Buscar...",
}) => {
  const [cantidad, setCantidad] = useState(1);
  const [options, setOptions] = useState(productos);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const queryResult = productosQuery ? productosQuery() : null;
  const remoteData = queryResult?.data;
  const remoteLoading = queryResult?.isLoading;

  useEffect(() => {
    if (remoteData) setOptions(remoteData.items ?? remoteData);
  }, [remoteData]);

  useEffect(() => setLoading(remoteLoading ?? false), [remoteLoading]);

  const handleAdd = () => {
    if (!selected) return;
    onSelect(
      selected,
      showCantidad ? Math.max(1, Number(cantidad)) : undefined
    );
    setCantidad(1);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <Autocomplete
        sx={{ flex: 1, minWidth: 260 }}
        options={options}
        loading={loading}
        value={selected}
        inputValue={inputVal}
        onInputChange={(_, v) => setInputVal(v)}
        onChange={(_, newVal) => onSelect(newVal)}
        isOptionEqualToValue={(o, v) => o?.id === v?.id}
        getOptionLabel={getOptionLabel}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {showCantidad && (
        <TextField
          type="number"
          label="Cant."
          value={cantidad}
          onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
          sx={{ width: 110 }}
          inputProps={{ min: 1 }}
        />
      )}

      {showCantidad && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={!selected}
          sx={{ whiteSpace: "nowrap" }}
        >
          Agregar
        </Button>
      )}
    </Box>
  );
};

AutocompleteProducto.propTypes = {
  productos: PropTypes.array,
  productosQuery: PropTypes.func,
  getOptionLabel: PropTypes.func,
  /* control */
  selected: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  showCantidad: PropTypes.bool,
  /* ui */
  label: PropTypes.string,
};

export default AutocompleteProducto;
