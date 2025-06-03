import PropTypes from "prop-types";
import { Box, Typography, Divider, Chip, Stack } from "@mui/material";

const ResumenFormula = ({ productoFinal, cantidadFinal, cantidadInsumos }) => {
  return (
    <Box
      sx={{
        bgcolor: "primary.light",
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        height: "100%",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        🔍 Resumen de Fórmula
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Producto Final
          </Typography>
          <Chip
            label={productoFinal?.nombre_producto || "No seleccionado"}
            color={productoFinal ? "primary" : "default"}
            sx={{ fontWeight: "bold", mt: 0.5 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Cantidad Final
          </Typography>
          <Chip
            label={cantidadFinal}
            color="secondary"
            sx={{ fontWeight: "bold", mt: 0.5 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Total de Insumos
          </Typography>
          <Chip
            label={cantidadInsumos}
            color={cantidadInsumos > 0 ? "success" : "default"}
            sx={{ fontWeight: "bold", mt: 0.5 }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

ResumenFormula.propTypes = {
  productoFinal: PropTypes.shape({
    nombre_producto: PropTypes.string.isRequired,
  }),
  cantidadFinal: PropTypes.number.isRequired,
  cantidadInsumos: PropTypes.number.isRequired,
};

export default ResumenFormula;
