import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  FormHelperText,
  Chip,
  Stack,
  Typography,
  useTheme,
  InputAdornment,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import NotesOutlined from "@mui/icons-material/NotesOutlined";
import LocalShipping from "@mui/icons-material/LocalShipping";
import WorkOutline from "@mui/icons-material/WorkOutline";
import Badge from "@mui/icons-material/Badge";
import RequestQuote from "@mui/icons-material/RequestQuote";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import StyleOutlined from "@mui/icons-material/StyleOutlined";

const TIPOS_CATEGORIA = [
  { id: "operativo", label: "Operativo", Icon: WorkOutline, color: "primary" },
  { id: "personal", label: "Personal", Icon: Badge, color: "secondary" },
  { id: "financiero", label: "Financiero", Icon: RequestQuote, color: "info" },
  { id: "impuestos", label: "Impuestos", Icon: ReceiptLong, color: "warning" },
  {
    id: "logistica",
    label: "Logística",
    Icon: LocalShipping,
    color: "success",
  },
  { id: "otros", label: "Otros", Icon: StyleOutlined, color: "default" },
];

function metaTipo(tipoId, theme) {
  const found =
    TIPOS_CATEGORIA.find((t) => t.id === tipoId) || TIPOS_CATEGORIA.at(-1);
  const main =
    found.color === "default"
      ? theme.palette.text.secondary
      : theme.palette[found.color].main;
  const bg = alpha(main, 0.12);
  return { ...found, main, bg };
}

export default function CategoriaGastoDialog({
  open,
  initialData,
  onClose,
  onSubmit,
  isSaving,
}) {
  const theme = useTheme();
  const [form, setForm] = useState({
    nombre_categoria: "",
    descripcion: "",
    tipo_categoria: "",
    deducible: true,
    activo: true,
  });

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setForm({
        nombre_categoria: initialData.nombre_categoria || "",
        descripcion: initialData.descripcion || "",
        tipo_categoria: initialData.tipo_categoria || "",
        deducible:
          typeof initialData.deducible === "boolean"
            ? initialData.deducible
            : true,
        activo:
          typeof initialData.activo === "boolean" ? initialData.activo : true,
      });
    } else {
      setForm({
        nombre_categoria: "",
        descripcion: "",
        tipo_categoria: "",
        deducible: true,
        activo: true,
      });
    }
  }, [open, initialData]);

  const [touched, setTouched] = useState(false);
  const nombreOk = form.nombre_categoria.trim().length >= 3;
  const tipoOk = !!form.tipo_categoria;
  const canSave = nombreOk && tipoOk && !isSaving;

  const tipoMeta = useMemo(
    () => metaTipo(form.tipo_categoria, theme),
    [form.tipo_categoria, theme]
  );

  const onChange = (field) => (e, v) => {
    const value = e?.target?.value ?? v ?? "";
    if (field === "activo" || field === "deducible") {
      setForm((s) => ({ ...s, [field]: Boolean(value) }));
    } else if (typeof value === "string") {
      setForm((s) => ({ ...s, [field]: value.trimStart() }));
    } else {
      setForm((s) => ({ ...s, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    setTouched(true);
    if (!canSave) return;
    onSubmit(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: {
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          pb: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CategoryOutlined
          sx={{
            color: tipoMeta.main,
            background: tipoMeta.bg,
            p: 0.75,
            borderRadius: 2,
            fontSize: 28,
          }}
        />
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography component="span" variant="h6" fontWeight={800}>
            {initialData
              ? "Editar Categoría de Gasto"
              : "Nueva Categoría de Gasto"}
          </Typography>
          {form.tipo_categoria && (
            <Chip
              label={tipoMeta.label}
              size="small"
              sx={{
                bgcolor: tipoMeta.bg,
                color: tipoMeta.main,
                borderColor: alpha(tipoMeta.main, 0.35),
              }}
              variant="outlined"
            />
          )}
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent
        dividers
        sx={{
          border: "none",
          pt: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              value={form.nombre_categoria}
              onChange={onChange("nombre_categoria")}
              fullWidth
              required
              error={touched && !nombreOk}
              helperText={
                touched && !nombreOk
                  ? "Mínimo 3 caracteres"
                  : "Nombre visible en reportes y formularios"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryOutlined fontSize="small" />
                  </InputAdornment>
                ),
              }}
              autoFocus
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required error={touched && !tipoOk}>
              <InputLabel id="tipo-cat">Tipo</InputLabel>
              <Select
                labelId="tipo-cat"
                label="Tipo"
                value={form.tipo_categoria}
                onChange={onChange("tipo_categoria")}
                renderValue={(val) => {
                  const meta = metaTipo(val, theme);
                  const Ico = meta.Icon;
                  return (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Ico fontSize="small" sx={{ color: meta.main }} />
                      <span>{meta.label}</span>
                    </Stack>
                  );
                }}
              >
                {TIPOS_CATEGORIA.map(({ id, label, Icon, color }) => (
                  <MenuItem key={id} value={id}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Icon
                        fontSize="small"
                        sx={{
                          color:
                            color === "default"
                              ? "text.secondary"
                              : `${color}.main`,
                        }}
                      />
                    </ListItemIcon>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {touched && !tipoOk ? "Selecciona un tipo" : " "}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Descripción"
              value={form.descripcion}
              onChange={onChange("descripcion")}
              fullWidth
              multiline
              minRows={2}
              placeholder="Opcional: describe el uso de esta categoría"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotesOutlined fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
            >
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
              <FormControlLabel
                control={
                  <Switch
                    checked={form.activo}
                    onChange={(_, v) =>
                      onChange("activo")({ target: { value: v } })
                    }
                    size="small"
                  />
                }
                label="Activo"
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={!canSave}>
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CategoriaGastoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  initialData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};
