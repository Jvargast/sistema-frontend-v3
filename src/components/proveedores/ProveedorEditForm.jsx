import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  /*   CardActions,
  Button, */
} from "@mui/material";
import { useEffect, useState } from "react";

function validateEmail(email) {
  if (!email) return true;
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}
function validatePhone(phone) {
  if (!phone) return true;
  return /^[+]?\d[\d\s()-]{5,}$/.test(phone);
}

const ProveedorEditForm = ({
  proveedor,
  onSubmit /* , onCancel, saving  */,
}) => {
  const [form, setForm] = useState({
    rut: "",
    razon_social: "",
    giro: "",
    email: "",
    telefono: "",
    direccion: "",
    activo: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!proveedor) return;
    setForm({
      rut: proveedor.rut || "",
      razon_social: proveedor.razon_social || "",
      giro: proveedor.giro || "",
      email: proveedor.email || "",
      telefono: proveedor.telefono || "",
      direccion: proveedor.direccion || "",
      activo: Boolean(proveedor.activo),
    });
  }, [proveedor]);

  const handleChange = (field) => (e) => {
    const value = field === "activo" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [field]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const nextErrors = {};
    if (!form.razon_social.trim()) nextErrors.razon_social = "Requerido";
    if (!validateEmail(form.email)) nextErrors.email = "Email inválido";
    if (!validatePhone(form.telefono))
      nextErrors.telefono = "Teléfono inválido";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const patch = {};
    const fields = [
      "rut",
      "razon_social",
      "giro",
      "email",
      "telefono",
      "direccion",
      "activo",
    ];
    fields.forEach((k) => {
      const prev = proveedor?.[k];
      const val =
        k === "activo" ? Boolean(form[k]) : String(form[k] ?? "").trim();
      const normalizedPrev =
        k === "activo" ? Boolean(prev) : String(prev ?? "").trim();
      if (val !== normalizedPrev)
        patch[k] = k === "activo" ? Boolean(val) : val || null;
    });

    onSubmit?.(patch);
  };

  return (
    <Card
      component="form"
      id="proveedor-edit-form"
      onSubmit={handleSubmit}
      onReset={(e) => {
        e.preventDefault();
        if (!proveedor) return;
        setForm({
          rut: proveedor.rut || "",
          razon_social: proveedor.razon_social || "",
          giro: proveedor.giro || "",
          email: proveedor.email || "",
          telefono: proveedor.telefono || "",
          direccion: proveedor.direccion || "",
          activo: Boolean(proveedor.activo),
        });
      }}
      noValidate
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Razón social"
              value={form.razon_social}
              onChange={handleChange("razon_social")}
              fullWidth
              required
              error={!!errors.razon_social}
              helperText={errors.razon_social}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="RUT"
              value={form.rut}
              onChange={handleChange("rut")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Giro"
              value={form.giro}
              onChange={handleChange("giro")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              value={form.email}
              onChange={handleChange("email")}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Teléfono"
              value={form.telefono}
              onChange={handleChange("telefono")}
              fullWidth
              error={!!errors.telefono}
              helperText={errors.telefono}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              value={form.direccion}
              onChange={handleChange("direccion")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  onChange={handleChange("activo")}
                />
              }
              label="Activo"
            />
          </Grid>
        </Grid>
        {/* <CardActions sx={{ justifyContent: "flex-end", mt: 1 }}>
          <Button
            variant="outlined"
            disabled={saving}
            onClick={() => {
              if (proveedor) {
                setForm({
                  rut: proveedor.rut || "",
                  razon_social: proveedor.razon_social || "",
                  giro: proveedor.giro || "",
                  email: proveedor.email || "",
                  telefono: proveedor.telefono || "",
                  direccion: proveedor.direccion || "",
                  activo: Boolean(proveedor.activo),
                });
              }
              onCancel?.();
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </Button>
        </CardActions> */}
      </CardContent>
    </Card>
  );
};

ProveedorEditForm.propTypes = {
  proveedor: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  saving: PropTypes.bool,
};

export default ProveedorEditForm;
