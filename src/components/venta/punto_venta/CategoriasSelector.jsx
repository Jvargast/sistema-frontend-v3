import { Box, Typography, Grid, useTheme, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import CategoryBlock from "../CategoryBlock";


const CategoriasSelector = ({
  categorias,
  categoriaSeleccionada,
  onCategoriaClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box mb={3}>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        mb={2}
        fontWeight={600}
        color={theme.palette.text.primary}
      >
        Selecciona categoría
      </Typography>
      <Grid container spacing={isMobile ? 1 : 2} wrap="nowrap" overflow="auto">
        <Grid item>
          <CategoryBlock
            category="Todo"
            isSelected={categoriaSeleccionada === "all"}
            onClick={() => onCategoriaClick("all")}
          />
        </Grid>
        {categorias?.map((categoria) => (
          <Grid item key={categoria.id_categoria}>
            <CategoryBlock
              category={categoria.nombre_categoria}
              isSelected={categoriaSeleccionada === categoria.nombre_categoria}
              onClick={() => onCategoriaClick(categoria.nombre_categoria)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

CategoriasSelector.propTypes = {
  categorias: PropTypes.array.isRequired,
  categoriaSeleccionada: PropTypes.string.isRequired,
  onCategoriaClick: PropTypes.func.isRequired,
};

export default CategoriasSelector;
