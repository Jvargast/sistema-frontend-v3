import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  useMediaQuery,
} from "@mui/material";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useGetEstadoInventarioCamionQuery } from "../../store/services/inventarioCamionApi";
import CapacidadCargaCamion from "../agenda_carga/CapacidadCargaCamion";

const MotionBox = motion(Box);

const InventarioCamion = ({
  idCamion,
  modo,
  productos,
  productosReservados,
  onValidezCambio,
}) => {
  const { data, isLoading, error } =
    useGetEstadoInventarioCamionQuery(idCamion);
  const isTablet = useMediaQuery("(max-width: 1024px)");

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Alert severity="error">Error al obtener el inventario del camión.</Alert>
    );
  }

  const {
    capacidad_total,
    disponibles,
    reservados_retornables,
    reservados_no_retornables,
    retorno,
    vacios,
  } = data.data;

  const columnas = isTablet ? 6 : 10;

  const espaciosReservadosProyectados = modo === "simulación" ? productosReservados.reduce(
    (total, prod) => total + prod.cantidad,
    0
  ): 0;

  const arrayReservadosCarga = modo === "simulacion"
  ? Array(espaciosReservadosProyectados).fill({ tipo: "ReservadoParaCarga" })
  : [];


  const espaciosCamion = [
    ...Array(reservados_retornables).fill({ tipo: "ReservadoRetornable" }),
    ...Array(reservados_no_retornables).fill({ tipo: "ReservadoNoRetornable" }),
    ...Array(disponibles).fill({ tipo: "Disponible" }),
    ...Array(retorno).fill({ tipo: "Retorno" }),
    ...arrayReservadosCarga,
    ...Array(Math.max(0, vacios - espaciosReservadosProyectados)).fill({
      tipo: "Vacío",
    }),
  ];

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
      default:
        return "gray";
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: "background.paper",
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
            color="white"
            borderRadius={1}
            fontSize="12px"
            fontWeight="bold"
            animate={
              item.tipo === "ReservadoParaCarga"
                ? { scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }
                : {}
            }
            transition={
              item.tipo === "ReservadoParaCarga"
                ? { repeat: Infinity, duration: 2 }
                : {}
            }
          >
            {item.tipo.charAt(0)}
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
      </Box>

      {modo === "simulacion" && (
        <CapacidadCargaCamion
          capacidadTotal={capacidad_total}
          reservadosRetornables={reservados_retornables}
          disponibles={disponibles}
          retorno={retorno}
          productos={productos}
          productosReservados={productosReservados}
          onValidezCambio={onValidezCambio}
        />
      )}
    </Paper>
  );
};

InventarioCamion.propTypes = {
  idCamion: PropTypes.number.isRequired,
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
  onValidezCambio: PropTypes.func,
};
InventarioCamion.defaultProps = {
  modo: "visual",
  productos: [],
  productosReservados: [],
  onValidezCambio: null,
};


export default InventarioCamion;
