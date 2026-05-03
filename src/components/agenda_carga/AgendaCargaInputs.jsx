import Select from "../common/CompatSelect";
import { FormControl, InputLabel, MenuItem, FormControlLabel, Checkbox, ListItemIcon, ListItemText, InputAdornment, FormHelperText, FormGroup } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import PropTypes from "prop-types";
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";
import Grid from "../common/CompatGrid";
import Typography from "../common/CompatTypography";

const stepBadgeStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 26,
  borderRadius: 1,
  backgroundColor: "primary.main",
  color: "#fff",
  fontSize: 13,
  fontWeight: 800,
  flex: "0 0 auto"
};

const fieldInputSx = (theme) => ({
  bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[900] : "#fff",
  color:
  theme.palette.mode === "dark" ?
  theme.palette.grey[100] :
  theme.palette.text.primary,
  borderRadius: 1,
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    minHeight: 24
  }
});

const menuItemSx = {
  alignItems: "center",
  minHeight: 48,
  py: 0.75
};

const listItemIconSx = {
  minWidth: 34,
  display: "flex",
  alignItems: "center"
};

const listItemTextProps = {
  sx: { m: 0 },
  primaryTypographyProps: {
    noWrap: true,
    sx: { lineHeight: 1.25, fontWeight: 700 }
  },
  secondaryTypographyProps: {
    noWrap: true,
    sx: { lineHeight: 1.2 }
  }
};

const FieldShell = ({ step, title, children }) =>
  <Box display="flex" flexDirection="column" gap={1}>
    <Box display="flex" alignItems="center" gap={1}>
      <Box sx={stepBadgeStyles}>{step}</Box>
      <Typography variant="subtitle2" fontWeight={800}>
        {title}
      </Typography>
    </Box>
    {children}
  </Box>;

