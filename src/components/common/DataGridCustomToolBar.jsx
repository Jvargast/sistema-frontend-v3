import { Search } from "@mui/icons-material";
import { IconButton, TextField, InputAdornment, useTheme } from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import FlexBetween from "../layout/FlexBetween";

const DataGridCustomToolbar = ({ searchInput, setSearchInput, setSearch }) => {
  const theme = useTheme();

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setSearchInput("");
  };

  return (
    <GridToolbarContainer>
      <FlexBetween sx={{ width: "100%", justifyContent: "space-between" }}>
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
        </FlexBetween>

        <TextField
          placeholder="Buscar..."
          size="small"
          sx={{
            width: { xs: "10rem", sm: "12rem" },
            backgroundColor: theme.palette.background.paper,
            borderRadius: "20px",
            "& .MuiInputBase-root": {
              paddingLeft: "10px",
              fontSize: "0.85rem",
              color: theme.palette.text.primary,
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          variant="outlined"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSearch}
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FlexBetween>
    </GridToolbarContainer>
  );
};

DataGridCustomToolbar.propTypes = {
  searchInput: PropTypes.string.isRequired,
  setSearchInput: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
};

export default DataGridCustomToolbar;
