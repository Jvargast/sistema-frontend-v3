import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Chip,
  Divider,
  Box,
  useTheme,
} from "@mui/material";
import { TIPOS_CC } from "../../utils/centroCosto";

const CentroCostoPreview = ({ form, sucursalActual }) => {
  const theme = useTheme();
  const tipoLabel = TIPOS_CC.find((t) => t.id === form.tipo)?.label || "—";

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
      }}
    >
      <CardHeader
        title="Ficha previa"
        subheader="Resumen en tiempo real"
        sx={{
          "& .MuiCardHeader-title": {
            color: theme.palette.text.primary,
            fontWeight: 700,
          },
          "& .MuiCardHeader-subheader": { color: theme.palette.text.secondary },
        }}
      />
      <Divider />
      <CardContent sx={{ flex: 1 }}>
        <Stack spacing={1.5}>
          <Box sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
            Nombre
          </Box>
          <Box sx={{ fontSize: 18, fontWeight: 700 }}>{form.nombre || "—"}</Box>

          <Divider />

          <Box sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
            Tipo
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={tipoLabel} variant="outlined" />
            {form.activo ? (
              <Chip
                label="Activo"
                color="success"
                variant="outlined"
                size="small"
              />
            ) : (
              <Chip
                label="Inactivo"
                color="default"
                variant="outlined"
                size="small"
              />
            )}
          </Stack>

          <Divider />

          <Box sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
            Referencia
          </Box>
          <Box>{form.ref_id || "—"}</Box>

          <Divider />

          <Box sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
            Sucursal
          </Box>
          <Box>
            {form.restringirSucursal
              ? sucursalActual?.nombre || "—"
              : "Disponible para todas"}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

CentroCostoPreview.propTypes = {
  form: PropTypes.object.isRequired,
  sucursalActual: PropTypes.object,
};

export default CentroCostoPreview;
