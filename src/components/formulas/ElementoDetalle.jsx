import {
  Typography,
  Paper,
  Box,
  useTheme,
  TextField,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import PropTypes from "prop-types";
import SelectorProducto from "./SelectorProducto";
import SelectorInsumo from "./SelectorInsumo";

const ElementoDetalle = ({
  editable = false,
  tipo,
  nombre,
  cantidad,
  descripcion,
  objetoSeleccionado = null,
  onChange = () => {},
  onDelete,
  idSucursal,
}) => {
  const theme = useTheme();
  const isProducto = tipo.toLowerCase() === "producto";

  const bg = isProducto
    ? theme.palette.mode === "light"
      ? "#e3f2fd"
      : "#1e3a5f"
    : theme.palette.mode === "light"
    ? "#f9f9f9"
    : "#2c2c2c";

  const bord = isProducto ? theme.palette.primary.main : theme.palette.divider;

  const accent = isProducto
    ? theme.palette.primary.main
    : theme.palette.success.main;

  return (
    <Paper
      elevation={isProducto ? 6 : 2}
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor: bg,
        border: `2px solid ${bord}`,
        textAlign: "center",
        width: { xs: 160, sm: 180, md: 200 },
        minHeight: editable ? 200 : 160,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: editable ? undefined : "scale(1.05)",
          boxShadow: editable
            ? undefined
            : isProducto
            ? "0 8px 28px rgba(0,0,0,0.25)"
            : "0 6px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          textTransform: "uppercase",
          color: isProducto
            ? theme.palette.primary[theme.palette.mode === "light" ? 700 : 300]
            : theme.palette.grey[theme.palette.mode === "light" ? 700 : 300],
          fontWeight: "bold",
          letterSpacing: 1,
          mb: 0.5,
        }}
      >
        {tipo}
      </Typography>

      {!editable && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            {nombre}
          </Typography>

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: accent, mt: 1 }}
          >
            {cantidad}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mt: 0.5,
              fontSize: "0.85rem",
            }}
          >
            {descripcion}
          </Typography>
        </>
      )}

      {editable && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {isProducto ? (
            <SelectorProducto
              label="Producto"
              idSucursal={idSucursal}
              onProductoSeleccionado={(obj) =>
                onChange({
                  nombre: obj?.nombre_producto || "",
                  objetoSeleccionado: obj,
                })
              }
              productoSeleccionado={{ nombre_producto: nombre }}
              size="small"
            />
          ) : (
            <SelectorInsumo
              label="Insumo"
              size="small"
              idSucursal={idSucursal}
              insumoSeleccionado={objetoSeleccionado}
              onInsumoSeleccionado={(obj) =>
                onChange({
                  nombre: obj?.nombre_insumo || "",
                  descripcion: obj?.unidad_de_medida || "",
                  objetoSeleccionado: obj,
                })
              }
            />
          )}

          <TextField
            size="small"
            type="number"
            label="Cantidad"
            value={cantidad}
            onChange={(e) =>
              onChange({ cantidad: Number(e.target.value) || 0 })
            }
          />

          {!isProducto && (
            <IconButton
              aria-label="eliminar"
              color="error"
              onClick={onDelete}
              sx={{ alignSelf: "flex-end" }}
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Paper>
  );
};

ElementoDetalle.propTypes = {
  editable: PropTypes.bool,
  tipo: PropTypes.string.isRequired,
  nombre: PropTypes.string,
  cantidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  descripcion: PropTypes.string,
  objetoSeleccionado: PropTypes.object,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  idSucursal: PropTypes.number,
};

export default ElementoDetalle;
