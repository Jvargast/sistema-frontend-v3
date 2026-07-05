import Dialog from "../common/CompatDialog";
import Select from "../common/CompatSelect";
import PropTypes from "prop-types";
import { DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, MenuItem, FormControlLabel, Switch, FormHelperText, Chip, useTheme, InputAdornment, ListItemIcon, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SaveRounded from "@mui/icons-material/SaveRounded";
import NotesOutlined from "@mui/icons-material/NotesOutlined";
import LocalShipping from "@mui/icons-material/LocalShipping";
import WorkOutlineOutlined from "@mui/icons-material/WorkOutlineOutlined";
import Badge from "@mui/icons-material/Badge";
import RequestQuote from "@mui/icons-material/RequestQuote";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import StyleOutlined from "@mui/icons-material/StyleOutlined";
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";
import Grid from "../common/CompatGrid";
import Stack from "../common/CompatStack";
import Typography from "../common/CompatTypography";
import {
  darkSwitchSx,
  primaryActionButtonSx,
  secondaryActionButtonSx,
} from "../common/actionStyles";

const TIPOS_CATEGORIA = [
{ id: "operativo", label: "Operativo", Icon: WorkOutlineOutlined, color: "primary" },
{ id: "personal", label: "Personal", Icon: Badge, color: "secondary" },
{ id: "financiero", label: "Financiero", Icon: RequestQuote, color: "info" },
{ id: "impuestos", label: "Impuestos", Icon: ReceiptLong, color: "warning" },
{
  id: "logistica",
  label: "Logística",
  Icon: LocalShipping,
  color: "success"
},
{ id: "otros", label: "Otros", Icon: StyleOutlined, color: "default" }];


function metaTipo(tipoId, theme) {
  const found =
  TIPOS_CATEGORIA.find((t) => t.id === tipoId) || TIPOS_CATEGORIA.at(-1);
  const useNeutralAccent = ["primary", "info"].includes(found.color);
  const main =
  useNeutralAccent ?
  "#0F172A" :
  found.color === "default" ?
  theme.palette.text.secondary :
  theme.palette[found.color].main;
  const bg = alpha(main, 0.12);
  return { ...found, main, bg };
}

export default function CategoriaGastoDialog({
  open,
  initialData,
  onClose,
  onSubmit,
  isSaving
}) {
  const theme = useTheme();
  const [form, setForm] = useState({
    nombre_categoria: "",
    descripcion: "",
    tipo_categoria: "",
    deducible: true,
    activo: true
  });

  useEffect(() => {
    if (!open) return;
    const timeoutId = setTimeout(() => {
      if (initialData) {
        setForm({
        nombre_categoria: initialData.nombre_categoria || "",
        descripcion: initialData.descripcion || "",
        tipo_categoria: initialData.tipo_categoria || "",
        deducible:
        typeof initialData.deducible === "boolean" ?
        initialData.deducible :
        true,
        activo:
        typeof initialData.activo === "boolean" ? initialData.activo : true
        });
      } else {
        setForm({
        nombre_categoria: "",
        descripcion: "",
        tipo_categoria: "",
        deducible: true,
        activo: true
        });
      }
    }, 0);

    return () => clearTimeout(timeoutId);
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
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          boxShadow: 24
        }
      }}>

      <DialogTitle sx={{ m: 0, p: 0 }}>
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            color: "#fff",
            background:
            theme.palette.mode === "dark" ?
            "linear-gradient(135deg, #020617 0%, #1f2937 100%)" :
            "linear-gradient(135deg, #0F172A 0%, #1F2937 100%)"
          }}>

          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: "rgba(255,255,255,.12)",
                display: "grid",
                placeItems: "center",
                flex: "0 0 auto"
              }}>

              <CategoryOutlined />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
                {initialData ?
                "Editar categoría de gasto" :
                "Nueva categoría de gasto"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", opacity: 0.88, fontWeight: 600 }}>

                Define tipo, deducibilidad y estado
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            {form.tipo_categoria &&
            <Chip
              label={tipoMeta.label}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,.12)",
                color: "#fff",
                borderColor: "rgba(255,255,255,.28)",
                fontWeight: 800
              }}
              variant="outlined" />

            }
            <IconButton
              aria-label="Cerrar"
              onClick={onClose}
              disabled={isSaving}
              size="small"
              sx={{
                color: "#fff",
                bgcolor: "rgba(255,255,255,.12)",
                "&:hover": { bgcolor: "rgba(255,255,255,.2)" }
              }}>

              <CloseRounded fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          border: "none",
          pt: 2
        }}>

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
              touched && !nombreOk ?
              "Mínimo 3 caracteres" :
              "Nombre visible en reportes y formularios"
              }
              InputProps={{
                startAdornment:
                <InputAdornment position="start">
                    <CategoryOutlined fontSize="small" />
                  </InputAdornment>

              }}
              autoFocus />

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
                    </Stack>);

                }}>

                {TIPOS_CATEGORIA.map(({ id, label, Icon, color }) =>
                <MenuItem key={id} value={id}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Icon
                      fontSize="small"
                      sx={{
                        color:
                        color === "default" ?
                        "text.secondary" :
                        `${color}.main`
                      }} />

                    </ListItemIcon>
                    {label}
                  </MenuItem>
                )}
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
                startAdornment:
                <InputAdornment position="start">
                    <NotesOutlined fontSize="small" />
                  </InputAdornment>

              }} />

          </Grid>

          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap">

              <FormControlLabel
                control={
                <Switch
                  checked={form.deducible}
                  onChange={(_, v) =>
                  onChange("deducible")({ target: { value: v } })
                  }
                  size="small"
                  sx={darkSwitchSx} />

                }
                label="Deducible de impuestos" />

              <FormControlLabel
                control={
                <Switch
                  checked={form.activo}
                  onChange={(_, v) =>
                  onChange("activo")({ target: { value: v } })
                  }
                  size="small"
                  sx={darkSwitchSx} />

                }
                label="Activo" />

            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={(theme) => ({
          px: 2.5,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor:
          theme.palette.mode === "dark" ?
          "rgba(0,0,0,.36)" :
          "rgba(248,250,252,.72)"
        })}>

        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isSaving}
          sx={(theme) => secondaryActionButtonSx(theme)}>

          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!canSave}
          disableElevation
          startIcon={<SaveRounded />}
          sx={(theme) => primaryActionButtonSx(theme)}>

          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>);

}

CategoriaGastoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  initialData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool
};
