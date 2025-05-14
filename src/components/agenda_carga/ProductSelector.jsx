import PropTypes from "prop-types";
import {
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductSelectorRow = ({
  index,
  productosDisponibles,
  selectedProduct,
  onChangeProduct,
  onChangeCantidad,
  onChangeNotas,
  onRemoveRow,
}) => {
  return (
    <Grid container spacing={2} alignItems="center">
      {/* Seleccionar producto */}
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth size="small">
          <InputLabel id={`producto-label-${index}`}>Producto</InputLabel>
          <Select
            labelId={`producto-label-${index}`}
            value={selectedProduct?.id_producto || ""}
            label="Producto"
            onChange={(e) => onChangeProduct(index, e.target.value)}
            sx={{
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <MenuItem value="">-- Selecciona producto --</MenuItem>
            {productosDisponibles?.map((prod) => (
              <MenuItem key={prod.id_producto} value={prod.id_producto}>
                {prod.nombre_producto}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Mostrar si el producto es retornable o no */}
      <Grid item xs={12} sm={2}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            textAlign: "center",
            color: selectedProduct?.es_retornable
              ? "success.main"
              : "text.secondary",
          }}
        >
          {selectedProduct?.es_retornable ? "♻️ Retornable" : "No retornable"}
        </Typography>
      </Grid>

      {/* Cantidad */}
      <Grid item xs={12} sm={2}>
        <TextField
          label="Cantidad"
          inputProps={{ min: 0 }}
          type="number"
          value={selectedProduct?.cantidad || ""}
          onChange={(e) => onChangeCantidad(index, e.target.value)}
          size="small"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "white",
            },
          }}
        />
      </Grid>

      {/* Notas */}
      <Grid item xs={12} sm={3}>
        <TextField
          label="Notas"
          value={selectedProduct?.notas || ""}
          onChange={(e) => onChangeNotas(index, e.target.value)}
          size="small"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "white",
            },
          }}
        />
      </Grid>

      {/* Botón Eliminar */}
      <Grid item xs={12} sm={1} textAlign="center">
        <IconButton
          onClick={() => onRemoveRow(index)}
          sx={{
            borderRadius: "50%",
            backgroundColor: "grey.100",
            color: "error.main",
            "&:hover": {
              backgroundColor: "grey.200",
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default ProductSelectorRow;

ProductSelectorRow.propTypes = {
  index: PropTypes.number.isRequired,
  productosDisponibles: PropTypes.arrayOf(
    PropTypes.shape({
      id_producto: PropTypes.number.isRequired,
      nombre_producto: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedProduct: PropTypes.shape({
    id_producto: PropTypes.number,
    cantidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    notas: PropTypes.string,
    es_retornable: PropTypes.bool, // ✅ Agregar validación para retornable
  }),
  onChangeProduct: PropTypes.func.isRequired,
  onChangeCantidad: PropTypes.func.isRequired,
  onChangeNotas: PropTypes.func.isRequired,
  onRemoveRow: PropTypes.func.isRequired,
};
