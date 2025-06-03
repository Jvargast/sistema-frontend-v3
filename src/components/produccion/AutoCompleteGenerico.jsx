import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Autocomplete, TextField, Box, CircularProgress } from "@mui/material";

const AutocompleteGenerico = ({
  options = [],
  isLoading = false,
  getLabel,
  onSelect,
  labelInput = "Seleccionar",
  size = "medium",
  defaultValue = null,
  optionRenderer,
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Autocomplete
      options={options}
      loading={isLoading}
      size={size}
      value={value}
      getOptionLabel={(opt) => (opt ? getLabel(opt) : "")}
      isOptionEqualToValue={(opt, val) =>
        (opt.id_formula ?? opt.id_producto ?? opt.id) ===
        (val?.id_formula ?? val?.id_producto ?? val?.id)
      }
      onChange={(_, nuevo) => {
        setValue(nuevo);
        onSelect(nuevo);
        if (!nuevo) onSelect(null);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={labelInput}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && <CircularProgress size={18} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(muiProps, option) => {
        const { key, ...rest } = muiProps;
        return optionRenderer ? (
          optionRenderer(rest, option, key)
        ) : (
          <Box component="li" key={key} {...rest}>
            {getLabel(option)}
          </Box>
        );
      }}
    />
  );
};

AutocompleteGenerico.propTypes = {
  options: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  getLabel: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  labelInput: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium"]),
  defaultValue: PropTypes.object,
  optionRenderer: PropTypes.func,
};

export default AutocompleteGenerico;
