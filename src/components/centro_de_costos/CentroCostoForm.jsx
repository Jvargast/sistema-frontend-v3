import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Stack,
  Button,
  Divider,
  useTheme,
  Autocomplete,
  Chip,
  FormHelperText,
} from "@mui/material";
import { SaveOutlined, RestartAltOutlined } from "@mui/icons-material";
import { TIPOS_CC } from "../../utils/centroCosto";

const CentroCostoForm = ({
  form,
  onChange,
  nombreState,
  tipoState,
  canSave,
  isSaving,
  onSubmit,
  onReset,
  sucursales,
  loadingSuc,
  isScoped,
  scopeSucursal,
}) => {
  const theme = useTheme();

  const alcanceChip = (
    <Chip
      label={
        isScoped
          ? `Alcance: ${scopeSucursal?.nombre || "Sucursal"}`
          : "Alcance: Global"
      }
      color={isScoped ? "primary" : "default"}
      variant="outlined"
      size="small"
    />
  );

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
        title="Datos del Centro de Costo"
        subheader="Define la naturaleza y alcance"
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
          {/* Columna IZQUIERDA: Nombre → Referencia */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1.5}>
              <TextField
                label="Nombre"
                value={form.nombre}
                onChange={onChange("nombre")}
                fullWidth
                required
                helperText={nombreState.msg || " "}
                error={!nombreState.valid && !!form.nombre}
                FormHelperTextProps={{ sx: { minHeight: 20 } }}
              />

              <TextField
                label="Referencia (ID externo)"
                value={form.ref_id}
                onChange={onChange("ref_id")}
                placeholder="Ej: ID de camión, proyecto, etc."
                fullWidth
                inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
                helperText="Opcional: vinculación lógica con otra entidad"
              />
            </Stack>
          </Grid>

          {/* Columna DERECHA: Tipo → Alcance → Restringir → Selector → Activo */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1.5}>
              <FormControl
                fullWidth
                required
                error={!tipoState.valid && !!form.tipo}
              >
                <InputLabel id="tipo-cc">Tipo</InputLabel>
                <Select
                  labelId="tipo-cc"
                  label="Tipo"
                  value={form.tipo || ""}
                  onChange={onChange("tipo")}
                >
                  {TIPOS_CC.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ minHeight: 20 }}>
                  {tipoState.msg || " "}
                </FormHelperText>
              </FormControl>

              <Stack direction="row" alignItems="center" spacing={1}>
                {alcanceChip}
              </Stack>

              {!isScoped && (
                <>
                  <FormControlLabel
                    sx={{
                      m: 0,
                      justifyContent: "space-between",
                      ".MuiFormControlLabel-label": {
                        mr: 1,
                        color: theme.palette.text.secondary,
                      },
                    }}
                    label="Restringir a una sucursal"
                    labelPlacement="start"
                    control={
                      <Switch
                        size="small"
                        checked={form.restringirSucursal}
                        onChange={(_, v) =>
                          onChange("restringirSucursal")({
                            target: { value: v },
                          })
                        }
                      />
                    }
                  />

                  {form.restringirSucursal && (
                    <Autocomplete
                      loading={loadingSuc}
                      options={sucursales || []}
                      value={
                        (sucursales || []).find(
                          (s) => s?.id_sucursal === form.id_sucursal
                        ) || null
                      }
                      onChange={(_, val) =>
                        onChange("id_sucursal")(
                          null,
                          val ? val.id_sucursal : null
                        )
                      }
                      getOptionLabel={(o) => (o?.nombre ? `${o.nombre}` : "")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sucursal"
                          placeholder="Selecciona sucursal"
                          fullWidth
                        />
                      )}
                      fullWidth
                    />
                  )}
                </>
              )}

              <Stack direction="row" alignItems="center" spacing={1}>
                <FormControlLabel
                  sx={{
                    m: 0,
                    justifyContent: "space-between",
                    ".MuiFormControlLabel-label": {
                      mr: 1,
                      color: theme.palette.text.secondary,
                    },
                  }}
                  label="Activo"
                  labelPlacement="start"
                  control={
                    <Switch
                      size="small"
                      checked={form.activo}
                      onChange={(_, v) =>
                        onChange("activo")({ target: { value: v } })
                      }
                    />
                  }
                />
                <Chip
                  label={form.activo ? "Activo" : "Inactivo"}
                  color={form.activo ? "success" : "default"}
                  variant="outlined"
                  size="small"
                />
              </Stack>
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
            {isSaving ? "Guardando..." : "Guardar Centro de Costo"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

CentroCostoForm.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  nombreState: PropTypes.object.isRequired,
  tipoState: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  sucursales: PropTypes.array,
  loadingSuc: PropTypes.bool,
  isScoped: PropTypes.bool,
  scopeSucursal: PropTypes.shape({
    id_sucursal: PropTypes.number,
    nombre: PropTypes.string,
  }),
};

export default CentroCostoForm;
