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
        minWidth: { xs: "100%", md: 560 },
        p: 2,
        borderRadius: 3,
        bgcolor:
          theme.palette.mode === "light"
            ? "#F7F9FC"
            : theme.palette.background.paper,
        border: "1px solid",
        borderColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[300]
            : theme.palette.grey[700],
        boxShadow:
          theme.palette.mode === "light"
            ? "0 2px 6px rgba(15, 23, 42, 0.06)"
            : "0 2px 8px rgba(0,0,0,0.6)",
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
                sx={{
                  minWidth: f.minWidth || 180,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 999,
                    width: "220px",
                  },
                }}
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
                sx={{
                  minWidth: f.minWidth || 180,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 999,
                    width: "220px",
                  },
                }}
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
                sx={{
                  minWidth: f.minWidth || 160,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 999,
                  },
                }}
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
              sx={{
                ...cellSx,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  width: "220px",
                },
              }}
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
            },
            mt: 0.5,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            size="small"
            variant="text"
            onClick={onReset}
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
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
