import {
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import PersonSearchOutlined from "@mui/icons-material/PersonSearchOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import PropTypes from "prop-types";
import { tipoChipColor } from "../../utils/gastoUtils";

function ChipField({
  caption,
  icon,
  label,
  color = "default",
  outlined = true,
  maxWidth = 280,
}) {
  const Icon = icon;
  const chipSx = {
    maxWidth,
    fontWeight: 700,
    "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
  };
  return (
    <Stack spacing={0.5} minWidth={0}>
      <Typography variant="caption" color="text.secondary">
        {caption}
      </Typography>
      {label ? (
        <Tooltip title={label} disableInteractive>
          <Chip
            icon={Icon ? <Icon sx={{ fontSize: 18 }} /> : undefined}
            label={label}
            size="small"
            color={color}
            variant={outlined ? "outlined" : "filled"}
            sx={chipSx}
          />
        </Tooltip>
      ) : (
        <Chip
          label="—"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
      )}
    </Stack>
  );
}

ChipField.propTypes = {
  caption: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  label: PropTypes.string,
  color: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]),
  outlined: PropTypes.bool,
  maxWidth: PropTypes.number,
};

export default function GastoOverview({ gasto, totalFmt }) {
  const theme = useTheme();

  const tipoCat = gasto?.categoria?.tipo_categoria
    ? String(gasto.categoria.tipo_categoria)
    : "";
  const tipoCatLabel = tipoCat
    ? tipoCat.charAt(0).toUpperCase() + tipoCat.slice(1)
    : "";

  return (
    <CardContent sx={{ pt: 1 }}>
      <Grid container spacing={2} alignItems="stretch">
        {/* Total destacado */}
        <Grid item xs={12} md={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 2,
              backgroundColor: alpha(
                theme.palette.primary.main,
                theme.palette.mode === "dark" ? 0.12 : 0.06
              ),
              borderColor: alpha(
                theme.palette.primary.main,
                theme.palette.mode === "dark" ? 0.35 : 0.25
              ),
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="overline" color="text.secondary">
                Total
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <PaidOutlined />
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {totalFmt}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              height: "100%",
              backgroundColor: alpha(
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : theme.palette.common.white,
                1
              ),
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={4}>
                <ChipField
                  caption="Categoría"
                  icon={CategoryOutlined}
                  label={gasto?.categoria?.nombre_categoria || ""}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={4}>
                <ChipField
                  caption="Tipo de categoría"
                  label={tipoCatLabel}
                  color={tipoChipColor(tipoCat)}
                  outlined
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={4}>
                <ChipField
                  caption="Proveedor"
                  icon={PersonSearchOutlined}
                  label={
                    gasto?.proveedor?.razon_social ||
                    gasto?.proveedor?.nombre ||
                    ""
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Divider sx={{ mt: 2 }} />
    </CardContent>
  );
}

GastoOverview.propTypes = {
  gasto: PropTypes.object.isRequired,
  totalFmt: PropTypes.string.isRequired,
};
