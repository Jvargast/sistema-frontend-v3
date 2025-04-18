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
  const cantidadTotalProductosReservados = productosReservados.reduce(
    (total, prod) => total + prod.cantidad,
    0
  );

  const espacioUsadoActual = reservadosRetornables + disponibles + retorno;

  const espaciosDisponiblesParaRetornables =
    capacidadTotal - espacioUsadoActual - cantidadTotalProductosReservados;

  const productosRetornables = productos.filter(
    (p) => p.es_retornable && Number(p.cantidad) > 0
  );

  const cantidadProductosRetornables = productosRetornables.reduce(
    (total, p) => total + (Number(p.cantidad) || 0),
    0
  );

  const cantidadNegativa = productosRetornables.some(
    (p) => Number(p.cantidad) < 0
  );

  const excedeEspaciosDisponibles =
    cantidadProductosRetornables > espaciosDisponiblesParaRetornables;

  const sinEspacio = espaciosDisponiblesParaRetornables <= 0;

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
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        bgcolor: "background.paper",
        textAlign: "center",
        border: "2px solid #ddd",
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color="primary"
        sx={{ mb: 2, fontSize: { xs: "1.1rem", sm: "1.3rem" } }}
      >
        📦 Capacidad del Camión
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // 1 columna en pantallas muy pequeñas
            sm: "1fr 1fr", // 2 columnas a partir de 600px
          },
          gap: 2,
          textAlign: "center",
          p: 2,
          borderRadius: 2,
          bgcolor: "#f5f5f5",
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
        >
          <strong>Capacidad Total:</strong> {capacidadTotal}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
        >
          <strong>Espacios Disponibles (Reales):</strong>{" "}
          {espaciosDisponiblesParaRetornables}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
        >
          <strong>Productos ya Reservados (Retornables):</strong>{" "}
          {cantidadTotalProductosReservados}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#0097a7",
            fontSize: { xs: "0.85rem", sm: "1rem" },
          }}
        >
          <strong>Productos Retornables a Cargar Ahora:</strong>{" "}
          {cantidadProductosRetornables}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
        >
          <strong>Retornos ya en Camión:</strong> {retorno}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
        >
          <strong>Disponibles ya en Camión:</strong> {disponibles}
        </Typography>
      </Box>

      {/* Mensajes claros según la validación */}
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
  productosReservados: PropTypes.arrayOf(
    PropTypes.shape({
      id_pedido: PropTypes.number.isRequired,
      id_producto: PropTypes.number.isRequired,
      nombre_producto: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
      es_retornable: PropTypes.bool,
    })
  ).isRequired,
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