FieldShell.propTypes = {
  step: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

const AgendaCargaFormInputs = ({
  isChofer,
  choferes,
  camiones,
  idChofer,
  setIdChofer,
  idCamion,
  setIdCamion,
  prioridad,
  setPrioridad,
  notas,
  setNotas,
  descargarRetornables,
  setDescargarRetornables,
  choferDisplay,
  disableChofer = false,
  disableCamion = false,
  disableCargaFields = false
}) => {
  const choferSeleccionado = choferes?.find(
    (chofer) => String(chofer.rut) === String(idChofer)
  );
  const choferSeleccionadoNombre = `${choferSeleccionado?.nombre ?? choferSeleccionado?.nombres ?? ""} ${
  choferSeleccionado?.apellido ?? choferSeleccionado?.apellidos ?? ""}`.
  trim();

  const camionSeleccionado = camiones?.find(
    (camion) => Number(camion.id_camion) === Number(idCamion)
  );

  const renderSelectValue = ({ icon, primary, secondary }) =>
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      minWidth={0}
      sx={{ lineHeight: 1.2 }}>

      {icon}
      <Typography variant="body2" fontWeight={800} noWrap sx={{ lineHeight: 1.2 }}>
        {primary}
        {secondary ? ` · ${secondary}` : ""}
      </Typography>
    </Box>;

  return (
    <>
      <Grid item xs={12} sm={6}>
        <FieldShell step={1} title="Chofer">
          {isChofer ?
          <TextField
            label="Chofer"
            size="small"
            value={`${choferDisplay?.nombre ?? "Mi usuario"} - RUT: ${
            choferDisplay?.rut ?? idChofer}`
            }
            fullWidth
            disabled={disableChofer}
            helperText="Tus datos se completan automáticamente y no se pueden editar."
            InputProps={{
              readOnly: true,
              startAdornment:
              <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>

            }} /> :

          <FormControl fullWidth required disabled={disableChofer} sx={{ minWidth: 200 }}>
              <InputLabel id="chofer-label">Chofer</InputLabel>
              <Select
              labelId="chofer-label"
              value={idChofer}
              label="Chofer"
              onChange={(e) => setIdChofer(e.target.value)}
              size="small"
              disabled={disableChofer}
              sx={fieldInputSx}
              renderValue={() =>
              renderSelectValue({
                icon: <PersonIcon fontSize="small" sx={{ flex: "0 0 auto" }} />,
                primary: choferSeleccionadoNombre || `RUT: ${idChofer}`,
                secondary: `RUT: ${idChofer}`
              })
              }>

                <MenuItem value="" sx={menuItemSx}>
                  <ListItemText primary="-- Selecciona Chofer --" {...listItemTextProps} />
                </MenuItem>
                {choferes?.map((chofer) => {
                const nombre = `${chofer.nombre ?? chofer.nombres ?? ""} ${
                chofer.apellido ?? chofer.apellidos ?? ""}`.
                trim();
                return (
                  <MenuItem key={chofer.rut} value={chofer.rut} sx={menuItemSx}>
                      <ListItemIcon sx={listItemIconSx}>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText
                      primary={nombre || `RUT: ${chofer.rut}`}
                      secondary={`RUT: ${chofer.rut}`}
                      {...listItemTextProps} />

                    </MenuItem>);

              })}
              </Select>
              <FormHelperText>
                Selecciona el chofer responsable de esta carga.
              </FormHelperText>
            </FormControl>
          }
        </FieldShell>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FieldShell step={2} title="Camión">
          <FormControl fullWidth required disabled={disableCamion} sx={{ minWidth: 200 }}>
            <InputLabel id="camion-label">Camión</InputLabel>
            <Select
              labelId="camion-label"
              value={idCamion}
              label="Camión"
              onChange={(e) => setIdCamion(e.target.value)}
              size="small"
              disabled={disableCamion}
              sx={fieldInputSx}
              renderValue={() =>
              renderSelectValue({
                icon: (
                  <DirectionsCarIcon
                    fontSize="small"
                    sx={{ color: "primary.main", flex: "0 0 auto" }} />
                ),
                primary: camionSeleccionado ?
                `ID: ${camionSeleccionado.id_camion} - ${camionSeleccionado.placa}` :
                "Camión",
                secondary: camionSeleccionado ?
                `Capacidad: ${camionSeleccionado.capacidad} espacios` :
                ""
              })
              }>

              <MenuItem value="" sx={menuItemSx}>
                <ListItemText primary="-- Selecciona Camión --" {...listItemTextProps} />
              </MenuItem>
              {camiones?.map((camion) => {
                const estaBloqueado = camion.tieneAgenda;
                return (
                  <MenuItem
                    key={camion.id_camion}
                    value={camion.id_camion}
                    disabled={false}
                    sx={{
                      ...menuItemSx,
                      color: estaBloqueado ? "error.main" : "inherit",
                      fontWeight: estaBloqueado ? "bold" : "normal"
                    }}>

                    <ListItemIcon sx={listItemIconSx}>
                      <DirectionsCarIcon
                        sx={{ color: estaBloqueado ? "error.main" : "inherit" }} />

                    </ListItemIcon>
                    <ListItemText
                      primary={`ID: ${camion.id_camion} - ${camion.placa}`}
                      secondary={
                      estaBloqueado ?
                      "Ya tiene agenda asignada" :
                      `Capacidad: ${camion.capacidad} espacios`
                      }
                      {...listItemTextProps} />

                  </MenuItem>);

              })}
            </Select>
            <FormHelperText>
              El camión debe pertenecer a la sucursal seleccionada y no estar en
              ruta. Los marcados ya tienen agenda hoy.
            </FormHelperText>
          </FormControl>
        </FieldShell>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FieldShell step={3} title="Prioridad">
          <FormControl
            fullWidth
            required
            disabled={disableCargaFields}
            sx={{ minWidth: 200 }}>
            <InputLabel id="prioridad-label">Prioridad</InputLabel>
            <Select
              labelId="prioridad-label"
              value={prioridad}
              label="Prioridad"
              onChange={(e) => setPrioridad(e.target.value)}
              size="small"
              disabled={disableCargaFields}
              sx={fieldInputSx}>

              <MenuItem value="Baja">Baja</MenuItem>
              <MenuItem value="Media">Media</MenuItem>
              <MenuItem value="Alta">Alta</MenuItem>
            </Select>
            <FormHelperText>
              Define la urgencia para planificar la preparación de la carga.
            </FormHelperText>
          </FormControl>
        </FieldShell>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FieldShell step={4} title="Notas">
          <TextField
            label="Notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            size="small"
            disabled={disableCargaFields}
            helperText="Información adicional para bodega / planificación (opcional)."
            sx={(theme) => ({
              bgcolor:
              theme.palette.mode === "dark" ? theme.palette.grey[900] : "#fff",
              color:
              theme.palette.mode === "dark" ?
              theme.palette.grey[100] :
              theme.palette.text.primary,
              borderRadius: 1,
              "& .MuiInputBase-root": {
                color:
                theme.palette.mode === "dark" ?
                theme.palette.grey[100] :
                theme.palette.text.primary
              }
            })} />
        </FieldShell>
      </Grid>

      <Grid item xs={12}>
        <FormControl
          component="fieldset"
          disabled={disableCargaFields}
          sx={(theme) => ({
            width: "100%",
            p: 1.5,
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor:
            theme.palette.mode === "dark" ?
            theme.palette.grey[900] :
            "#f8fafc"
          })}>

          <FormGroup>
            <FormControlLabel
              control={
              <Checkbox
                checked={descargarRetornables}
                onChange={(e) => setDescargarRetornables(e.target.checked)}
                disabled={disableCargaFields}
                color="primary" />

              }
              label="Descargar retornables antes de cargar" />

          </FormGroup>
          <FormHelperText sx={{ ml: 0 }}>
            Marca esta opción si el camión debe descargar envases/retorno antes
            de iniciar la nueva carga.
          </FormHelperText>
        </FormControl>
      </Grid>
    </>);

};

AgendaCargaFormInputs.propTypes = {
  isChofer: PropTypes.bool,
  choferes: PropTypes.array.isRequired,
  camiones: PropTypes.array.isRequired,
  idChofer: PropTypes.string.isRequired,
  setIdChofer: PropTypes.func.isRequired,
  idCamion: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).
  isRequired,
  setIdCamion: PropTypes.func.isRequired,
  prioridad: PropTypes.string.isRequired,
  setPrioridad: PropTypes.func.isRequired,
  notas: PropTypes.string.isRequired,
  setNotas: PropTypes.func.isRequired,
  descargarRetornables: PropTypes.bool.isRequired,
  setDescargarRetornables: PropTypes.func.isRequired,
  choferDisplay: PropTypes.shape({
    nombre: PropTypes.string,
    rut: PropTypes.string
  }),
  disableChofer: PropTypes.bool,
  disableCamion: PropTypes.bool,
  disableCargaFields: PropTypes.bool
};

export default AgendaCargaFormInputs;
