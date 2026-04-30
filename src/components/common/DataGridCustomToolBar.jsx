import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import FlexBetween from "../layout/FlexBetween";
import SearchBar from "./SearchBar";

const DataGridCustomToolbar = ({
  searchInput,
  setSearchInput,
  setSearch,
  placeholder = "Buscar por nombre, código o descripción...",
  showSearch = true,
}) => {
  const handleSearch = (value = searchInput) => {
    setSearch(String(value || "").trim());
  };

  return (
    <GridToolbarContainer>
      <FlexBetween sx={{ width: "100%", justifyContent: "space-between" }}>
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
        </FlexBetween>

        {showSearch && (
          <SearchBar
            placeholder={placeholder}
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            width={{ xs: "13rem", sm: 360 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                minHeight: 36,
              },
            }}
          />
        )}
      </FlexBetween>
    </GridToolbarContainer>
  );
};

DataGridCustomToolbar.propTypes = {
  searchInput: PropTypes.string.isRequired,
  setSearchInput: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  showSearch: PropTypes.bool,
};

export default DataGridCustomToolbar;
