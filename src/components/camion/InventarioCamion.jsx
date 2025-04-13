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
import { LinearProgress } from "@mui/material";
import { useMemo } from "react";

const InventarioCamion = ({ id_camion }) => {
  const { data, isLoading, error } =
    useGetEstadoInventarioCamionQuery(id_camion);

  const {
    capacidad_total = 0,
    reservados_retornables = 0,
    disponibles = 0,
  } = data?.data || {};

  const en_uso = reservados_retornables;

  const porcentajeUsado = useMemo(() => {
    if (!capacidad_total) return 0;
    return Math.round((en_uso / capacidad_total) * 100);
  }, [en_uso, capacidad_total]);

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

  return (
    <Card
      sx={{
        borderRadius: 2,
        /*  backgroundColor: "#f9f9f9",
        border: "1px solid #ddd", */
        bgcolor: "#F5F9FF",
        overflow: "hidden",
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
            display: "flex",
            justifyContent: "space-between",
            textAlign: "center",
            px: { xs: 1, sm: 2 },
            gap: { xs: 1, sm: 2 },
            alignItems: "center",
          }}
        >
          {[
            { label: "Capacidad", value: capacidad_total, color: "#212121" },
            { label: "En Uso", value: en_uso, color: "#EF6C00" },
            { label: "Disponible", value: disponibles, color: "#2E7D32" },
          ].map((item) => (
            <Box key={item.label} flex={1}>
              <Typography
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  color: "#666",
                  fontWeight: "medium",
                  mb: 0.5,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1.3rem", sm: "1.6rem" },
                  fontWeight: "bold",
                  color: item.color,
                }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: "#444",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {en_uso} de {capacidad_total} en uso ({porcentajeUsado}%)
          </Typography>
          <LinearProgress
            variant="determinate"
            value={porcentajeUsado}
            sx={{
              height: 10,
              borderRadius: 5,
              [`& .MuiLinearProgress-bar`]: {
                borderRadius: 5,
                backgroundColor:
                  porcentajeUsado < 50
                    ? "#43A047"
                    : porcentajeUsado < 80
                    ? "#FFB300"
                    : "#E53935",
              },
              backgroundColor: "#E0E0E0",
            }}
          />
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
