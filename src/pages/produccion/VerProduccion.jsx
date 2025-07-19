import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Paper,
  Grid,
  Avatar,
} from "@mui/material";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { useGetProduccionByIdQuery } from "../../store/services/produccionApi";
import { tiempoDesdeChile } from "../../utils/fechaUtils";

const VerProduccion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: produccion, isLoading, error } = useGetProduccionByIdQuery(id);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !produccion) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">Error al cargar la producción.</Typography>
      </Box>
    );
  }

  const {
    id_produccion,
    fecha_produccion,
    rut_usuario,
    operario,
    formula,
    unidades_fabricadas,
    cantidad_lote,
    activo,
    consumos = [],
  } = produccion;

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        p: { xs: 2, md: 4 },
        backgroundColor: "background.paper",
        borderRadius: 4,
        boxShadow: 2,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: "none", fontWeight: 700 }}
          onClick={() => navigate("/admin/produccion")}
        >
          Volver al historial
        </Button>
        <Chip
          label={activo ? "Producción activa" : "Inactiva"}
          color={activo ? "success" : "default"}
          icon={<AssignmentTurnedInOutlinedIcon />}
          sx={{ fontWeight: "bold", minWidth: 160 }}
        />
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        color="primary"
      >
        📦 Detalle de Producción #{id_produccion}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : theme.palette.grey[100],
            }}
          >
            <Stack direction="row" alignItems="center" gap={2} mb={2}>
              <Inventory2OutlinedIcon fontSize="medium" color="action" />
              <Typography fontWeight={600}>Producto final:</Typography>
              <Chip
                label={formula?.Producto?.nombre_producto || "-"}
                color="action"
                sx={{ fontWeight: "bold" }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={2} mb={2}>
              <ChecklistOutlinedIcon fontSize="medium" color="action" />
              <Typography>Lotes:</Typography>
              <Chip
                label={cantidad_lote}
                variant="outlined"
                color="default"
                sx={{ fontWeight: 500 }}
              />
              <Typography>Fabricadas:</Typography>
              <Chip
                label={parseInt(unidades_fabricadas)}
                variant="outlined"
                color="success"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={2} mb={2}>
              <AccessTimeOutlinedIcon fontSize="medium" color="action" />
              <Typography>Fecha producción:</Typography>
              <Chip
                label={tiempoDesdeChile(fecha_produccion)}
                variant="filled"
                color="primary"
                sx={{ fontWeight: 500 }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={2} mb={2}>
              <PersonOutlineOutlinedIcon color="action" />
              <Typography>Operario:</Typography>
              <Chip
                avatar={
                  <Avatar>
                    {(
                      operario?.nombre?.[0] ||
                      rut_usuario?.[0] ||
                      ""
                    ).toUpperCase()}
                  </Avatar>
                }
                label={
                  operario
                    ? `${operario.nombre} ${operario.apellido || ""}`
                    : rut_usuario
                }
                color="secondary"
                sx={{ fontWeight: "bold" }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={2} mb={2}>
              <CategoryOutlinedIcon color="action" />
              <Typography>Fórmula usada:</Typography>
              <Chip
                label={
                  formula?.nombre_formula
                    ? `${formula.nombre_formula} (#${formula.id_formula})`
                    : "—"
                }
                icon={
                  formula?.id_formula ? (
                    <OpenInNewOutlinedIcon
                      sx={{ fontSize: 20, color: "primary.main" }}
                    />
                  ) : undefined
                }
                color="default"
                sx={{
                  fontWeight: 600,
                  cursor: formula?.id_formula ? "pointer" : "default",
                  transition: "background 0.2s",
                  "&:hover": formula?.id_formula
                    ? {
                        bgcolor: "primary.50",
                      }
                    : {},
                }}
                onClick={
                  formula?.id_formula
                    ? () => navigate(`/formulas/ver/${formula.id_formula}`)
                    : undefined
                }
                title="Ver detalle de fórmula"
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : theme.palette.grey[50],
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={1}
              color="textPrimary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Inventory2OutlinedIcon fontSize="medium" color="action" />
              Insumos consumidos
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Box sx={{ maxHeight: 340, overflow: "auto", pr: 1 }}>
              {consumos.length === 0 ? (
                <Typography color="text.secondary" fontStyle="italic">
                  No hay consumos registrados.
                </Typography>
              ) : (
                consumos.map((cons) => (
                  <Stack
                    key={cons.id_insumo}
                    direction="row"
                    alignItems="center"
                    gap={1.5}
                    mb={1}
                    p={1}
                    borderRadius={2}
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.grey[800]
                          : theme.palette.grey[100],
                    }}
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "info.light" }}
                    >
                      {cons.insumo?.nombre_insumo?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                    <Typography flex={1}>
                      {cons.insumo?.nombre_insumo || "-"}
                    </Typography>
                    <Chip
                      label={`${parseInt(cons.cantidad_consumida)} ${
                        cons.unidad_medida
                      }`}
                      color="primary"
                      size="small"
                    />
                  </Stack>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VerProduccion;
