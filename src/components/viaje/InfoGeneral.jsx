import { Card, CardContent, Chip, Divider } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PropTypes from "prop-types";
import Box from "../common/CompatBox";
import Stack from "../common/CompatStack";
import Typography from "../common/CompatTypography";

const InfoGeneral = ({ viaje }) => {
  const fechaInicio = viaje.fecha_inicio ? new Date(viaje.fecha_inicio) : null;
  const fechaFormateada =
    fechaInicio && !Number.isNaN(fechaInicio.getTime())
      ? fechaInicio.toLocaleString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Sin fecha definida";

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "En Tránsito":
        return "primary";
      case "Finalizado":
        return "success";
      case "Pendiente":
      default:
        return "default";
    }
  };

  const detalleItems = [
    {
      key: "camion",
      icon: <Inventory2OutlinedIcon fontSize="small" />,
      label: "Camión",
      value: `#${viaje.id_camion}`,
    },
    {
      key: "fecha",
      icon: <CalendarTodayOutlinedIcon fontSize="small" />,
      label: "Inicio",
      value: fechaFormateada,
    },
  ];

  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        mb: { xs: 2.25, md: 3 },
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "light"
            ? "0 10px 28px rgba(15, 23, 42, 0.08)"
            : "0 10px 28px rgba(0, 0, 0, 0.28)",
        overflow: "hidden",
      })}
    >
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2, md: 2.5 },
          "&:last-child": { pb: { xs: 1.5, sm: 2, md: 2.5 } },
        }}
      >
        <Stack spacing={{ xs: 1.5, md: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: { xs: 1.25, sm: 2 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.1, sm: 1.4 },
                minWidth: 0,
              }}
            >
              <Box
                sx={(theme) => ({
                  width: { xs: 42, sm: 48 },
                  height: { xs: 42, sm: 48 },
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.common.white
                      : "#0F172A",
                  bgcolor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.3 : 0.08),
                  border: `1px solid ${alpha("#0F172A", 0.12)}`,
                  flex: "0 0 auto",
                })}
              >
                <LocalShippingIcon sx={{ fontSize: { xs: 23, sm: 26 } }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: "1.15rem", sm: "1.35rem", md: "1.55rem" },
                    lineHeight: 1.15,
                    fontWeight: 900,
                    color: "text.primary",
                  }}
                >
                  Agenda de viaje
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.25,
                    fontWeight: 600,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Resumen operativo del despacho asignado
                </Typography>
              </Box>
            </Box>

            <Chip
              label={viaje.estado}
              color={getEstadoColor(viaje.estado)}
              variant="filled"
              size="small"
              sx={{
                borderRadius: 1,
                height: 30,
                fontWeight: 800,
                flex: "0 0 auto",
                mt: { xs: 0.4, sm: 0 },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: { xs: 1, sm: 1.25 },
            }}
          >
            {detalleItems.map((item) => (
              <Box
                key={item.key}
                sx={(theme) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 0,
                  p: { xs: 1, sm: 1.15 },
                  borderRadius: 1.5,
                  bgcolor: alpha("#0F172A", theme.palette.mode === "dark" ? 0.2 : 0.04),
                  border: `1px solid ${alpha("#0F172A", theme.palette.mode === "dark" ? 0.18 : 0.08)}`,
                })}
              >
                <Box
                  sx={(theme) => ({
                    width: 30,
                    height: 30,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.palette.text.secondary,
                    bgcolor: theme.palette.background.paper,
                    flex: "0 0 auto",
                  })}
                >
                  {item.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "text.secondary",
                      fontWeight: 800,
                      lineHeight: 1.1,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontWeight: 750,
                      lineHeight: 1.25,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {viaje.notas && (
            <Box>
              <Divider sx={{ mb: 1.25 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <NotesOutlinedIcon
                  fontSize="small"
                  sx={{ color: "text.secondary", mt: 0.2, flex: "0 0 auto" }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 800 }}
                  >
                    Notas adicionales
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viaje.notas}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
InfoGeneral.propTypes = {
  viaje: PropTypes.shape({
    estado: PropTypes.string.isRequired,
    id_camion: PropTypes.number.isRequired,
    fecha_inicio: PropTypes.string.isRequired,
    notas: PropTypes.string,
  }).isRequired,
};

export default InfoGeneral;
