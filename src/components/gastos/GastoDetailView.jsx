import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import AttachFileOutlined from "@mui/icons-material/AttachFileOutlined";
import PropTypes from "prop-types";
import { formatCLP } from "../../utils/formatUtils";
import { formatearFechaSistemaUTC } from "../../utils/fechaUtils";
import { getMetodoPagoLabel } from "../../constants/metodosPago";

function InfoItem({ icon: Icon, label, value, hint }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.75}>
        {Icon ? <Icon fontSize="small" /> : null}
        <Typography variant="body1">{value ?? "—"}</Typography>
        {hint ? (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
}

export default function GastoDetailView({ gasto }) {
  const docLabel = gasto?.tipo_documento
    ? gasto?.nro_documento
      ? `${gasto.tipo_documento} #${gasto.nro_documento}`
      : gasto.tipo_documento
    : "—";

  const adjCount = Array.isArray(gasto?.adjuntos) ? gasto.adjuntos.length : 0;

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader title="Detalle" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem
              label="Método de pago"
              value={getMetodoPagoLabel(gasto?.metodo_pago)}
              icon={PaidOutlined}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem
              label="Documento"
              value={docLabel}
              icon={ReceiptLongOutlined}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <InfoItem
              icon={AccountTreeOutlined}
              label="Centro de costo"
              value={gasto?.centro_costo?.nombre || "—"}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoItem
              icon={PaidOutlined}
              label="Monto neto"
              value={formatCLP(Number(gasto?.monto_neto || 0))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoItem
              icon={PaidOutlined}
              label="IVA"
              value={formatCLP(Number(gasto?.iva || 0))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoItem
              icon={PaidOutlined}
              label="Total"
              value={formatCLP(Number(gasto?.total || 0))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={AttachFileOutlined}
              label="Adjuntos"
              value={`${adjCount} archivo${adjCount === 1 ? "" : "s"}`}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Descripción / notas
            </Typography>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="flex-start"
              mt={0.5}
            >
              <DescriptionOutlined fontSize="small" />
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {gasto?.descripcion || "—"}
              </Typography>
            </Stack>
          </Grid>
          {(gasto?.fecha_de_creacion || gasto?.updated_at) && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {gasto?.fecha_de_creacion
                  ? `Creado: ${formatearFechaSistemaUTC(
                      gasto.fecha_de_creacion,
                      "DD-MM-YYYY HH:mm"
                    )}`
                  : ""}
                {gasto?.created_at && gasto?.updated_at ? "  •  " : ""}
                {gasto?.updated_at
                  ? `Actualizado: ${formatearFechaSistemaUTC(
                      gasto.updated_at,
                      "DD-MM-YYYY HH:mm"
                    )}`
                  : ""}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

InfoItem.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hint: PropTypes.string,
};

GastoDetailView.propTypes = {
  gasto: PropTypes.object.isRequired,
};
