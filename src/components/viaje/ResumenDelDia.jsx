import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    LinearProgress,
    Stack,
  } from "@mui/material";
  import AssignmentIcon from "@mui/icons-material/Assignment";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import PendingActionsIcon from "@mui/icons-material/PendingActions";
  import PropTypes from "prop-types";
  import CountUp from "react-countup";
  
  const ResumenDelDia = ({ totalDestinos, entregasCompletadas }) => {
    const entregasPendientes = totalDestinos - entregasCompletadas;
    const porcentaje = totalDestinos
      ? Math.round((entregasCompletadas / totalDestinos) * 100)
      : 0;
  
    const getColorPorcentaje = (porcentaje) => {
      if (porcentaje < 30) return "#ef5350"; // rojo
      if (porcentaje < 70) return "#ffb300"; // amarillo
      return "#00c853"; // verde
    };
  
    return (
      <Card elevation={3} sx={{ mb: 4, backgroundColor: "#f9f9f9" }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            📊 Resumen del Día
          </Typography>
  
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AssignmentIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Entregas asignadas
                  </Typography>
                  <Typography variant="h6" color="primary">
                    <CountUp end={totalDestinos} duration={1} />
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleIcon color="success" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Completadas
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    <CountUp end={entregasCompletadas} duration={1} />
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PendingActionsIcon color="warning" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    <CountUp end={entregasPendientes} duration={1} />
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
  
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body2"
              sx={{ mb: 0.5 }}
              color="text.secondary"
            >
              Avance del viaje: {porcentaje}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={porcentaje}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getColorPorcentaje(porcentaje),
                  transition: "width 0.5s ease",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  ResumenDelDia.propTypes = {
    totalDestinos: PropTypes.number.isRequired,
    entregasCompletadas: PropTypes.number.isRequired,
  };
  
  export default ResumenDelDia;
  