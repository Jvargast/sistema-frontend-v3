import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  useMediaQuery,
} from "@mui/material";
import PropTypes from "prop-types";
import { useGetEstadoInventarioCamionQuery } from "../../store/services/inventarioCamionApi";
import CapacidadCargaCamion from "../agenda_carga/CapacidadCargaCamion";

const InventarioCamion = ({
  idCamion,
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

  // 🔹 Cambio aquí: ajustado según la nueva respuesta del backend
  const {
    capacidad_total,
    disponibles,
    reservados_retornables,
    reservados_no_retornables,
    retorno,
    vacios,
  } = data.data;

  const columnas = isTablet ? 6 : 10;

  // 🔹 Cambio aquí: tipos diferenciados
  const espaciosCamion = [
    ...Array(reservados_retornables).fill({ tipo: "ReservadoRetornable" }),
    ...Array(reservados_no_retornables).fill({ tipo: "ReservadoNoRetornable" }),
    ...Array(disponibles).fill({ tipo: "Disponible" }),
    ...Array(retorno).fill({ tipo: "Retorno" }),
    ...Array(vacios).fill({ tipo: "Vacío" }),
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
          <Box
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
          >
            {item.tipo.charAt(0)}
          </Box>
        ))}
      </Box>

      {/* 🔹 Leyenda actualizada */}
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
          <strong style={{ color: "lightgray" }}>■ Vacío: {vacios}</strong>
        </Typography>
      </Box>

      {/* 🔹 Validación ajustada según retornables */}
      <CapacidadCargaCamion
        capacidadTotal={capacidad_total}
        reservadosRetornables={reservados_retornables}
        disponibles={disponibles}
        retorno={retorno}
        productos={productos}
        productosReservados={productosReservados}
        onValidezCambio={onValidezCambio}
      />
    </Paper>
  );
};

InventarioCamion.propTypes = {
  idCamion: PropTypes.number.isRequired,
  productos: PropTypes.array.isRequired,
  productosReservados: PropTypes.number.isRequired, // 🔸 Asegúrate que sea número aquí
  onValidezCambio: PropTypes.func.isRequired,
};

export default InventarioCamion;
