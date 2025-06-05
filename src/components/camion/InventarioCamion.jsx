import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  LinearProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { useGetEstadoInventarioCamionQuery } from "../../store/services/inventarioCamionApi";
import { useImperativeHandle, useMemo, forwardRef } from "react";

const InventarioCamion = forwardRef(({ id_camion }, ref) => {
  const theme = useTheme();
  const { data, isLoading, error, refetch } =
    useGetEstadoInventarioCamionQuery(id_camion);

  useImperativeHandle(ref, () => ({
    refetchInventario: () => {
      refetch();
    },
  }));

  const {
    capacidad_total = 0,
    vacios = 0,
  } = data?.data || {};

  const en_uso = capacidad_total - vacios;
  const disponibles_actuales = vacios;

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
        bgcolor:
          theme.palette.mode === "dark" ? theme.palette.grey[900] : "#F5F9FF",
        overflow: "hidden",
      }}
    >
      <CardHeader
        title="Inventario del Camión"
        titleTypographyProps={{
          fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.18rem" },
          fontWeight: "bold",
          color: theme.palette.primary.main,
        }}
        sx={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.primary.dark + "11"
              : theme.palette.primary.light + "33",
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
            {
              label: "Capacidad",
              value: capacidad_total,
              color: theme.palette.grey[400],
            },
            {
              label: "En Uso",
              value: en_uso,
              color: theme.palette.warning.main,
            },
            {
              label: "Disponibles",
              value: disponibles_actuales,
              color: theme.palette.success.main,
            },
          ].map((item) => (
            <Box key={item.label} flex={1}>
              <Typography
                sx={{
                  fontSize: { xs: "0.80rem", sm: "0.88rem" },
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1.28rem", sm: "1.58rem" },
                  fontWeight: "bold",
                  color: item.color,
                }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: theme.palette.text.primary,
              fontWeight: 500,
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
                    ? theme.palette.success.main
                    : porcentajeUsado < 80
                    ? theme.palette.warning.main
                    : theme.palette.error.main,
              },
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : "#E0E0E0",
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
          fontSize: { xs: "0.68rem", sm: "0.76rem", md: "0.82rem" },
        }}
      >
        Actualizado en tiempo real
      </Typography>
    </Card>
  );
});

InventarioCamion.displayName = "InventarioCamion";

InventarioCamion.propTypes = {
  id_camion: PropTypes.number.isRequired,
};

export default InventarioCamion;
