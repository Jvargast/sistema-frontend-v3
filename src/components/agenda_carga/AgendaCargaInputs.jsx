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
}) => {
  return (
    <>
      <Grid item xs={12} sm={6}>
        <Box sx={circleNumberStyles}>1</Box>
        <FormControl fullWidth required sx={{ minWidth: 200, mt: 1 }}>
          <InputLabel id="chofer-label">Chofer</InputLabel>
          <Select
            labelId="chofer-label"
            value={idChofer}
            label="Chofer"
            onChange={(e) => setIdChofer(e.target.value)}
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
            {choferes?.map((chofer) => (
              <MenuItem key={chofer.rut} value={chofer.rut}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${chofer.nombre} ${chofer.apellido}`}
                  secondary={`RUT: ${chofer.rut}`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            {camiones?.map((camion) => (
              <MenuItem key={camion.id_camion} value={camion.id_camion}>
                <ListItemIcon>
                  <DirectionsCarIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`ID: ${camion.id_camion} - ${camion.placa}`}
                  secondary={`Capacidad: ${camion.capacidad} espacios`}
                />
              </MenuItem>
            ))}
          </Select>
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

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={descargarRetornables}
              onChange={(e) => setDescargarRetornables(e.target.checked)}
              color="primary"
            />
          }
          label="Descargar retornables antes de cargar"
          sx={{ mt: 1 }}
        />
      </Grid>
    </>
  );
};

AgendaCargaFormInputs.propTypes = {
  choferes: PropTypes.array.isRequired,
  camiones: PropTypes.array.isRequired,
  idChofer: PropTypes.string.isRequired,
  setIdChofer: PropTypes.func.isRequired,
  idCamion: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired, // 🔹 Ahora acepta "" y números
  setIdCamion: PropTypes.func.isRequired,
  prioridad: PropTypes.string.isRequired,
  setPrioridad: PropTypes.func.isRequired,
  notas: PropTypes.string.isRequired,
  setNotas: PropTypes.func.isRequired,
  descargarRetornables: PropTypes.bool.isRequired,
  setDescargarRetornables: PropTypes.func.isRequired,
};

export default AgendaCargaFormInputs;
