import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  useMediaQuery,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";

const InventarioCargado = ({ inventario, isLoading }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  if (isLoading) {
    return (
      <Box textAlign="center" my={4}>
        <Typography variant="body1" color="text.secondary">
          Cargando inventario...
        </Typography>
      </Box>
    );
  }

  if (!inventario) {
    return (
      <Box textAlign="center" my={4}>
        <Typography variant="body1" color="error">
          Inventario no disponible
        </Typography>
      </Box>
    );
  }

  const {
    capacidad_total,
    reservados_retornables,
    reservados_no_retornables,
    disponibles,
    retorno,
    vacios,
  } = inventario;

  const datos = [
    {
      label: "Capacidad Total",
      value: `${capacidad_total} espacios`,
      color: "primary.main",
    },
    {
      label: "Reservados Retornables",
      value: `${reservados_retornables} unidades`,
      color: "orange",
    },
    {
      label: "Reservados No Retornables",
      value: `${reservados_no_retornables} unidades`,
      color: "#757575",
    },
    {
      label: "Disponibles (Adicionales)",
      value: `${disponibles} unidades`,
      color: "green",
    },
    {
      label: "En Retorno",
      value: `${retorno} unidades`,
      color: "blue",
    },
    {
      label: "Espacios Vacíos",
      value: `${vacios} espacios libres`,
      color: "lightgray",
    },
  ];

  return (
    <Card
      elevation={4}
      sx={{
        mb: 4,
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <CardContent>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          gutterBottom
        >
          📦 Inventario Actual del Camión
        </Typography>

        <Stack spacing={2} mt={2}>
          {datos.map((item, index) => (
            <Box key={index}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={1}
              >
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color="text.secondary"
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ color: item.color }}
                >
                  {item.value}
                </Typography>
              </Box>
              {index < datos.length - 1 && <Divider sx={{ mt: 1 }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

InventarioCargado.propTypes = {
  inventario: PropTypes.shape({
    capacidad_total: PropTypes.number,
    reservados_retornables: PropTypes.number,
    reservados_no_retornables: PropTypes.number,
    disponibles: PropTypes.number,
    retorno: PropTypes.number,
    vacios: PropTypes.number,
  }),
  isLoading: PropTypes.bool,
};

export default InventarioCargado;
