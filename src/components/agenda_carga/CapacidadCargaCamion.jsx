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
        textAlign: "center",
        boxShadow: 2,
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={3} px={1}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 22,
            fontWeight: "bold",
            boxShadow: 2,
          }}
        >
          📦
        </Box>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: "text.primary",
            fontSize: { xs: "1.15rem", sm: "1.35rem" },
            letterSpacing: 0.5,
          }}
        >
          Capacidad del Camión
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#f8fafc",
        }}
      >
        {[
          {
            label: "Capacidad Total",
            value: capacidadTotal,
          },
          {
            label: "Espacios Disponibles (Reales)",
            value: espaciosDisponiblesParaRetornables,
          },
          {
            label: "Productos ya Reservados (Retornables)",
            value: cantidadTotalProductosReservados,
          },
          {
            label: "Productos Retornables a Cargar Ahora",
            value: cantidadProductosRetornables,
            color: "#0097a7",
          },
          {
            label: "Retornos ya en Camión",
            value: retorno,
          },
          {
            label: "Disponibles ya en Camión",
            value: disponibles,
          },
        ].map(({ label, value, color }) => (
          <Box
            key={label}
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : "#fff",
              border: `1px solid`,
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : "#e3e8ee",
              borderRadius: 2,
              p: 2,
              minHeight: 64,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 0,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="bold"
              color={color || "text.secondary"}
              sx={{ mb: 0.5, textAlign: "center" }}
            >
              {label}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={700}
              color={color ? color : "primary.main"}
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem" },
                textAlign: "center",
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}
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
