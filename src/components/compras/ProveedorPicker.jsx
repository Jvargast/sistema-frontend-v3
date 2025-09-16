import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useLazyGetAllProveedoresQuery } from "../../store/services/proveedorApi";

function useDebounced(v, ms = 350) {
  const [s, setS] = useState(v);
  useEffect(() => {
    const t = setTimeout(() => setS(v), ms);
    return () => clearTimeout(t);
  }, [v, ms]);
  return s;
}

const ProveedorPicker = ({ value, onChange }) => {
  const [input, setInput] = useState("");
  const debounced = useDebounced(input, 300);

  const [trigger, { data, isFetching }] = useLazyGetAllProveedoresQuery();

  useEffect(() => {
    if (debounced.trim().length >= 2) {
      trigger({ search: debounced, limit: 10, page: 1 });
    }
  }, [debounced, trigger]);

  const options = useMemo(() => {
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.proveedores)) return data.proveedores;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  return (
    <Autocomplete
      options={options}
      loading={isFetching}
      filterOptions={(x) => x}
      getOptionLabel={(o) => o?.razon_social || o?.nombre || o?.rut || ""}
      value={value || null}
      onChange={(_, v) => onChange(v || null)}
      inputValue={input}
      onInputChange={(_, v) => setInput(v)}
      isOptionEqualToValue={(a, b) =>
        (a?.id_proveedor ?? a?.id) === (b?.id_proveedor ?? b?.id)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Proveedor"
          placeholder="Buscar por razón social o RUT"
          fullWidth
        />
      )}
      noOptionsText={
        debounced.trim().length < 2
          ? "Escribe al menos 2 caracteres"
          : "Sin resultados"
      }
      loadingText="Buscando…"
    />
  );
};

ProveedorPicker.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default ProveedorPicker;
