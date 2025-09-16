import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Divider,
  Stack,
  Chip,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ProveedorPicker from "./ProveedorPicker";
import { MONEDAS } from "../../constants/monedas";
import { ESTADOS_COMPRA } from "../../constants/estadosCompra";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";

const CompraHeaderCard = ({ header, setHeader, onProveedor }) => {
  return (
    <Card>
      <CardHeader
        title="Encabezado de la compra"
        subheader="Proveedor, documento y fechas"
      />
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ProveedorPicker
                value={header.proveedor}
                onChange={(p) => onProveedor(p)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Fecha"
                type="date"
                value={header.fecha || ""}
                onChange={(e) =>
                  setHeader((h) => ({ ...h, fecha: e.target.value }))
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Moneda"
                value={header.moneda || "CLP"}
                onChange={(e) =>
                  setHeader((h) => ({ ...h, moneda: e.target.value }))
                }
                fullWidth
                SelectProps={{
                  renderValue: (val) => {
                    const m =
                      MONEDAS.find((x) => x.value === val) || MONEDAS[0];
                    const Icon = m.icon;
                    return (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Icon fontSize="small" />
                        <span>
                          {m.label} ({m.value})
                        </span>
                      </Stack>
                    );
                  },
                }}
              >
                {MONEDAS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <MenuItem key={m.value} value={m.value}>
                      <ListItemIcon>
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={m.label} secondary={m.value} />
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="IVA (%)"
                type="number"
                value={Math.round((header.iva_porcentaje ?? 0.19) * 100)}
                onChange={(e) => {
                  const pct = Math.max(
                    0,
                    Math.min(100, Number(e.target.value || 0))
                  );
                  setHeader((h) => ({ ...h, iva_porcentaje: pct / 100 }));
                }}
                inputProps={{ min: 0, max: 100, step: 0.5 }}
                fullWidth
                helperText="Se aplica sólo a ítems marcados como afectos"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="N° documento"
                value={header.nro_documento || ""}
                onChange={(e) =>
                  setHeader((h) => ({ ...h, nro_documento: e.target.value }))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Fecha documento"
                value={
                  header.fecha_documento ? dayjs(header.fecha_documento) : null
                }
                onChange={(v) =>
                  setHeader((h) => ({
                    ...h,
                    fecha_documento: v ? v.format("YYYY-MM-DD") : "",
                  }))
                }
                format="DD-MM-YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Estado"
                value={header.estado || "borrador"}
                onChange={(e) =>
                  setHeader((h) => ({ ...h, estado: e.target.value }))
                }
                fullWidth
                SelectProps={{
                  renderValue: (val) => {
                    const s =
                      ESTADOS_COMPRA.find((x) => x.value === val) ||
                      ESTADOS_COMPRA[0];
                    const Icon = s.icon;
                    return (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Icon fontSize="small" />
                        <Chip
                          size="small"
                          label={s.label}
                          color={s.color}
                          variant="outlined"
                        />
                      </Stack>
                    );
                  },
                }}
              >
                {ESTADOS_COMPRA.map((s) => {
                  const Icon = s.icon;
                  return (
                    <MenuItem key={s.value} value={s.value}>
                      <ListItemIcon>
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={s.label} />
                      <Chip size="small" label={s.value} sx={{ ml: 1 }} />
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Observaciones"
                value={header.observaciones || ""}
                onChange={(e) =>
                  setHeader((h) => ({ ...h, observaciones: e.target.value }))
                }
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
          </Grid>
        </CardContent>
      </LocalizationProvider>
    </Card>
  );
};

CompraHeaderCard.propTypes = {
  header: PropTypes.object.isRequired,
  setHeader: PropTypes.func.isRequired,
  onProveedor: PropTypes.func.isRequired,
};

export default CompraHeaderCard;
