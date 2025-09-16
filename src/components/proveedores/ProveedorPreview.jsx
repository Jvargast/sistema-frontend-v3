import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Box,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  useTheme,
} from "@mui/material";
import {
  BadgeOutlined,
  EmailOutlined,
  LocalPhoneOutlined,
  LocationOnOutlined,
  ContentCopy,
} from "@mui/icons-material";
import PropTypes from "prop-types";

//eslint-disable-next-line
const Row = ({ icon, label, value }) => {
  const theme = useTheme();
  return (
    <Stack spacing={0.5} sx={{ mt: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Box sx={{ fontSize: 14, color: theme.palette.text.secondary }}>
          {label}
        </Box>
      </Stack>
      <Box>{value || "—"}</Box>
    </Stack>
  );
};

const ProveedorPreview = ({ form }) => {
  const giroLabel = ((form?.giro ?? "") + "").trim();
  const showGiro = giroLabel.length > 0 && giroLabel !== "0";
  const theme = useTheme();

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
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <BadgeOutlined fontSize="small" />
            <Box sx={{ fontSize: 14, color: theme.palette.text.secondary }}>
              RUT
            </Box>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              sx={{
                fontSize: 18,
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {form.rut || "—"}
            </Box>
            <Tooltip title="Copiar RUT">
              <IconButton
                size="small"
                onClick={() => navigator.clipboard?.writeText(form.rut || "")}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          <Stack spacing={1}>
            <Box sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
              Razón Social
            </Box>
            <Box sx={{ fontSize: 16, fontWeight: 600 }}>
              {form.razon_social || "—"}
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {showGiro && (
              <Chip label={giroLabel} size="small" variant="outlined" />
            )}
            {form.activo ? (
              <Chip
                label="Activo"
                size="small"
                color="success"
                variant="outlined"
              />
            ) : (
              <Chip
                label="Inactivo"
                size="small"
                color="default"
                variant="outlined"
              />
            )}
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          <Row
            icon={<EmailOutlined fontSize="small" />}
            label="Email"
            value={form.email}
          />
          <Row
            icon={<LocalPhoneOutlined fontSize="small" />}
            label="Teléfono"
            value={form.telefono}
          />
          <Row
            icon={<LocationOnOutlined fontSize="small" />}
            label="Dirección"
            value={form.direccion}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

ProveedorPreview.propTypes = {
  form: PropTypes.object.isRequired,
};

export default ProveedorPreview;
