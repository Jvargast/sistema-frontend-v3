import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import PersonSearchOutlined from "@mui/icons-material/PersonSearchOutlined";
import PropTypes from "prop-types";
import { METODOS_PAGO } from "../../constants/metodosPago";
import { TIPOS_DOCUMENTO } from "../../constants/tiposDocumento";

export default function GastoEditForm({
  form,
  setForm,
  categorias,
  proveedores,
  centros,
  provIsFetching,
  onProvOpen,
  onProvSearch,
  onChange,
  onCancel,
  onSave,
  saving,
}) {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader title="Detalle" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Fecha"
              value={form.fecha || ""}
              onChange={onChange("fecha")}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={METODOS_PAGO}
              value={
                METODOS_PAGO.find((o) => o.value === form.metodo_pago) || null
              }
              onChange={(_, v) =>
                setForm((s) => ({
                  ...s,
                  metodo_pago: v ? v.value : null,
                }))
              }
              isOptionEqualToValue={(o, v) => o.value === v.value}
              getOptionLabel={(o) => o?.label || ""}
              renderOption={(props, option) => {
                //eslint-disable-next-line
                const { key, ...liProps } = props;
                const Icon = option.icon;
                return (
                  <li key={key} {...liProps}>
                    {Icon ? (
                      <Icon fontSize="small" style={{ marginRight: 8 }} />
                    ) : null}
                    {option.label}
                  </li>
                );
              }}
              renderInput={(p) => (
                <TextField
                  {...p}
                  label="Método de pago"
                  placeholder="Selecciona…"
                  fullWidth
                />
              )}
              clearOnBlur={false}
              autoHighlight
              disableClearable={false}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={categorias}
              value={
                categorias.find(
                  (c) => c.id_categoria_gasto === form.id_categoria_gasto
                ) || null
              }
              onChange={(_, v) =>
                setForm((s) => ({
                  ...s,
                  id_categoria_gasto: v ? v.id_categoria_gasto : null,
                }))
              }
              getOptionLabel={(o) => o?.nombre_categoria || ""}
              renderInput={(p) => (
                <TextField {...p} label="Categoría" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={proveedores}
              loading={provIsFetching}
              onOpen={onProvOpen}
              onInputChange={onProvSearch}
              value={
                proveedores.find((p) => p.id_proveedor === form.id_proveedor) ||
                null
              }
              onChange={(_, v) =>
                setForm((s) => ({
                  ...s,
                  id_proveedor: v ? v.id_proveedor : null,
                }))
              }
              isOptionEqualToValue={(o, v) =>
                o?.id_proveedor === v?.id_proveedor
              }
              getOptionLabel={(o) => o?.razon_social || o?.nombre || ""}
              renderInput={(p) => (
                <TextField
                  {...p}
                  label="Proveedor (opcional)"
                  InputProps={{
                    ...p.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <PersonSearchOutlined />
                        </InputAdornment>
                        {p.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={centros}
              value={
                centros.find(
                  (c) => c.id_centro_costo === form.id_centro_costo
                ) || null
              }
              onChange={(_, v) =>
                setForm((s) => ({
                  ...s,
                  id_centro_costo: v ? v.id_centro_costo : null,
                }))
              }
              getOptionLabel={(o) => o?.nombre || ""}
              renderInput={(p) => <TextField {...p} label="Centro de costo" />}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={TIPOS_DOCUMENTO}
              value={
                TIPOS_DOCUMENTO.find((o) => o.value === form.doc_tipo) || null
              }
              onChange={(_, v) =>
                setForm((s) => ({ ...s, doc_tipo: v ? v.value : null }))
              }
              isOptionEqualToValue={(o, v) => o.value === v.value}
              getOptionLabel={(o) => o?.label || ""}
              renderOption={(props, option) => {
                //eslint-disable-next-line
                const { key, ...liProps } = props;
                const Icon = option.icon;
                return (
                  <li key={key} {...liProps}>
                    {Icon ? (
                      <Icon fontSize="small" style={{ marginRight: 8 }} />
                    ) : null}
                    {option.label}
                  </li>
                );
              }}
              renderInput={(p) => (
                <TextField
                  {...p}
                  label="Doc. tipo"
                  placeholder="Selecciona…"
                  fullWidth
                />
              )}
              autoHighlight
              clearOnBlur={false}
              disableClearable={false}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Doc. folio"
              value={form.doc_folio || ""}
              onChange={onChange("doc_folio")}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Monto neto"
              type="number"
              value={form.monto_neto}
              onChange={onChange("monto_neto")}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="IVA"
              type="number"
              value={form.iva}
              onChange={onChange("iva")}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Total"
              type="number"
              value={form.total}
              onChange={onChange("total")}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Descripción / notas"
              value={form.descripcion}
              onChange={onChange("descripcion")}
              fullWidth
              multiline
              minRows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<CloseOutlined />}
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveOutlined />}
                onClick={onSave}
                disabled={saving}
              >
                Guardar cambios
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

GastoEditForm.propTypes = {
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  categorias: PropTypes.array.isRequired,
  proveedores: PropTypes.array.isRequired,
  centros: PropTypes.array.isRequired,
  provIsFetching: PropTypes.bool,
  onProvOpen: PropTypes.func.isRequired,
  onProvSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};
