import PropTypes from "prop-types";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import ProductSelectorRow from "./ProductSelector";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const AgendaCargaProductsSection = ({
  productos,
  productosDisponibles,
  handleAddProductRow,
  handleChangeProduct,
  handleChangeCantidad,
  handleChangeNotas,
  handleRemoveRow,
}) => {
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Inventory2OutlinedIcon
          sx={{
            fontSize: 28,
            color: (theme) => theme.palette.primary.main,
            mr: 1,
          }}
        />
        <Typography variant="h6" fontWeight={700}>
          Productos adicionales a cargar
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" flexDirection="column" gap={2}>
        {productos.map((prod, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
            }}
          >
            <ProductSelectorRow
              index={index}
              productosDisponibles={productosDisponibles}
              selectedProduct={{
                ...prod,
                id_producto: Number(prod.id_producto),
                es_retornable: prod.es_retornable ?? false,
              }}
              onChangeProduct={handleChangeProduct}
              onChangeCantidad={handleChangeCantidad}
              onChangeNotas={handleChangeNotas}
              onRemoveRow={handleRemoveRow}
            />
          </Paper>
        ))}
      </Box>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={handleAddProductRow}
          sx={{ textTransform: "none" }}
        >
          + Agregar producto
        </Button>
      </Box>
    </Box>
  );
};

AgendaCargaProductsSection.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id_producto: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      cantidad: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      notas: PropTypes.string,
    })
  ).isRequired,
  productosDisponibles: PropTypes.arrayOf(
    PropTypes.shape({
      id_producto: PropTypes.number,
      nombre_producto: PropTypes.string,
      // ... cualquier otro campo que uses
    })
  ).isRequired,
  handleAddProductRow: PropTypes.func.isRequired,
  handleChangeProduct: PropTypes.func.isRequired,
  handleChangeCantidad: PropTypes.func.isRequired,
  handleChangeNotas: PropTypes.func.isRequired,
  handleRemoveRow: PropTypes.func.isRequired,
};

export default AgendaCargaProductsSection;
