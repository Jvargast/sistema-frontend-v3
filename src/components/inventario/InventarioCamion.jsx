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

  const { capacidad_total, disponible, reservados, retorno, vacios } =
    data.data;

  const columnas = isTablet ? 6 : 10;

  const espaciosCamion = [
    ...Array(reservados).fill({ tipo: "Reservado" }),
    ...Array(disponible).fill({ tipo: "Disponible" }),
    ...Array(retorno).fill({ tipo: "Retorno" }),
    ...Array(vacios).fill({ tipo: "Vacío" }),
  ];

  const getColor = (tipo) => {
    switch (tipo) {
      case "Reservado":
        return "orange";
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
        overflowX: "auto", // Permite desplazamiento horizontal en pantallas pequeñas
      }}
    >
      <Typography variant="h6" mb={2}>
        Inventario del Camión (Capacidad: {capacidad_total} espacios)
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={`repeat(${columnas}, 1fr)`}
        gap={1}
      >
        {espaciosCamion.map((item, index) => (
          <Box
            key={index}
            width={40} // Ajustado para mejor responsividad
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
            {item.tipo.charAt(0)} {/* Muestra la primera letra del estado */}
          </Box>
        ))}
      </Box>

      {/* Leyenda con cantidades */}
      <Box
        mt={2}
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="body2">
          <strong style={{ color: "orange" }}>
            ■ Reservado (R): {reservados}
          </strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "green" }}>
            ■ Disponible (D): {disponible}
          </strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "blue" }}>■ Retorno (T): {retorno}</strong>
        </Typography>
        <Typography variant="body2">
          <strong style={{ color: "lightgray" }}>■ Vacío (V): {vacios}</strong>
        </Typography>
      </Box>

      {/* 🔹 Agregamos el componente de validación de capacidad */}
      <CapacidadCargaCamion
        capacidadTotal={capacidad_total}
        vacios={vacios}
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
  productosReservados: PropTypes.array.isRequired,
  onValidezCambio: PropTypes.func.isRequired,
  
};

export default InventarioCamion;
