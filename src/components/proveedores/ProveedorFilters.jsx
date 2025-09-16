import PropTypes from "prop-types";
import {
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { alpha } from "@mui/material/styles";

const ProveedorFilters = ({ search, setSearch, setPage }) => {
  return (
    <Paper
      component="section"
      elevation={0}
      sx={(theme) => ({
        mt: { xs: 1, sm: 2 },
        mb: 1,
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1, sm: 1.5 },
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        position: "sticky",
        top: { xs: 8, sm: 0 },
        zIndex: theme.zIndex.appBar + 1,
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: "saturate(180%) blur(6px)",
      })}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <TextField
          placeholder="Buscar por nombre, RUT o email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: !!search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  edge="end"
                  aria-label="Limpiar búsqueda"
                  onClick={() => {
                    setSearch("");
                    setPage(0);
                  }}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Paper>
  );
};

ProveedorFilters.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default ProveedorFilters;
