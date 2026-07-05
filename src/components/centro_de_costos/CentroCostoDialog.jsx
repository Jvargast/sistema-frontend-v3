import Dialog from "../common/CompatDialog";
import * as React from "react";
import PropTypes from "prop-types";
import { DialogTitle, DialogContent, DialogActions, Button, Switch, FormControlLabel, Autocomplete, CircularProgress, IconButton } from "@mui/material";
import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SaveRounded from "@mui/icons-material/SaveRounded";
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";
import Stack from "../common/CompatStack";
import Typography from "../common/CompatTypography";
import {
  darkSwitchSx,
  primaryActionButtonSx,
  secondaryActionButtonSx,
} from "../common/actionStyles";

const TIPOS_CC = [
"Operativo",
"Producción",
"Ventas",
"Administración",
"Logística",
"Finanzas",
"Otros"];


export default function CentroCostoDialog({
  open,
  initialData,
  onClose,
  onSubmit,
  isSaving = false,
  sucursales = [],
  mode,
  activeSucursalId,
  loadingSucursales = false,
  onExited
}) {
  const isGlobal = mode === "global";

  const [form, setForm] = React.useState({
    nombre: "",
    tipo: "",
    id_sucursal: null,
    activo: true
  });

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!initialData) {
        setForm({
        nombre: "",
        tipo: "",
        id_sucursal:
        !isGlobal && activeSucursalId != null ?
        Number(activeSucursalId) :
        null,
        activo: true
        });
      } else {
        setForm({
        nombre: initialData.nombre || "",
        tipo: initialData.tipo || "",
        id_sucursal: initialData.id_sucursal ?? null,
        activo: initialData.activo !== false
        });
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [initialData, isGlobal, activeSucursalId]);

  const errors = React.useMemo(() => {
    const e = {};
    e.nombre = form.nombre.trim().length < 3 ? "Mínimo 3 caracteres" : "";
    if (isGlobal && (form.id_sucursal == null || form.id_sucursal === "")) {
      e.id_sucursal = "Selecciona una sucursal";
    }
    return e;
  }, [form.nombre, form.id_sucursal, isGlobal]);

  const canSave = React.useMemo(
    () => !Object.values(errors).some(Boolean),
    [errors]
  );

  const handleOk = () => {
    if (!canSave || isSaving) return;
    const payload = {
      nombre: form.nombre.trim(),
      tipo: form.tipo || null,
      id_sucursal: isGlobal ?
      form.id_sucursal == null ?
      null :
      Number(form.id_sucursal) :
      activeSucursalId != null ?
      Number(activeSucursalId) :
      null,
      activo: !!form.activo
    };
    onSubmit(payload);
  };

  const sucursalValue = React.useMemo(
    () =>
    sucursales.find(
      (s) => Number(s.id_sucursal) === Number(form.id_sucursal)
    ) || null,
    [sucursales, form.id_sucursal]
  );

  const handleClose = (_, reason) => {
    if (isSaving && (reason === "backdropClick" || reason === "escapeKeyDown"))
    return;
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && canSave && !isSaving) {
      e.preventDefault();
      handleOk();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown={isSaving}
      BackdropProps={{ sx: { backdropFilter: "blur(2px)" } }}
      PaperProps={{
        elevation: 0,
        sx: (theme) => ({
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow:
          theme.palette.mode === "dark" ?
          "0 10px 30px rgba(0,0,0,.6)" :
          "0 10px 30px rgba(0,0,0,.15)",
          overflow: "hidden"
        })
      }}
      TransitionProps={{
        onEntered: (node) => {
          const el = node.querySelector('input, button, [tabindex="0"]');
          el?.focus();
        },
        onExited: () => {onExited?.();}
      }}>

      <DialogTitle sx={{ m: 0, p: 0 }}>
        <Box
          sx={(theme) => ({
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
          })}>

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

              <AccountTreeOutlined />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
                {initialData ? "Editar centro de costo" : "Nuevo centro de costo"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", opacity: 0.88, fontWeight: 600 }}>

                Define nombre, tipo y sucursal del centro
              </Typography>
            </Box>
          </Stack>

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
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        onKeyDown={handleKeyDown}
        sx={(theme) => ({
          px: 3,
          py: 2.5,
          bgcolor:
          theme.palette.mode === "dark" ?
          theme.palette.background.default :
          theme.palette.background.paper
        })}>

        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField
            autoFocus
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm((s) => ({ ...s, nombre: e.target.value }))}
            fullWidth
            error={!!errors.nombre}
            helperText={errors.nombre || " "}
            disabled={isSaving} />


          <Autocomplete
            options={TIPOS_CC}
            value={form.tipo || ""}
            onChange={(_, v) => setForm((s) => ({ ...s, tipo: v || "" }))}
            freeSolo
            renderInput={(p) =>
            <TextField
              {...p}
              label="Tipo (opcional)"
              placeholder="Ej: Operativo, Ventas…"
              disabled={isSaving} />

            }
            disabled={isSaving}
            clearOnBlur={false}
            autoHighlight />


          <Autocomplete
            options={sucursales || []}
            value={sucursalValue}
            onChange={(_, v) =>
            setForm((s) => ({ ...s, id_sucursal: v?.id_sucursal ?? null }))
            }
            isOptionEqualToValue={(o, v) =>
            Number(o?.id_sucursal) === Number(v?.id_sucursal)
            }
            getOptionLabel={(o) =>
            o?.nombre || (o?.id_sucursal ? `Sucursal ${o.id_sucursal}` : "")
            }
            loading={loadingSucursales}
            noOptionsText={loadingSucursales ? "Cargando…" : "Sin resultados"}
            renderInput={(p) =>
            <TextField
              {...p}
              label="Sucursal"
              error={!!errors.id_sucursal}
              helperText={
              isGlobal ?
              errors.id_sucursal || " " :
              "Fijada por alcance (no editable)"
              }
              disabled={isSaving || !isGlobal} />

            }
            disabled={isSaving || !isGlobal}
            sx={{}} />


          <FormControlLabel
            control={
            <Switch
              checked={!!form.activo}
              onChange={(_, v) => setForm((s) => ({ ...s, activo: v }))}
              disabled={isSaving}
              sx={darkSwitchSx} />

            }
            label="Activo" />

        </Stack>
      </DialogContent>

      <DialogActions
        sx={(theme) => ({
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor:
          theme.palette.mode === "dark" ?
          "rgba(0,0,0,.4)" :
          "rgba(255,255,255,.6)",
          backdropFilter: "saturate(180%) blur(6px)"
        })}>

        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<CloseRounded />}
          disabled={isSaving}
          sx={(theme) => secondaryActionButtonSx(theme)}>

          Cancelar
        </Button>
        <Button
          onClick={handleOk}
          variant="contained"
          disabled={!canSave || isSaving}
          startIcon={
          isSaving ? <CircularProgress size={18} /> : <SaveRounded />
          }
          disableElevation
          sx={(theme) => primaryActionButtonSx(theme)}>

          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>);

}

CentroCostoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  initialData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  sucursales: PropTypes.array,
  mode: PropTypes.string,
  activeSucursalId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loadingSucursales: PropTypes.bool,
  onExited: PropTypes.func
};
