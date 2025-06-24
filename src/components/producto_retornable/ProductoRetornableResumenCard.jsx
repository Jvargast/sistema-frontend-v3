import PropTypes from "prop-types";
import { Paper, Typography, TextField, Grid } from "@mui/material";

const ProductoRetornableResumenCard = ({ producto, estado, onChange }) => {
  const total = producto.totalCantidad;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {producto.nombreProducto} — Total: {total} unidades
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
        Recibido el {new Date(producto.fecha_retorno).toLocaleDateString()}
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            label="Reutilizables"
            type="number"
            inputProps={{ min: 0, max: total }}
            fullWidth
            value={estado.reutilizable}
            onChange={(e) =>
              onChange(producto.id, "reutilizable", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Defectuosos"
            type="number"
            inputProps={{ min: 0, max: total }}
            fullWidth
            value={estado.defectuoso}
            onChange={(e) =>
              onChange(producto.id, "defectuoso", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Tipo defecto (opcional)"
            fullWidth
            value={estado.tipo_defecto}
            onChange={(e) =>
              onChange(producto.id, "tipo_defecto", e.target.value)
            }
            disabled={!Number(estado.defectuoso)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

ProductoRetornableResumenCard.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombreProducto: PropTypes.string.isRequired,
    totalCantidad: PropTypes.number.isRequired,
    fecha_retorno: PropTypes.string,
  }),
  estado: PropTypes.object,
  onChange: PropTypes.func,
};

export default ProductoRetornableResumenCard;
