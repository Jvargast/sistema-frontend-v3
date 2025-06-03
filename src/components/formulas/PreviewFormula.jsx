import PropTypes from "prop-types";
import { Box, Chip, Paper, Stack, Typography, useTheme } from "@mui/material";

const PreviewFormula = ({ formulaDetalle }) => {
  const theme = useTheme();
  if (!formulaDetalle) return null;

  const { Producto, cantidad_requerida, FormulaProductoDetalles } =
    formulaDetalle;

  const headerBg =
    theme.palette.mode === "light"
      ? theme.palette.primary.light
      : theme.palette.primary.dark;
  const bodyBg =
    theme.palette.mode === "light"
      ? theme.palette.background.paper
      : theme.palette.grey[900];

  return (
    <Paper elevation={3} sx={{ mt: 2, overflow: "hidden", bgcolor: bodyBg }}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: headerBg,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={1}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Fórmula&nbsp;para&nbsp;
            <Typography component="span" fontWeight={600}>
              {Producto?.nombre_producto}
            </Typography>
          </Typography>

          {cantidad_requerida && (
            <Chip
              label={`${cantidad_requerida} ${
                Producto?.unidad_de_medida || "u."
              }`}
              sx={{
                fontWeight: 600,
                bgcolor: "background.paper",
                color: "text.primary",
              }}
            />
          )}
        </Stack>
      </Box>

      <Box sx={{ p: 2 }}>
        {FormulaProductoDetalles.map((d) => (
          <Stack
            key={d.id_formula_detalle}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              py: 0.75,
              "&:not(:last-of-type)": {
                borderBottom: `1px dashed ${theme.palette.divider}`,
              },
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {d.Insumo?.nombre_insumo}
            </Typography>

            <Typography variant="body2" fontWeight={700}>
              {d.cantidad_requerida} {d.unidad_de_medida || "u."}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Paper>
  );
};

PreviewFormula.propTypes = {
  formulaDetalle: PropTypes.object,
};

export default PreviewFormula;
