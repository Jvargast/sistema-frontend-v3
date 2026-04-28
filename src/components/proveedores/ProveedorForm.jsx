import { Card, CardHeader, CardContent, Autocomplete, Switch, FormControlLabel, Button, Tooltip, Chip, InputAdornment, Divider, useTheme } from "@mui/material";
import {
  SaveOutlined,
  RestartAltOutlined,
  CheckCircleOutlineOutlined,
  ErrorOutlineOutlined,
  BusinessOutlined,
  EmailOutlined,
  LocationOnOutlined,
  BadgeOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { GIROS_SUGERIDOS } from "../../hooks/useProveedorForm";
import PhoneTextField from "../common/PhoneTextField";
import TextField from "../common/CompatTextField";
import Grid from "../common/CompatGrid";
import Stack from "../common/CompatStack";

const ProveedorForm = ({
  form,
  onChange,
  rutState,
  telState,
  isDuplicado,
  canSave,
  isSaving,
  onReset,
  onSubmit,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
      }}
      component="form"
      onSubmit={onSubmit}
    >
      <CardHeader
        title="Datos del Proveedor"
        subheader="Completa los campos obligatorios"
        sx={{
          "& .MuiCardHeader-title": {
            color: theme.palette.text.primary,
            fontWeight: 700,
          },
          "& .MuiCardHeader-subheader": { color: theme.palette.text.secondary },
        }}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="RUT"
              value={form.rut}
              onChange={onChange("rut")}
              placeholder="12.345.678-5"
              fullWidth
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {rutState.valid === true && !isDuplicado && (
                      <Tooltip title="RUT válido">
                        <CheckCircleOutlineOutlined color="success" />
                      </Tooltip>
                    )}
                    {rutState.valid === false && (
                      <Tooltip title={rutState.msg || "RUT inválido"}>
                        <ErrorOutlineOutlined color="warning" />
                      </Tooltip>
                    )}
                    {isDuplicado && (
                      <Tooltip title="RUT ya existe">
                        <VerifiedOutlined color="error" />
                      </Tooltip>
                    )}
                  </InputAdornment>
                ),
              }}
              helperText={
                isDuplicado
                  ? "Este RUT ya está registrado."
                  : rutState.msg || " "
              }
              error={rutState.valid === false || isDuplicado}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Razón Social"
              value={form.razon_social}
              onChange={onChange("razon_social")}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              freeSolo
              options={GIROS_SUGERIDOS}
              inputValue={form.giro || ""}
              isOptionEqualToValue={(o, v) => o === v}
              value={form.giro || ""}
              onInputChange={(e, v) => onChange("giro")(e, v || "")}
              onChange={(e, v) => onChange("giro")(e, v || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Giro"
                  placeholder="Ej: Servicios Profesionales"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              value={form.email}
              onChange={onChange("email")}
              fullWidth
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <PhoneTextField
              label="Teléfono"
              value={form.telefono}
              onChange={onChange("telefono")}
              fullWidth
              helperText={form.telefono ? telState.msg || " " : " "}
              error={!!form.telefono && telState.valid === false}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Dirección"
              value={form.direccion}
              onChange={onChange("direccion")}
              fullWidth
              placeholder="Calle 123, Comuna, Región"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.activo}
                    onChange={(_, v) =>
                      onChange("activo")({ target: { value: v } })
                    }
                  />
                }
                label="Activo"
              />
              <Chip
                label={
                  isDuplicado
                    ? "RUT duplicado"
                    : rutState.valid
                    ? "RUT válido"
                    : "RUT pendiente"
                }
                color={
                  isDuplicado ? "error" : rutState.valid ? "success" : "default"
                }
                variant="outlined"
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardContent>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<RestartAltOutlined />}
            onClick={onReset}
          >
            Limpiar
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveOutlined />}
            disabled={!canSave}
          >
            {isSaving ? "Guardando..." : "Guardar Proveedor"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

ProveedorForm.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  rutState: PropTypes.object.isRequired,
  telState: PropTypes.object.isRequired,
  isDuplicado: PropTypes.bool.isRequired,
  canSave: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ProveedorForm;
