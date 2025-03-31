import { Box, Typography, Alert, Paper } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";

const CapacidadCargaCamion = ({
  capacidadTotal,
  reservadosRetornables,
  disponibles,
  retorno,
  productos,
  productosReservados,
  onValidezCambio,
}) => {
  // 🔹 Calcular el espacio realmente disponible para cargar retornables
  const espacioUsadoActual = reservadosRetornables + disponibles + retorno;
  const espaciosDisponiblesParaRetornables =
    capacidadTotal - espacioUsadoActual;

  // 🔹 Productos retornables a cargar desde el formulario
  const productosRetornables = productos.filter(
    (p) => p.es_retornable && Number(p.cantidad) > 0
  );

  // 🔹 Cantidad total de retornables nuevos a cargar
  const cantidadProductosRetornables = productosRetornables.reduce(
    (total, p) => total + (Number(p.cantidad) || 0),
    0
  );

  // 🔹 Validaciones específicas
  const cantidadNegativa = productosRetornables.some(
    (p) => Number(p.cantidad) < 0
  );

  const excedeEspaciosDisponibles =
    cantidadProductosRetornables + productosReservados >
    espaciosDisponiblesParaRetornables;

  const sinEspacio = espaciosDisponiblesParaRetornables <= 0;

  // ✅ Hook para informar validez claramente
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
        sx={{ textAlign: "center", p: 2, borderRadius: 2, bgcolor: "#f5f5f5" }}
      >
        <Typography variant="body1">
          <strong>Capacidad Total:</strong> {capacidadTotal}
        </Typography>
        <Typography variant="body1">
          <strong>Espacios Disponibles (Reales):</strong>{" "}
          {espaciosDisponiblesParaRetornables}
        </Typography>
        <Typography variant="body1">
          <strong>Productos ya Reservados (Retornables):</strong>{" "}
          {productosReservados}
        </Typography>
        <Typography variant="body1">
          <strong>Productos Retornables a Cargar Ahora:</strong>{" "}
          {cantidadProductosRetornables}
        </Typography>
        <Typography variant="body1">
          <strong>Retornos ya en Camión:</strong> {retorno}
        </Typography>
        <Typography variant="body1">
          <strong>Disponibles ya en Camión:</strong> {disponibles}
        </Typography>
      </Box>

      {/* 🔹 Mensajes claros según la validación */}
      {cantidadNegativa && (
        <Alert severity="error" sx={{ mt: 2 }}>
          ❌ Error: Cantidades negativas no permitidas.
        </Alert>
      )}

      {sinEspacio ? (
        <Alert severity="warning" sx={{ mt: 2, fontWeight: "bold" }}>
          ⚠️ ¡No hay espacio disponible en el camión para retornables!
        </Alert>
      ) : excedeEspaciosDisponibles ? (
        <Alert severity="error" sx={{ mt: 2, fontWeight: "bold" }}>
          ❌ ¡No hay suficiente espacio para los productos retornables
          seleccionados!
        </Alert>
      ) : (
        <Alert severity="success" sx={{ mt: 2, fontWeight: "bold" }}>
          ✅ ¡Todo bien! Puedes cargar estos productos retornables.
        </Alert>
      )}
    </Paper>
  );
};

CapacidadCargaCamion.propTypes = {
  capacidadTotal: PropTypes.number.isRequired,
  reservadosRetornables: PropTypes.number.isRequired,
  disponibles: PropTypes.number.isRequired,
  retorno: PropTypes.number.isRequired,
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
