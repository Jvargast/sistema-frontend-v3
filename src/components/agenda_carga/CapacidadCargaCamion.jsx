import { Box, Typography, Alert, Paper } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";

const CapacidadCargaCamion = ({
  capacidadTotal,
  vacios,
  productos,
  productosReservados,
  onValidezCambio,
}) => {
  // 🔹 Espacios reales disponibles para carga de productos retornables
  const espaciosDisponiblesParaRetornables = vacios - productosReservados;

  // 🔹 Filtrar solo los productos retornables con cantidad válida
  const productosRetornables = productos.filter(
    (p) => p.es_retornable && Number(p.cantidad) > 0
  );

  // 🔹 Calcular la cantidad total de productos retornables a cargar
  const cantidadProductosRetornables = productosRetornables.reduce(
    (total, p) => total + (Number(p.cantidad) || 0),
    0
  );

  // 🔹 Validaciones
  const cantidadNegativa = productosRetornables.some(
    (p) => Number(p.cantidad) < 0
  );
  const excedeEspaciosDisponibles =
    cantidadProductosRetornables > espaciosDisponiblesParaRetornables;

  const sinEspacio = espaciosDisponiblesParaRetornables === 0;

  // ✅ Hook para notificar validez
  useEffect(() => {
    const esValido =
      !cantidadNegativa && !excedeEspaciosDisponibles && !sinEspacio;
    onValidezCambio(esValido);
  }, [
    cantidadNegativa,
    excedeEspaciosDisponibles,
    sinEspacio,
    onValidezCambio,
  ]);

  if (!productos || !Array.isArray(productos)) {
    return (
      <Typography variant="body2">No hay productos seleccionados.</Typography>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        textAlign: "center",
        border: "2px solid #ddd",
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
        📦 Capacidad del Camión
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        gap={2}
        sx={{
          textAlign: "center",
          p: 2,
          borderRadius: 2,
          bgcolor: "#f5f5f5",
        }}
      >
        <Typography variant="body1">
          <strong>Capacidad Total:</strong> {capacidadTotal}
        </Typography>
        <Typography variant="body1">
          <strong>Espacios Vacíos:</strong> {vacios}
        </Typography>
        <Typography variant="body1">
          <strong>Productos Reservados a Cargar:</strong> {productosReservados}{" "}
          ⚠️
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: espaciosDisponiblesParaRetornables < 0 ? "red" : "green",
          }}
        >
          <strong>Espacios Disponibles para Retornables:</strong>{" "}
          {espaciosDisponiblesParaRetornables}
        </Typography>
        <Typography variant="body1">
          <strong>Productos Retornables a Cargar:</strong>{" "}
          {cantidadProductosRetornables}
        </Typography>
      </Box>

      {cantidadNegativa && (
        <Alert severity="error" sx={{ mt: 2 }}>
          ❌ Error: No se pueden ingresar cantidades negativas en los productos
          retornables.
        </Alert>
      )}

      {espaciosDisponiblesParaRetornables === 0 ? (
        <Alert severity="warning" sx={{ mt: 2, fontWeight: "bold" }}>
          ⚠️ ¡Atención! No hay más espacios disponibles para cargar productos
          retornables.
        </Alert>
      ) : excedeEspaciosDisponibles ? (
        <Alert severity="error" sx={{ mt: 2, fontWeight: "bold" }}>
          ❌ ¡Error! No hay suficientes espacios disponibles para cargar todos
          los productos retornables.
        </Alert>
      ) : (
        <Alert severity="success" sx={{ mt: 2, fontWeight: "bold" }}>
          ✅ Todo en orden. La carga de productos retornables cabe dentro de la
          capacidad disponible.
        </Alert>
      )}
    </Paper>
  );
};

CapacidadCargaCamion.propTypes = {
  capacidadTotal: PropTypes.number.isRequired,
  vacios: PropTypes.number.isRequired,
  productosReservados: PropTypes.number.isRequired,
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      cantidad: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      es_retornable: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onValidezCambio: PropTypes.func.isRequired,
};

export default CapacidadCargaCamion;
