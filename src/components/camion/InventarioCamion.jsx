import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import { useGetEstadoInventarioCamionQuery } from "../../store/services/inventarioCamionApi";

const InventarioCamion = ({ id_camion }) => {
  const { data, isLoading, error } =
    useGetEstadoInventarioCamionQuery(id_camion);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="120px"
      >
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="120px"
      >
        <Typography variant="body2" color="error" fontWeight="bold">
          ⚠ Error al obtener el inventario del camión
        </Typography>
      </Box>
    );
  }

  const { capacidad_total = 0, en_uso = 0, disponible = 0 } = data?.data || {};

  return (
    <Card
      sx={{
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
      }}
    >
      <CardHeader
        title="Inventario del Camión"
        titleTypographyProps={{
          fontSize: { xs: "0.85rem", sm: "1rem", md: "1.1rem" },
          fontWeight: "bold",
          color: "#1565C0",
        }}
        sx={{
          backgroundColor: "#E3F2FD",
          textAlign: "center",
          py: { xs: 0.5, sm: 1 },
        }}
      />
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // Una columna en pantallas pequeñas
              sm: "1fr 1fr", // Dos columnas en pantallas medianas (iPads)
              md: "1fr 1fr 1fr", // Tres columnas en pantallas grandes
            },
            gap: { xs: 1, sm: 2 },
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box sx={{ minWidth: 0, wordBreak: "break-word" }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: "#424242",
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
              }}
            >
              Capacidad:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#212121",
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              {capacidad_total}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0, wordBreak: "break-word" }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: "#FF9800",
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
              }}
            >
              En Uso:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#FF9800",
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              {en_uso}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0, wordBreak: "break-word" }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: "#388E3C",
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
              }}
            >
              Disponible:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#388E3C",
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
              }}
            >
              {disponible}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <Divider />
      <Typography
        variant="caption"
        color="gray"
        sx={{
          p: 1,
          textAlign: "center",
          display: "block",
          ontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.8rem" },
        }}
      >
        Actualizado en tiempo real
      </Typography>
    </Card>
  );
};

InventarioCamion.propTypes = {
  id_camion: PropTypes.number.isRequired,
};

export default InventarioCamion;
