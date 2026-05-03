import Select from "../common/CompatSelect";
import PropTypes from "prop-types";
import { Chip, IconButton, FormControl, InputLabel, MenuItem, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "../common/CompatTextField";
import Grid from "../common/CompatGrid";
import { getActionIconButtonSx } from "../common/tableStyles";

const ProductSelectorRow = ({
  index,
  productosDisponibles,
  selectedProduct,
  onChangeProduct,
  onChangeCantidad,
  onChangeNotas,
  onRemoveRow,
  maxCantidad
}) => {
  const theme = useTheme();
  const isRetornable = !!selectedProduct?.es_retornable;
  const hasProduct = Boolean(selectedProduct?.id_producto);
  const mostrarLimite = isRetornable && typeof maxCantidad === "number";

  return (
    <Grid container spacing={1.5} alignItems="flex-start">
      <Grid item xs={12} md={5}>
        <FormControl fullWidth size="small">
          <InputLabel id={`producto-label-${index}`}>Producto</InputLabel>
          <Select
            labelId={`producto-label-${index}`}
            value={selectedProduct?.id_producto || ""}
            label="Producto"
            onChange={(e) => onChangeProduct(index, e.target.value)}
            sx={{
              borderRadius: 1.5,
              backgroundColor:
              theme.palette.mode === "dark" ?
              theme.palette.background.paper :
              "#fff"
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: 1.5,
                  backgroundColor:
                  theme.palette.mode === "dark" ?
                  theme.palette.background.paper :
                  "#fff"
                }
              }
            }}>

            <MenuItem value="">-- Selecciona producto --</MenuItem>
            {productosDisponibles?.map((prod) =>
            <MenuItem key={prod.id_producto} value={prod.id_producto}>
                {prod.nombre_producto}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={4} md={2}>
        <Chip
          label={!hasProduct ? "Sin producto" : isRetornable ? "Retornable" : "No retornable"}
          color={isRetornable ? "success" : "default"}
          variant={isRetornable ? "filled" : "outlined"}
          size="small"
          sx={{
            width: "100%",
            height: 38,
            borderRadius: 1.5,
            justifyContent: "center",
            fontWeight: 800
          }} />
      </Grid>

      <Grid item xs={12} sm={4} md={2}>
        <TextField
          label="Cantidad"
          inputProps={{
            min: 0,
            max: mostrarLimite ? maxCantidad : undefined,
            inputMode: "numeric",
            pattern: "[0-9]*"
          }}
          type="number"
          value={selectedProduct?.cantidad ?? ""}
          onChange={(e) => onChangeCantidad(index, e.target.value)}
          size="small"
          fullWidth
          helperText={
          mostrarLimite ? `Máx. por fila: ${maxCantidad}` : " "
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              backgroundColor:
              theme.palette.mode === "dark" ?
              theme.palette.background.default :
              "#fff"
            }
          }} />

      </Grid>

      <Grid item xs={12} sm={4} md={2}>
        <TextField
          label="Notas"
          value={selectedProduct?.notas || ""}
          onChange={(e) => onChangeNotas(index, e.target.value)}
          size="small"
          fullWidth
          helperText=" "
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              backgroundColor:
              theme.palette.mode === "dark" ?
              theme.palette.background.default :
              "#fff"
            }
          }} />

      </Grid>

      <Grid
        item
        xs={12}
        md={1}
        textAlign={{ xs: "right", md: "center" }}
        sx={{ pt: { md: 0.2 } }}>

        <IconButton
          onClick={() => onRemoveRow(index)}
          aria-label="Eliminar producto"
          sx={getActionIconButtonSx(theme, "error")}>

          <DeleteIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>);

};

export default ProductSelectorRow;

ProductSelectorRow.propTypes = {
  index: PropTypes.number.isRequired,
  productosDisponibles: PropTypes.arrayOf(
    PropTypes.shape({
      id_producto: PropTypes.number.isRequired,
      nombre_producto: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedProduct: PropTypes.shape({
    id_producto: PropTypes.number,
    cantidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    notas: PropTypes.string,
    es_retornable: PropTypes.bool
  }),
  maxCantidad: PropTypes.number,
  onChangeProduct: PropTypes.func.isRequired,
  onChangeCantidad: PropTypes.func.isRequired,
  onChangeNotas: PropTypes.func.isRequired,
  onRemoveRow: PropTypes.func.isRequired
};
