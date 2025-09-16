import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import { ESTADOS_COMPRA } from "../../constants/estadosCompra";
import { formatCLP } from "../../utils/formatUtils";

const estadoChip = (v) =>
  ESTADOS_COMPRA.find((e) => e.value === String(v || "").toLowerCase()) || {
    label: v || "—",
    color: "default",
  };

export default function CompraOverview({ compra, sucursales = [] }) {
  const suc = (() => {
    const id = compra?.id_sucursal;
    if (!id) return "—";
    return (
      compra?.sucursal?.nombre ||
      compra?.Sucursal?.nombre ||
      (Array.isArray(sucursales)
        ? sucursales.find((s) => Number(s.id_sucursal) === Number(id))?.nombre
        : undefined) ||
      `Sucursal ${id}`
    );
  })();

  const e = estadoChip(compra?.estado);

  return (
    <Card>
      <CardHeader title="Resumen de la compra" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <strong>Fecha</strong>
            <div>
              {compra?.fecha ? dayjs(compra.fecha).format("DD-MM-YYYY") : "—"}
            </div>
          </Grid>
          <Grid item xs={12} md={3}>
            <strong>Fecha doc.</strong>
            <div>
              {compra?.fecha_documento
                ? dayjs(compra.fecha_documento).format("DD-MM-YYYY")
                : "—"}
            </div>
          </Grid>
          <Grid item xs={12} md={3}>
            <strong>N° documento</strong>
            <div>{compra?.nro_documento || "—"}</div>
          </Grid>
          <Grid item xs={12} md={3}>
            <strong>Estado</strong>
            <div>
              <Chip
                size="small"
                label={e.label}
                color={e.color}
                variant="outlined"
              />
            </div>
          </Grid>

          <Grid item xs={12} md={4}>
            <strong>Proveedor</strong>
            <div>
              {compra?.proveedor?.razon_social ||
                compra?.Proveedor?.razon_social ||
                compra?.proveedor?.nombre ||
                "—"}
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <strong>Sucursal</strong>
            <div>{suc}</div>
          </Grid>
          <Grid item xs={12} md={4}>
            <strong>Moneda</strong>
            <div>{compra?.moneda || "CLP"}</div>
          </Grid>

          <Grid item xs={12} md={4}>
            <strong>Subtotal</strong>
            <div>{formatCLP(Number(compra?.subtotal || 0))}</div>
          </Grid>
          <Grid item xs={12} md={4}>
            <strong>IVA</strong>
            <div>{formatCLP(Number(compra?.iva || 0))}</div>
          </Grid>
          <Grid item xs={12} md={4}>
            <strong>Total</strong>
            <div>
              <b>{formatCLP(Number(compra?.total || 0))}</b>
            </div>
          </Grid>

          <Grid item xs={12}>
            <strong>Observaciones</strong>
            <div>{compra?.observaciones || "—"}</div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

CompraOverview.propTypes = {
  compra: PropTypes.object.isRequired,
  sucursales: PropTypes.array,
};
