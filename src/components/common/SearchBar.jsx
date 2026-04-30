import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IconButton, InputAdornment } from "@mui/material";
import { alpha } from "@mui/material/styles";
import TextField from "./CompatTextField";

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "Buscar...",
  width = { xs: "100%", sm: 360 },
  debounceMs = 350,
  autoSearch = true,
  size = "small",
  sx,
}) => {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!autoSearch || !onSearch) return undefined;
    if (!mountedRef.current) {
      mountedRef.current = true;
      return undefined;
    }

    const timeout = setTimeout(() => {
      onSearch(String(value || "").trim());
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [autoSearch, debounceMs, onSearch, value]);

  const handleClear = () => {
    onChange("");
    onSearch?.("");
  };

  const handleSubmit = () => {
    onSearch?.(String(value || "").trim());
  };

  return (
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") handleSubmit();
      }}
      placeholder={placeholder}
      size={size}
      fullWidth
      sx={[
        {
          width,
          maxWidth: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
            bgcolor: "background.paper",
            minHeight: 40,
            pr: 0.5,
            transition:
              "border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease",
            "& fieldset": {
              borderColor: "divider",
            },
            "&:hover fieldset": {
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
            },
            "&.Mui-focused": {
              boxShadow: (theme) =>
                `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
            },
          },
          "& .MuiInputBase-input": {
            fontSize: 14,
            fontWeight: 500,
          },
        },
        sx,
      ]}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {value ? (
              <IconButton
                aria-label="Limpiar búsqueda"
                size="small"
                onClick={handleClear}
                sx={{
                  width: 30,
                  height: 30,
                  color: "text.secondary",
                  "&:hover": {
                    color: "text.primary",
                    bgcolor: (theme) => alpha(theme.palette.text.primary, 0.06),
                  },
                }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            ) : null}
          </InputAdornment>
        ),
      }}
    />
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
  debounceMs: PropTypes.number,
  autoSearch: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium"]),
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};

export default SearchBar;
