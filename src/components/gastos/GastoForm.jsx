import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Stack,
  Button,
  useTheme,
  Chip,
  InputAdornment,
  Tooltip,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EventOutlined from "@mui/icons-material/EventOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import PersonSearchOutlined from "@mui/icons-material/PersonSearchOutlined";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ArticleIcon from "@mui/icons-material/Article";
import DraftsIcon from "@mui/icons-material/Drafts";
import MontoIvaInput from "./MontoIvaInput";
import { useGetAllCategoriasGastoQuery } from "../../store/services/categoriaGastoApi";
import { useLazyGetAllProveedoresQuery } from "../../store/services/proveedorApi";
import { useGetAllCentrosCostoQuery } from "../../store/services/centroCostoApi";
import { alpha } from "@mui/material/styles";

const METODOS = [
  { id: "efectivo", label: "Efectivo", Icon: MonetizationOnIcon },
  { id: "transferencia", label: "Transferencia", Icon: PaymentsIcon },
  { id: "tarjeta", label: "Tarjeta", Icon: CreditCardIcon },
  { id: "cheque", label: "Cheque", Icon: AccountBalanceIcon },
  { id: "otro", label: "Otro", Icon: PaymentIcon },
];

const DOC_TIPOS = [
  { id: "", label: "Sin documento", Icon: DraftsIcon },
  { id: "boleta", label: "Boleta", Icon: ReceiptIcon },
  { id: "factura", label: "Factura", Icon: DescriptionIcon },
  { id: "recibo", label: "Recibo", Icon: ArticleIcon },
  { id: "otro", label: "Otro", Icon: DescriptionIcon },
];

