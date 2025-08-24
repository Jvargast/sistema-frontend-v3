import PropTypes from "prop-types";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { useGetAvailabreProductosQuery } from "../../store/services/productoApi";

const getStockFromInventarios = (inventario, idSucursal) => {
  if (Array.isArray(inventario)) {
    if (idSucursal != null) {
      const m = inventario.find(
        (iv) => Number(iv?.id_sucursal) === Number(idSucursal)
      );
      return Number(m?.cantidad) || 0;
    }
    return inventario.reduce((acc, iv) => acc + (Number(iv?.cantidad) || 0), 0);
  }
  return Number(inventario?.cantidad) || 0;
};

const SelectorProducto = ({
  label,
  onProductoSeleccionado,
  productoSeleccionado = null,
  size = "medium",
  idSucursal,
}) => {
  const { data, isLoading } = useGetAvailabreProductosQuery(
    idSucursal ? { id_sucursal: idSucursal } : {}
  );
  const productos = data?.productos || [];
  const theme = useTheme();

  return (
    <Autocomplete
      options={productos}
      value={productoSeleccionado}
      getOptionLabel={(o) => o?.nombre_producto || ""}
      loading={isLoading}
      onChange={(_, nuevo) => onProductoSeleccionado(nuevo)}
      isOptionEqualToValue={(opt, val) => opt?.id_producto === val?.id_producto}
      size={size}
      renderOption={(optionProps, option) => {
        const { key, ...rest } = optionProps;

        const stock = getStockFromInventarios(option?.inventario, idSucursal);
        const stockColor =
          stock > 20
            ? theme.palette.success.main
            : stock > 0
            ? theme.palette.warning.main
            : theme.palette.error.main;

        return (
          <Box
            key={key}
            component="li"
            {...rest}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              borderRadius: 1,
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {option.nombre_producto}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: stockColor, fontStyle: "italic", ml: 1 }}
            >
              Stock: {stock}
            </Typography>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && <CircularProgress size={18} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

SelectorProducto.propTypes = {
  label: PropTypes.string.isRequired,
  onProductoSeleccionado: PropTypes.func.isRequired,
  productoSeleccionado: PropTypes.object,
  size: PropTypes.oneOf(["small", "medium"]),
  idSucursal: PropTypes.number,
};

export default SelectorProducto;
