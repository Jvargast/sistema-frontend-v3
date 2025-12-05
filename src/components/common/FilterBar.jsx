import PropTypes from "prop-types";
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  useTheme,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeFilter from "./DateRangeFilter";

const FilterBar = ({
  config,
  values,
  onChange,
  size = "small",
  variant = "outlined",
  columns = 3,
  onReset,
}) => {
  const theme = useTheme();

  const handleChange = (id, value) => {
    if (!onChange) return;
    onChange(id, value);
  };

  return (
    <Box
      sx={{
        flex: { xs: "1 1 100%", md: "0 0 auto" },
        minWidth: { xs: "100%", md: 520 },
        p: 1,
        borderRadius: 2,
        bgcolor:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "light"
            ? "0 1px 3px rgba(0,0,0,0.06)"
            : "0 1px 3px rgba(0,0,0,0.4)",

        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: `repeat(${columns}, minmax(0, 1fr))`,
        },
        columnGap: 2,
        rowGap: 1.5,
        alignItems: "center",
      }}
    >
      {config.map((f) => {
        const value = values[f.id] ?? "";

        const cellSx = {
          minWidth: 0,
          ...(f.colSpan && {
            gridColumn: {
              xs: "span 1",
              md: `span ${f.colSpan}`,
            },
          }),
        };

        if (f.type === "text") {
          return (
            <Box key={f.id} sx={cellSx}>
              <TextField
                fullWidth
                size={size}
                variant={variant}
                label={f.label}
                value={value}
                onChange={(e) => handleChange(f.id, e.target.value)}
                sx={{ minWidth: f.minWidth }}
                InputProps={{
                  startAdornment:
                    f.adornment === "search" ? (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ) : undefined,
                }}
              />
            </Box>
          );
        }

        if (f.type === "select") {
          return (
            <Box key={f.id} sx={cellSx}>
              <TextField
                fullWidth
                select
                size={size}
                variant={variant}
                label={f.label}
                value={value}
                onChange={(e) => handleChange(f.id, e.target.value)}
                sx={{ minWidth: f.minWidth }}
              >
                {(f.options || []).map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          );
        }

        if (f.type === "date") {
          return (
            <Box key={f.id} sx={cellSx}>
              <TextField
                fullWidth
                type="date"
                size={size}
                variant={variant}
                label={f.label}
                value={value}
                onChange={(e) => handleChange(f.id, e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: f.minWidth || 130, backgroundColor:"red" }}
              />
            </Box>
          );
        }

        if (f.type === "daterange") {
          return (
            <DateRangeFilter
              key={f.id}
              fromId={f.fromId}
              toId={f.toId}
              labelFrom={f.labelFrom}
              labelTo={f.labelTo}
              values={values}
              onChange={handleChange}
              size={size}
              variant={variant}
              sx={cellSx}
            />
          );
        }

        return null;
      })}
      {onReset && (
        <Box
          sx={{
            gridColumn: {
              xs: "span 1",
              sm: "span 2",
              md: `span ${columns}`, 
            },
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button size="small" variant="text" onClick={onReset}>
            Limpiar filtros
          </Button>
        </Box>
      )}
    </Box>
  );
};

FilterBar.propTypes = {
  config: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.oneOf(["text", "select", "date", "daterange"]).isRequired,
      label: PropTypes.string,
      minWidth: PropTypes.number,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.any,
          label: PropTypes.node,
        })
      ),
      fromId: PropTypes.string,
      toId: PropTypes.string,
      labelFrom: PropTypes.string,
      labelTo: PropTypes.string,
      adornment: PropTypes.oneOf(["search"]),
      colSpan: PropTypes.number,
    })
  ).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["small", "medium"]),
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),
  columns: PropTypes.number,
  onReset: PropTypes.func,
};

export default FilterBar;
