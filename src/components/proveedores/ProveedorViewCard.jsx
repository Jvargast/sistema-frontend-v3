import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import Business from "@mui/icons-material/Business";
import Badge from "@mui/icons-material/Badge";
import AlternateEmail from "@mui/icons-material/AlternateEmail";
import PhoneIphone from "@mui/icons-material/PhoneIphone";
import Home from "@mui/icons-material/Home";
import Category from "@mui/icons-material/Category";
import Event from "@mui/icons-material/Event";
import dayjs from "dayjs";
import { formatRut } from "../../utils/rut";

const Row = ({ icon: Icon, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ minHeight: 32 }}>
    <Icon fontSize="small" />
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600} noWrap title={value}>
      {value ?? "—"}
    </Typography>
  </Stack>
);

Row.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string,
  value: PropTypes.any,
};

const ProveedorViewCard = ({ proveedor }) => {
  const creado = proveedor?.fecha_de_creacion
    ? dayjs(proveedor.fecha_de_creacion).format("DD-MM-YYYY HH:mm")
    : "—";
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Row
              icon={Business}
              label="Razón social"
              value={proveedor?.razon_social}
            />
            <Row icon={Badge} label="RUT" value={formatRut(proveedor?.rut)} />
            <Row icon={Category} label="Giro" value={proveedor?.giro || "—"} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Row
              icon={AlternateEmail}
              label="Email"
              value={proveedor?.email || "—"}
            />
            <Row
              icon={PhoneIphone}
              label="Teléfono"
              value={proveedor?.telefono || "—"}
            />
            <Row
              icon={Home}
              label="Dirección"
              value={proveedor?.direccion || "—"}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Row icon={Event} label="Creado" value={creado} />
      </CardContent>
    </Card>
  );
};

ProveedorViewCard.propTypes = { proveedor: PropTypes.object };

export default ProveedorViewCard;
