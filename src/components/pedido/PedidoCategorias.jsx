import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Grid, Typography } from "@mui/material";
import { useGetAllCategoriasQuery } from "../../store/services/categoriaApi";
import CategoryBlock from "../venta/CategoryBlock";

const PedidoCategorias = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: categorias, isLoading, error } = useGetAllCategoriasQuery();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  if (isLoading) return <Typography>Cargando categorías...</Typography>;
  if (error) return <Typography color="error">Error al cargar categorías</Typography>;

  return (
    <Box mb={3}>
      <Typography variant="h6" mb={2}>
        Selecciona categoría
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <CategoryBlock
            category="Todo"
            isSelected={selectedCategory === "all"}
            onClick={() => handleCategoryClick("all")}
          />
        </Grid>
        {categorias?.map((categoria) => (
          <Grid item key={categoria.id_categoria}>
            <CategoryBlock
              category={categoria.nombre_categoria}
              isSelected={selectedCategory === categoria.nombre_categoria}
              onClick={() => handleCategoryClick(categoria.nombre_categoria)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
PedidoCategorias.propTypes = {
  onSelectCategory: PropTypes.func.isRequired,
};

export default PedidoCategorias;
