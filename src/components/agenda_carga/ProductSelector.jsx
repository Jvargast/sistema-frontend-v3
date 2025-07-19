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
  useTheme,
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
  const theme = useTheme();
  const isRetornable = !!selectedProduct?.es_retornable;

  return (
    <Grid container spacing={2} alignItems="center">
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
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#fff",
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: 2,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.background.paper
                      : "#fff",
                },
              },
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

      <Grid item xs={12} sm={2}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            textAlign: "center",
            color: isRetornable ? theme.palette.success.paper
              : theme.palette.background.default,
            bgcolor: isRetornable
              ? theme.palette.success.light
              : theme.palette.background.default,
            px: 1,
            borderRadius: 2,
            transition: "background .3s",
          }}
        >
          {isRetornable ? "♻️ Retornable" : "No retornable"}
        </Typography>
      </Grid>

      <Grid item xs={12} sm={2}>
        <TextField
          label="Cantidad"
          inputProps={{ min: 0, inputMode: "numeric", pattern: "[0-9]*" }}
          type="number"
          value={selectedProduct?.cantidad || ""}
          onChange={(e) => onChangeCantidad(index, e.target.value)}
          size="small"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.default
                  : "#fff",
            },
          }}
        />
      </Grid>

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
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.default
                  : "#fff",
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={1} textAlign="center">
        <IconButton
          onClick={() => onRemoveRow(index)}
          sx={{
            borderRadius: "50%",
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.error.dark
                : "grey.100",
            color:
              theme.palette.mode === "dark"
                ? theme.palette.error.light
                : "error.main",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.error.main
                  : "grey.200",
            },
            transition: "background .2s",
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
    es_retornable: PropTypes.bool,
  }),
  onChangeProduct: PropTypes.func.isRequired,
  onChangeCantidad: PropTypes.func.isRequired,
  onChangeNotas: PropTypes.func.isRequired,
  onRemoveRow: PropTypes.func.isRequired,
};
