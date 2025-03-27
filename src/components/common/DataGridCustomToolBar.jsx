import { Search } from "@mui/icons-material";
import { IconButton, TextField, InputAdornment } from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import FlexBetween from "../layout/FlexBetween";

const DataGridCustomToolbar = ({ searchInput, setSearchInput, setSearch }) => {
  // Función para ejecutar la búsqueda
  const handleSearch = () => {
    setSearch(searchInput);
    setSearchInput(""); // Limpia el campo después de buscar
  };
  return (
    <GridToolbarContainer>
      <FlexBetween sx={{ width: "100%", justifyContent: "space-between" }}>
        {/* Opciones de columnas y densidad */}
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
        </FlexBetween>

        {/* Barra de búsqueda */}
        <TextField
          placeholder="Buscar..."
          InputLabelProps={{
            style: { color: "rgba(28, 26, 26, 0.7)" }, // Texto del label en blanco tenue
          }}
          sx={{
            mb: "0.5rem",
            width: "15rem",
            borderRadius: "20px", // Borde más redondeado
            "& .MuiInputBase-root": {
              paddingLeft: "12px", // Espaciado interno más cómodo
              fontSize: "0.9rem", // Fuente más pequeña para un diseño minimalista
              color: "#0d0c0c", // Texto blanco
              backgroundColor: "transparent", // Fondo transparente
              border: "1px solid rgba(0, 0, 0, 0.433)", // Borde blanco tenue
              borderRadius: "20px", // Redondeado completo
            },
            "& .MuiOutlinedInput-root": {
              "&:hover": {
                borderColor: "#3498db", // Borde azul al hover
              },
            },
          }}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          variant="outlined"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(); // Ejecuta la búsqueda al presionar Enter
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearch(searchInput);
                    setSearchInput("");
                  }}
                  sx={{
                    color: "#ffffff", // Color del icono blanco
                    "&:hover": {
                      color: "#3498db", // Icono azul al hover
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
