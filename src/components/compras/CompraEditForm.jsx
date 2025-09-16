import PropTypes from "prop-types";
import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  Stack,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ProveedorPicker from "./ProveedorPicker";
import { MONEDAS } from "../../constants/monedas";
import { ESTADOS_COMPRA } from "../../constants/estadosCompra";

const inputFilledSx = {
  "& .MuiFilledInput-root": {
    borderRadius: 10,
    backgroundColor: (t) => t.palette.action.hover,
    ":hover": { backgroundColor: (t) => t.palette.action.selected },
  },
};

const CompraEditForm = ({
  form,
  setForm,
  sucursales = [],
}) => {
  const sucOptions = useMemo(
    () => (Array.isArray(sucursales) ? sucursales : []),
    [sucursales]
  );

  const setField = (field, value) => setForm((s) => ({ ...s, [field]: value }));

  return (
    <Card>
      <CardHeader
        title="Editar compra"
        subheader="Actualiza proveedor, sucursal, documento y fechas"
      />
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ProveedorPicker
                value={form.proveedor}
                onChange={(p) => {
                  setField("proveedor", p || null);
                  setField("id_proveedor", p?.id_proveedor ?? p?.id ?? null);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Sucursal"
                value={form.id_sucursal ?? ""}
                onChange={(e) =>
                  setField(
                    "id_sucursal",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                fullWidth
                variant="filled"
                InputProps={{ disableUnderline: true }}
                sx={inputFilledSx}
              >
                {sucOptions.map((s) => (
                  <MenuItem key={s.id_sucursal} value={s.id_sucursal}>
                    <ListItemText
                      primary={s.nombre || `Sucursal ${s.id_sucursal}`}
                    />
                  </MenuItem>
                ))}
                {sucOptions.length === 0 && (
                  <MenuItem disabled value="">
                    <ListItemText primary="Sin sucursales" />
                  </MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Fecha"
                value={form.fecha ? dayjs(form.fecha) : null}
                onChange={(v) =>
                  setField("fecha", v ? v.format("YYYY-MM-DD") : "")
                }
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    InputProps: { disableUnderline: true },
                    sx: inputFilledSx,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Moneda"
                value={form.moneda || "CLP"}
                onChange={(e) => setField("moneda", e.target.value)}
                fullWidth
                variant="filled"
                InputProps={{ disableUnderline: true }}
                sx={inputFilledSx}
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
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Estado"
                value={form.estado || "borrador"}
                onChange={(e) => setField("estado", e.target.value)}
                fullWidth
                variant="filled"
                InputProps={{ disableUnderline: true }}
                sx={inputFilledSx}
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
            <Grid item xs={12} md={4}>
              <TextField
                label="N° documento"
                value={form.nro_documento || ""}
                onChange={(e) => setField("nro_documento", e.target.value)}
                fullWidth
                variant="filled"
                InputProps={{ disableUnderline: true }}
                sx={inputFilledSx}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Fecha documento"
                value={
                  form.fecha_documento ? dayjs(form.fecha_documento) : null
                }
                onChange={(v) =>
                  setField("fecha_documento", v ? v.format("YYYY-MM-DD") : "")
                }
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    InputProps: { disableUnderline: true },
                    sx: inputFilledSx,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Observaciones"
                value={form.observaciones || ""}
                onChange={(e) => setField("observaciones", e.target.value)}
                fullWidth
                multiline
                minRows={2}
                variant="filled"
                InputProps={{ disableUnderline: true }}
                sx={inputFilledSx}
              />
            </Grid>
          </Grid>
        </CardContent>
      </LocalizationProvider>
    </Card>
  );
};

CompraEditForm.propTypes = {
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  sucursales: PropTypes.array,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default CompraEditForm;
