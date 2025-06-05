import { Box, Typography, Paper, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
const MotionBox = motion(Box);

const InventarioCamion = ({
  inventarioData,
  modo = "visual",
  productos = [],
  productosReservados = [],
}) => {
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const {
    capacidad_total,
    disponibles,
    reservados_retornables,
    reservados_no_retornables,
    retorno,
    vacios,
  } = inventarioData;

  const columnas = isTablet ? 6 : 10;

  const espaciosReservadosProyectados =
    modo === "simulacion"
      ? productosReservados.reduce((total, prod) => total + prod.cantidad, 0)
      : 0;
  const retornablesACargarAhora =
    modo === "simulacion"
      ? productos
          .filter((p) => p.es_retornable)
          .reduce((acc, p) => acc + p.cantidad, 0)
      : 0;

  const arrayReservadosCarga =
    modo === "simulacion"
      ? Array(espaciosReservadosProyectados).fill({
          tipo: "ReservadoParaCarga",
        })
      : [];

  const bloques = [
    ...Array(reservados_retornables).fill({ tipo: "ReservadoRetornable" }),
    ...Array(reservados_no_retornables).fill({ tipo: "ReservadoNoRetornable" }),
    ...Array(retornablesACargarAhora).fill({ tipo: "ACargarAhora" }),
    ...Array(disponibles).fill({ tipo: "Disponible" }),
    ...Array(retorno).fill({ tipo: "Retorno" }),
    ...arrayReservadosCarga,
  ];

  let espaciosCamion = bloques.slice(0, capacidad_total);

  const faltantes = capacidad_total - espaciosCamion.length;
  if (faltantes > 0) {
    espaciosCamion = [
      ...espaciosCamion,
      ...Array(faltantes).fill({ tipo: "Vacío" }),
    ];
  }

  const getColor = (tipo) => {
    switch (tipo) {
      case "ReservadoRetornable":
        return "orange";
      case "ReservadoNoRetornable":
        return "purple";
      case "Disponible":
        return "green";
      case "Retorno":
        return "blue";
      case "ReservadoParaCarga":
        return "#e57373";
      case "Vacío":
        return "lightgray";
      case "ACargarAhora":
        return "#0097a7";
      default:
        return "gray";
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        textAlign: "center",
        mt: 2,
        overflowX: "auto",
      }}
    >
      <Typography variant="h6" mb={2}>
        Inventario del Camión (Capacidad: {capacidad_total} espacios)
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={`repeat(${columnas}, 1fr)`}
        gap={1}
        justifyContent="center"
      >
        {espaciosCamion.map((item, index) => (
          <MotionBox
            key={index}
            width={40}
            height={40}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor={getColor(item.tipo)}
            borderRadius={1}
            fontSize="12px"
            fontWeight="bold"
            animate={
              item.tipo === "ReservadoParaCarga" || item.tipo === "ACargarAhora"
                ? { scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }
                : {}
            }
            transition={
              item.tipo === "ReservadoParaCarga" || item.tipo === "ACargarAhora"
                ? { repeat: Infinity, duration: 2 }
                : {}
            }
          >
            {item.tipo === "ACargarAhora" ? "D" : item.tipo.charAt(0)}
          </MotionBox>
        ))}
      </Box>

      <Box
        mt={2}
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="body2">
          <strong style={{ color: "orange" }}>
            ■ Reservado Retornable: {reservados_retornables}
          </strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "purple" }}>
            ■ Reservado No Retornable: {reservados_no_retornables}
          </strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "green" }}>
            ■ Disponible: {disponibles}
          </strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "blue" }}>■ Retorno: {retorno}</strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "#e57373" }}>
            ■ A cargar (Proyectado): {espaciosReservadosProyectados}
          </strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "lightgray" }}>■ Vacío: {vacios}</strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "#0097a7" }}>
            ■ Retornables a Cargar Ahora: {retornablesACargarAhora}
          </strong>
        </Typography>
      </Box>
    </Paper>
  );
};

InventarioCamion.propTypes = {
  inventarioData: PropTypes.shape({
    capacidad_total: PropTypes.number,
    disponibles: PropTypes.number,
    reservados_retornables: PropTypes.number,
    reservados_no_retornables: PropTypes.number,
    retorno: PropTypes.number,
    vacios: PropTypes.number,
  }).isRequired,
  modo: PropTypes.oneOf(["visual", "simulacion"]),
  productos: PropTypes.array,
  productosReservados: PropTypes.arrayOf(
    PropTypes.shape({
      id_pedido: PropTypes.number,
      id_producto: PropTypes.number,
      nombre_producto: PropTypes.string,
      cantidad: PropTypes.number,
      es_retornable: PropTypes.bool,
    })
  ),
};

export default InventarioCamion;
