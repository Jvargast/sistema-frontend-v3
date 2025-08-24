import PropTypes from "prop-types";
import {
  Box,
  Stack,
  Typography,
  Chip,
  useTheme,
  Tooltip,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const IndicadoresPanel = ({ insumos }) => {
  const t = useTheme();

  const distintos = new Set(insumos.map((i) => i.id)).size;
  const cubiertos = insumos.filter((i) => i.stock >= i.requerido).length;
  const faltantes = distintos - cubiertos;
  const pct = distintos === 0 ? 0 : Math.round((cubiertos / distintos) * 100);

  const iconSx = { fontSize: 28, mb: 0.75 };
  const labelSx = { mt: 0.5, fontSize: 14 };
  const numberSx = { mt: 0.25, fontSize: 24, fontWeight: 700 };

  return (
    <Box
      sx={{
        px: 4,
        py: 3,
        borderRadius: 3,
        bgcolor:
          t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
        border: 1,
        borderColor: "divider", 
      }}
    >
      <Stack
        direction="row"
        divider={<Box sx={{ borderRight: 1, borderColor: "divider" }} />}
        justifyContent="space-between"
      >
        <Box flex={1} textAlign="center">
          <Tooltip title="Cantidad de insumos distintos requeridos">
            <Inventory2OutlinedIcon color="primary" sx={iconSx} />
          </Tooltip>
          <Typography sx={labelSx} color="text.secondary">
            Tipos de insumo
          </Typography>
          <Typography sx={numberSx}>{distintos}</Typography>
        </Box>

        <Box flex={1} textAlign="center">
          <Tooltip title="Insumos con stock suficiente">
            <CheckCircleOutlineIcon color="success" sx={iconSx} />
          </Tooltip>
          <Typography sx={labelSx} color="text.secondary">
            Con stock
          </Typography>
          <Chip
            label={`${cubiertos}/${distintos}`}
            sx={{
              mt: 0.25,
              fontWeight: 600,
              px: 1.5,
              bgcolor: t.palette.success.light,
              color: t.palette.success.contrastText,
              fontSize: 16,
            }}
          />
        </Box>

        <Box flex={1} textAlign="center">
          <Tooltip title="Insumos con stock insuficiente">
            <ErrorOutlineIcon
              color={faltantes === 0 ? "disabled" : "error"}
              sx={iconSx}
            />
          </Tooltip>
          <Typography sx={labelSx} color="text.secondary">
            Faltantes
          </Typography>
          <Chip
            label={faltantes}
            sx={{
              mt: 0.25,
              fontWeight: 600,
              px: 2,
              bgcolor:
                faltantes === 0 ? t.palette.grey[400] : t.palette.error.light,
              color:
                faltantes === 0
                  ? t.palette.text.primary
                  : t.palette.error.contrastText,
              fontSize: 16,
            }}
          />
        </Box>

        <Box flex={1} textAlign="center">
          <Typography sx={labelSx} color="text.secondary">
            Cobertura
          </Typography>
          <Typography
            sx={{
              ...numberSx,
              color: faltantes === 0 ? "success.main" : "warning.main",
            }}
          >
            {pct}%
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

IndicadoresPanel.propTypes = {
  insumos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      requerido: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default IndicadoresPanel;
