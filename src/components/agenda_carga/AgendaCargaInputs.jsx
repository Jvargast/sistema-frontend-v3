import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Box,
  InputAdornment,
  FormHelperText,
  FormGroup,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import PropTypes from "prop-types";

const circleNumberStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: "primary.main",
  color: "#fff",
  fontSize: 14,
  fontWeight: "bold",
  mr: 1,
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
}) => {
  return (
    <>

      <Grid item xs={12} sm={6}>
        <Box sx={circleNumberStyles}>1</Box>
        {isChofer ? (
          <TextField
            label="Chofer"
            size="small"
            value={`${choferDisplay?.nombre ?? "Mi usuario"} — RUT: ${
              choferDisplay?.rut ?? idChofer
            }`}
            fullWidth
            sx={{ mt: 1 }}
            helperText="Tus datos se completan automáticamente y no se pueden editar."
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <FormControl fullWidth required sx={{ minWidth: 200, mt: 1 }}>
            <InputLabel id="chofer-label">Chofer</InputLabel>
            <Select
              labelId="chofer-label"
              value={idChofer}
              label="Chofer"
              onChange={(e) => setIdChofer(e.target.value)}
              size="small"
              sx={(theme) => ({
                bgcolor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : "#fff",
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[100]
                    : theme.palette.text.primary,
                borderRadius: 1,
              })}
            >
              <MenuItem value="">
                <ListItemText primary="-- Selecciona Chofer --" />
              </MenuItem>
              {choferes?.map((chofer) => {
                const nombre = `${chofer.nombre ?? chofer.nombres ?? ""} ${
                  chofer.apellido ?? chofer.apellidos ?? ""
                }`.trim();
                return (
                  <MenuItem key={chofer.rut} value={chofer.rut}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={nombre || `RUT: ${chofer.rut}`}
                      secondary={`RUT: ${chofer.rut}`}
                    />
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>
              Selecciona el chofer responsable de esta carga.
            </FormHelperText>
          </FormControl>
        )}
      </Grid>


      <Grid item xs={12} sm={6}>
        <Box sx={circleNumberStyles}>2</Box>
        <FormControl fullWidth required sx={{ minWidth: 200, mt: 1 }}>
          <InputLabel id="camion-label">Camión</InputLabel>
          <Select
            labelId="camion-label"
            value={idCamion}
            label="Camión"
            onChange={(e) => setIdCamion(e.target.value)}
            size="small"
            sx={(theme) => ({
              bgcolor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : "#fff",
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[100]
                  : theme.palette.text.primary,
              borderRadius: 1,
            })}
          >
            <MenuItem value="">
              <ListItemText primary="-- Selecciona Camión --" />
            </MenuItem>
            {camiones?.map((camion) => {
              const estaBloqueado = camion.tieneAgenda;
              return (
                <MenuItem
                  key={camion.id_camion}
                  value={camion.id_camion}
                  disabled={false}
                  sx={{
                    color: estaBloqueado ? "error.main" : "inherit",
                    fontWeight: estaBloqueado ? "bold" : "normal",
                  }}
                >
                  <ListItemIcon>
                    <DirectionsCarIcon
                      sx={{ color: estaBloqueado ? "error.main" : "inherit" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={`ID: ${camion.id_camion} - ${camion.placa}`}
                    secondary={
                      estaBloqueado
                        ? "🚫 Ya tiene agenda asignada"
                        : `Capacidad: ${camion.capacidad} espacios`
                    }
                  />
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText>
            El camión debe pertenecer a la sucursal seleccionada y no estar en
            ruta. Los que aparecen con 🚫 ya tienen agenda hoy.
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={circleNumberStyles}>3</Box>
        <FormControl fullWidth required sx={{ minWidth: 200, mt: 1 }}>
          <InputLabel id="prioridad-label">Prioridad</InputLabel>
          <Select
            labelId="prioridad-label"
            value={prioridad}
            label="Prioridad"
            onChange={(e) => setPrioridad(e.target.value)}
            size="small"
            sx={(theme) => ({
              bgcolor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : "#fff",
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[100]
                  : theme.palette.text.primary,
              borderRadius: 1,
            })}
          >
            <MenuItem value="Baja">Baja</MenuItem>
            <MenuItem value="Media">Media</MenuItem>
            <MenuItem value="Alta">Alta</MenuItem>
          </Select>
          <FormHelperText>
            Define la urgencia para planificar la preparación de la carga.
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={circleNumberStyles}>4</Box>
        <TextField
          label="Notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          size="small"
          helperText="Información adicional para bodega / planificación (opcional)."
          sx={(theme) => ({
            bgcolor:
              theme.palette.mode === "dark" ? theme.palette.grey[900] : "#fff",
            color:
              theme.palette.mode === "dark"
                ? theme.palette.grey[100]
                : theme.palette.text.primary,
            borderRadius: 1,
            mt: 1,
            "& .MuiInputBase-root": {
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[100]
                  : theme.palette.text.primary,
            },
          })}
        />
      </Grid>

      {/* 5) Checkbox con ayuda */}
      <Grid item xs={12}>
        <FormControl component="fieldset" sx={{ mt: 1 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={descargarRetornables}
                  onChange={(e) => setDescargarRetornables(e.target.checked)}
                  color="primary"
                />
              }
              label="Descargar retornables antes de cargar"
            />
          </FormGroup>
          <FormHelperText>
            Marca esta opción si el camión debe descargar envases/retorno antes
            de iniciar la nueva carga.
          </FormHelperText>
        </FormControl>
      </Grid>
    </>
  );
};

AgendaCargaFormInputs.propTypes = {
  isChofer: PropTypes.bool,
  choferes: PropTypes.array.isRequired,
  camiones: PropTypes.array.isRequired,
  idChofer: PropTypes.string.isRequired,
  setIdChofer: PropTypes.func.isRequired,
  idCamion: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  setIdCamion: PropTypes.func.isRequired,
  prioridad: PropTypes.string.isRequired,
  setPrioridad: PropTypes.func.isRequired,
  notas: PropTypes.string.isRequired,
  setNotas: PropTypes.func.isRequired,
  descargarRetornables: PropTypes.bool.isRequired,
  setDescargarRetornables: PropTypes.func.isRequired,
  choferDisplay: PropTypes.shape({
    nombre: PropTypes.string,
    rut: PropTypes.string,
  }),
};

export default AgendaCargaFormInputs;
