import PropTypes from "prop-types";
import {
  Box,
  Button,
  Typography,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Switch,
  FormControlLabel,
  useTheme,
  Grid,
} from "@mui/material";
import BackButton from "../../components/common/BackButton";

const Edition = ({
  handleSubmit,
  handleChange,
  formData,
  tipos,
  navigate,
  isUpdating,
  imagePreview,
}) => {
  const theme = useTheme();

  // Helpers para renderizar campos, siguiendo el patrón del otro ejemplo
  const renderTextField = (
    label,
    name,
    type = "text",
    multiline = false,
    rows = 1
  ) => (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={formData[name] || ""}
      onChange={handleChange}
      multiline={multiline}
      rows={rows}
      variant="outlined"
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.paper
              : theme.palette.background.default,
          "& fieldset": {
            borderColor: theme.palette.divider,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}22`,
          },
          transition: "border-color 0.3s, box-shadow 0.3s",
        },
        "& input, & textarea": {
          padding: "12px",
        },
      }}
      aria-label={label}
    />
  );

  // Switch field (¿Es para venta?)
  const renderSwitchField = (label, name) => (
    <FormControlLabel
      control={
        <Switch
          checked={Boolean(formData[name])}
          onChange={handleChange}
          name={name}
          color="primary"
          sx={{
            "& .MuiSwitch-thumb": {
              boxShadow: theme.shadows[2],
            },
          }}
        />
      }
      label={label}
      sx={{ mb: 2 }}
    />
  );

  // Select field
  const renderSelectField = (label, name, options) => (
    <FormControl
      fullWidth
      variant="outlined"
      sx={{
        mb: 2,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[50]
            : theme.palette.grey[900],
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          transition: "box-shadow 0.3s",
          "& fieldset": {
            borderColor: theme.palette.divider,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            boxShadow: theme.shadows[4],
          },
        },
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        label={label}
        required
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  // Opciones para tipos de insumo
  const tipoOptions = tipos
    ? tipos.map((tipo) => ({
        value: tipo.id_tipo_insumo,
        label: tipo.nombre_tipo,
      }))
    : [];

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        py: 5,
        px: 3,
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" },
        gap: 4,
      }}
    >
      {/* Imagen del Insumo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
          borderRadius: 2,
          height: "350px",
        }}
      >
        <img
          src={imagePreview}
          alt="Vista Previa"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            borderRadius: "12px",
          }}
        />
      </Box>

      {/* Formulario */}
      <Box>
        <BackButton to="/insumos" label="Volver" />

        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Editar Insumo
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Información General
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {renderTextField("Nombre del Insumo", "nombre_insumo")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTextField("Código de Barra", "codigo_barra")}
            </Grid>
            <Grid item xs={12}>
              {renderTextField("Descripción", "descripcion", "text", true, 4)}
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Detalles del Insumo
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {renderTextField("Precio", "precio", "number")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTextField("Stock Disponible", "stock", "number")}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderSelectField(
                "Tipo de Insumo",
                "id_tipo_insumo",
                tipoOptions
              )}
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Opciones de Insumo
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {renderSwitchField("¿Es para venta?", "es_para_venta")}
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Imagen del Insumo
          </Typography>
          {renderTextField("URL de la Imagen", "image_url")}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/insumos")}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={isUpdating}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              {isUpdating ? <CircularProgress size={24} /> : "Guardar Cambios"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

Edition.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  tipos: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  imagePreview: PropTypes.string.isRequired,
};

export default Edition;
