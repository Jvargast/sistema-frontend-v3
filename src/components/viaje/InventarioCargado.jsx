import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import Box from "../common/CompatBox";
import Stack from "../common/CompatStack";
import Typography from "../common/CompatTypography";

const inventoryAccordionSx = {
  mb: 4,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.07)",
  overflow: "hidden",
  "&:before": { display: "none" },
  "&.Mui-expanded": { m: 0, mb: 4 },
};

const inventorySummarySx = {
  minHeight: 58,
  px: { xs: 1.5, sm: 2 },
  bgcolor: "rgba(15, 23, 42, 0.02)",
  "&.Mui-expanded": { minHeight: 58 },
  "& .MuiAccordionSummary-content": {
    my: 1,
    minWidth: 0,
  },
};

const inventoryDetailsSx = {
  p: { xs: 1.25, sm: 2 },
  borderTop: "1px solid",
  borderColor: "divider",
};

const inventoryRowsSx = {
  maxHeight: { xs: 280, sm: 340 },
  overflowY: "auto",
  overscrollBehavior: "contain",
  WebkitOverflowScrolling: "touch",
};

const inventoryColors = {
  capacidad: "#475569",
  reservadoRetornable: "#F59E0B",
  reservadoNoRetornable: "#8B5CF6",
  disponible: "#16A34A",
  retorno: "#2563EB",
  vacio: "#94A3B8",
};

const metricValueChipSx = (color) => (theme) => ({
  minWidth: { xs: "auto", sm: 132 },
  justifyContent: "center",
  bgcolor: alpha(color, theme.palette.mode === "dark" ? 0.18 : 0.11),
  color: theme.palette.mode === "dark" ? theme.palette.common.white : color,
  border: `1px solid ${alpha(color, theme.palette.mode === "dark" ? 0.34 : 0.24)}`,
  fontWeight: 800,
  borderRadius: 1,
  "& .MuiChip-label": {
    px: 1,
  },
});

const metricDotSx = (color) => (theme) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  bgcolor: color,
  boxShadow: `0 0 0 3px ${alpha(color, theme.palette.mode === "dark" ? 0.18 : 0.12)}`,
  flex: "0 0 auto",
});

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
      color: inventoryColors.capacidad,
    },
    {
      label: "Reservados Retornables",
      value: `${reservados_retornables} unidades`,
      color: inventoryColors.reservadoRetornable,
    },
    {
      label: "Reservados No Retornables",
      value: `${reservados_no_retornables} unidades`,
      color: inventoryColors.reservadoNoRetornable,
    },
    {
      label: "Disponibles (Adicionales)",
      value: `${disponibles} unidades`,
      color: inventoryColors.disponible,
    },
    {
      label: "En Retorno",
      value: `${retorno} unidades`,
      color: inventoryColors.retorno,
    },
    {
      label: "Espacios Vacíos",
      value: `${vacios} espacios libres`,
      color: inventoryColors.vacio,
    },
  ];

  const resumen = [
    {
      label: `${capacidad_total} espacios`,
      color: inventoryColors.capacidad,
    },
    {
      label: `${disponibles} disponibles`,
      color: inventoryColors.disponible,
    },
  ];

  return (
    <Accordion disableGutters elevation={0} sx={inventoryAccordionSx}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={inventorySummarySx}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={1}
          sx={{ width: "100%", minWidth: 0 }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={800}>
            Inventario Actual del Camión
          </Typography>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {resumen.map((item) => (
              <Chip
                key={item.label}
                label={item.label}
                size="small"
                sx={metricValueChipSx(item.color)}
              />
            ))}
          </Stack>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={inventoryDetailsSx}>
        <Box sx={inventoryRowsSx}>
          <Stack spacing={0}>
            {datos.map((item, index) => (
              <Box key={index}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  gap={1.5}
                  px={{ xs: 0.25, sm: 1 }}
                  py={1.15}
                  flexDirection={{ xs: "column", sm: "row" }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.25}
                    sx={{ minWidth: 0 }}
                  >
                    <Box sx={metricDotSx(item.color)} />
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      color="text.secondary"
                    >
                      {item.label}
                    </Typography>
                  </Stack>
                  <Chip
                    label={item.value}
                    size="small"
                    sx={metricValueChipSx(item.color)}
                  />
                </Box>
                {index < datos.length - 1 && <Divider />}
              </Box>
            ))}
          </Stack>
        </Box>
      </AccordionDetails>
    </Accordion>
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
