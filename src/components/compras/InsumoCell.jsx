import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useLazyGetAllInsumosQuery } from "../../store/services/insumoApi";

function useDebounced(v, ms = 350) {
  const [s, setS] = useState(v);
  useEffect(() => {
    const t = setTimeout(() => setS(v), ms);
    return () => clearTimeout(t);
  }, [v, ms]);
  return s;
}

const InsumoCell = ({ value, onChange, disabled }) => {
  const [input, setInput] = useState("");
  const debounced = useDebounced(input, 250);
  const [trigger, { data, isFetching, isError }] = useLazyGetAllInsumosQuery();

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened && !input) {
      trigger({ search: "", limit: 10, page: 1 });
    }
  }, [opened, input, trigger]);

  useEffect(() => {
    const q = debounced.trim();
    if (q.length >= 2) {
      trigger({ search: q, limit: 12, page: 1 });
    }
  }, [debounced, trigger]);

  const options = useMemo(
    () =>
      Array.isArray(data?.data?.items) ? data.data.items : Array.isArray(data) ? data : [],
    [data]
  );


  return (
    <Autocomplete
      disabled={disabled}
      options={options}
      loading={isFetching}
      filterOptions={(x) => x} 
      getOptionLabel={(o) =>
        o?.nombre_insumo || o?.nombre || o?.descripcion || ""
      }
      value={value || null}
      onChange={(_, v) => onChange(v || null)}
      inputValue={input}
      onInputChange={(_, v) => setInput(v)}
      onOpen={() => setOpened(true)}
      isOptionEqualToValue={(a, b) =>
        (a?.id_insumo ?? a?.id) === (b?.id_insumo ?? b?.id)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label="Insumo"
          placeholder="Buscar insumo"
          helperText={
            isError
              ? "Error al cargar insumos"
              : debounced.trim().length < 2
              ? "Escribe al menos 2 caracteres"
              : " "
          }
        />
      )}
    />
  );
};

InsumoCell.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default InsumoCell;