export default function GastoForm({
  form,
  onChange,
  addFiles,
  removeAdjunto,
  netoIvaTotal,
  canSave,
  isSaving,
  onSubmit,
  onReset,
}) {
  const theme = useTheme();

  const acSlotProps = {
    popper: { placement: "bottom-start" },
    paper: {
      elevation: 0,
      sx: {
        mt: 0.5,
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 10px 30px rgba(0,0,0,.45)"
            : "0 10px 30px rgba(0,0,0,.12)",
      },
    },
    listbox: {
      sx: {
        p: 0,
        m: 0,
        listStyle: "none",
        "& li": { listStyle: "none" },
      },
    },
  };

  const { data: catData } = useGetAllCategoriasGastoQuery({
    activo: true,
    limit: 100,
  });
  const categorias = Array.isArray(catData) ? catData : catData?.items || [];

  const [triggerProv, provRes] = useLazyGetAllProveedoresQuery();

  const proveedoresRaw = Array.isArray(provRes.data)
    ? provRes.data
    : provRes.data?.items || [];
  const proveedores = proveedoresRaw
    .filter((p) => p?.activo === true)
    .map((p) => {
      const raw = typeof p.giro === "string" ? p.giro.trim() : "";
      const inval = ["0", "n/a", "N/A", "-", "--"].includes(raw);
      return { ...p, giro: inval ? "" : raw };
    });

  const { data: ccData } = useGetAllCentrosCostoQuery({
    activo: true,
    limit: 100,
  });
  const centros = Array.isArray(ccData) ? ccData : ccData?.items || [];

  const tipoLabel = {
    operativo: "Operativo",
    personal: "Personal",
    financiero: "Financiero",
    impuestos: "Impuestos",
    logistica: "Logística",
    otros: "Otros",
    undefined: "Otros",
    null: "Otros",
    "": "Otros",
  };

  return (
    <Card
      component="form"
      onSubmit={onSubmit}
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
      }}
    >
      <CardHeader
        title="Registrar Gasto"
        subheader="Completa los datos del gasto"
        sx={{
          "& .MuiCardHeader-title": { fontWeight: 700 },
          "& .MuiCardHeader-subheader": { color: theme.palette.text.secondary },
        }}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              type="date"
              label="Fecha"
              value={form.fecha}
              onChange={onChange("fecha")}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventOutlined />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              options={categorias}
              value={
                categorias.find(
                  (c) => c.id_categoria_gasto === form.id_categoria_gasto
                ) || null
              }
              onChange={(_, v) => {
                onChange("id_categoria_gasto")(
                  null,
                  v ? v.id_categoria_gasto : null
                );
                if (typeof v?.deducible === "boolean") {
                  onChange("deducible")({ target: { value: v.deducible } });
                }
              }}
              isOptionEqualToValue={(o, v) =>
                (o?.id_categoria_gasto || o?.id) ===
                (v?.id_categoria_gasto || v?.id)
              }
              getOptionLabel={(o) => o?.nombre_categoria || ""}
              groupBy={(o) => tipoLabel[o?.tipo_categoria || "otros"]}
              renderGroup={(params) => (
                <li key={params.key}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      fontSize: 12,
                      fontWeight: 700,
                      color: theme.palette.text.secondary,
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.primary.main, 0.08)
                          : alpha(theme.palette.primary.main, 0.06),
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    {params.group}
                  </Box>
                  <ul style={{ padding: 0, margin: 0 }}>{params.children}</ul>
                </li>
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id_categoria_gasto || option.id}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ width: "100%" }}
                  >
                    <ListItemText
                      primary={option.nombre_categoria}
                      secondary={
                        option.descripcion
                          ? option.descripcion.length > 66
                            ? option.descripcion.slice(0, 66) + "…"
                            : option.descripcion
                          : null
                      }
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ fontSize: 12 }}
                    />
                    <Chip
                      size="small"
                      label={option.deducible ? "Deducible" : "No deducible"}
                      color={option.deducible ? "success" : "default"}
                      variant={option.deducible ? "filled" : "outlined"}
                      sx={{ ml: "auto" }}
                    />
                  </Stack>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Categoría" required />
              )}
              slotProps={acSlotProps}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="metodo">Método de pago</InputLabel>
              <Select
                labelId="metodo"
                label="Método de pago"
                value={form.metodo_pago}
                onChange={onChange("metodo_pago")}
                renderValue={(val) => {
                  const opt = METODOS.find((m) => m.id === val);
                  const Icon = opt?.Icon || PaymentIcon;
                  return (
                    <Chip
                      size="small"
                      icon={<Icon sx={{ fontSize: 18 }} />}
                      label={opt?.label || "Método"}
                      sx={{ borderRadius: 1 }}
                    />
                  );
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 2,
                      overflow: "hidden",
                      border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                    },
                  },
                }}
              >
                {METODOS.map(({ id, label, Icon }) => (
                  <MenuItem key={id} value={id}>
                    <ListItemIcon sx={{ minWidth: 34 }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              options={proveedores}
              loading={provRes.isFetching}
              filterOptions={(x) => x}
              onOpen={() => {
                if (!provRes.data) triggerProv({ limit: 10, activo: true });
              }}
              onInputChange={(_, q, reason) => {
                if (reason !== "input") return;
                const search = q?.trim();
                if (search?.length >= 2)
                  triggerProv({ search, limit: 10, activo: true });
              }}
              value={
                proveedores.find((p) => p.id_proveedor === form.id_proveedor) ||
                null
              }
              onChange={(_, v) =>
                onChange("id_proveedor")(null, v ? v.id_proveedor : null)
              }
              isOptionEqualToValue={(o, v) =>
                o?.id_proveedor === v?.id_proveedor
              }
              getOptionLabel={(o) => o?.razon_social || o?.nombre || ""}
              renderOption={(props, option) => {
                //eslint-disable-next-line
                const { key, ...rest } = props;
                const giro =
                  typeof option.giro === "string" ? option.giro.trim() : "";
                const showGiro = giro.length > 0;

                return (
                  <li
                    {...rest}
                    key={key}
                    style={{ ...(rest.style || {}), listStyle: "none" }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <PersonSearchOutlined fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={option.razon_social || option.nombre}
                        secondary={[option.rut, option.email]
                          .filter(Boolean)
                          .join(" • ")}
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{ fontSize: 12 }}
                      />
                      {showGiro && (
                        <Chip
                          size="small"
                          label={giro}
                          variant="outlined"
                          sx={{ ml: "auto" }}
                        />
                      )}
                    </Stack>
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Proveedor (opcional)"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <PersonSearchOutlined />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              options={centros}
              value={
                centros.find(
                  (c) => c.id_centro_costo === form.id_centro_costo
                ) || null
              }
              onChange={(_, v) =>
                onChange("id_centro_costo")(null, v ? v.id_centro_costo : null)
              }
              isOptionEqualToValue={(o, v) =>
                o?.id_centro_costo === v?.id_centro_costo
              }
              getOptionLabel={(o) => o?.nombre || ""}
              noOptionsText="No hay centros de costo"
              renderOption={(props, option) => (
                <li {...props} key={option.id_centro_costo}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ width: "100%" }}
                  >
                    <ListItemText
                      primary={option.nombre}
                      secondary={option.tipo ? `Tipo: ${option.tipo}` : null}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ fontSize: 12 }}
                    />
                    {option.activo === false && (
                      <Chip
                        label="Inactivo"
                        size="small"
                        variant="outlined"
                        color="default"
                        sx={{ ml: "auto" }}
                      />
                    )}
                  </Stack>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Centro de Costo" required/>
                
              )}
              slotProps={acSlotProps}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="doc-tipo">Documento</InputLabel>
              <Select
                labelId="doc-tipo"
                label="Documento"
                value={form.doc_tipo}
                onChange={onChange("doc_tipo")}
                renderValue={(val) => {
                  const opt = DOC_TIPOS.find((d) => d.id === val);
                  const Icon = opt?.Icon || DescriptionIcon;
                  return (
                    <Chip
                      size="small"
                      icon={<Icon sx={{ fontSize: 18 }} />}
                      label={opt?.label || "Documento"}
                      sx={{ borderRadius: 1 }}
                    />
                  );
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 2,
                      overflow: "hidden",
                      border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                    },
                  },
                }}
              >
                {DOC_TIPOS.map(({ id, label, Icon }) => (
                  <MenuItem key={id} value={id}>
                    <ListItemIcon sx={{ minWidth: 34 }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Folio / N° Doc."
              value={form.doc_folio}
              onChange={onChange("doc_folio")}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ReceiptLongOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <MontoIvaInput
              value={form.monto_input}
              ivaIncluido={form.iva_incluido}
              onChangeMonto={(v) =>
                onChange("monto_input")({ target: { value: v } })
              }
              onToggleIva={(v) =>
                onChange("iva_incluido")({ target: { value: v } })
              }
              netoIvaTotal={netoIvaTotal}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.deducible}
                  onChange={(_, v) =>
                    onChange("deducible")({ target: { value: v } })
                  }
                  size="small"
                />
              }
              label="Deducible de impuestos"
            />
            <TextField
              label="Descripción / Nota"
              value={form.descripcion}
              onChange={onChange("descripcion")}
              fullWidth
              multiline
              minRows={3}
              sx={{ mt: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                border: `1px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <UploadFileOutlined />
                <span>Adjuntar comprobantes (PDF/imagen, máx. 10)</span>
              </Stack>
              <Button variant="outlined" component="label" size="small">
                Seleccionar archivos
                <input
                  hidden
                  multiple
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </Button>
            </Box>

            {form.adjuntos.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1 }}
                flexWrap="wrap"
                rowGap={1}
              >
                {form.adjuntos.map((f, i) => (
                  <Chip
                    key={i}
                    label={f.name}
                    onDelete={() => removeAdjunto(i)}
                    deleteIcon={<DeleteOutline />}
                    variant="outlined"
                    sx={{ maxWidth: 220 }}
                  />
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </CardContent>

      <Divider />
      <CardContent>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" onClick={onReset}>
            Limpiar
          </Button>
          <Tooltip title={canSave ? "" : "Completa los campos obligatorios"}>
            <span>
              <Button
                type="submit"
                variant="contained"
                disabled={!canSave || isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar Gasto"}
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}

GastoForm.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  addFiles: PropTypes.func.isRequired,
  removeAdjunto: PropTypes.func.isRequired,
  netoIvaTotal: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
