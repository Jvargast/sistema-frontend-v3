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
  IconButton,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDropzone } from "react-dropzone";
import { getImageUrl } from "../../store/services/apiBase";

const Edition = ({
  handleSubmit,
  handleChange,
  formData,
  setFormData,
  tipos,
  navigate,
  isUpdating,
  imagePreview,
  setImagePreview,
  onRemoveImage,
}) => {
  const theme = useTheme();

  const maxSize = 5 * 1024 * 1024;
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: { "image/*": [] },
      maxFiles: 1,
      maxSize,
      onDrop: (accepted) => {
        if (accepted && accepted[0]) {
          setFormData((prev) => ({ ...prev, imageFile: accepted[0] }));
          setImagePreview(URL.createObjectURL(accepted[0]));
        }
      },
    });
  const fileError = fileRejections.length > 0;

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
      value={formData[name] ?? ""}
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
          "& fieldset": { borderColor: theme.palette.divider },
          "&:hover fieldset": { borderColor: theme.palette.primary.main },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}22`,
          },
          transition: "border-color 0.3s, box-shadow 0.3s",
        },
        "& input, & textarea": { padding: "12px" },
      }}
      aria-label={label}
    />
  );

  const renderSwitchField = (label, name) => (
    <FormControlLabel
      control={
        <Switch
          checked={Boolean(formData[name])}
          onChange={handleChange}
          name={name}
          color="primary"
          sx={{ "& .MuiSwitch-thumb": { boxShadow: theme.shadows[2] } }}
        />
      }
      label={label}
      sx={{ mb: 2 }}
    />
  );

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
          "& fieldset": { borderColor: theme.palette.divider },
          "&:hover fieldset": { borderColor: theme.palette.primary.main },
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
        value={formData[name] ?? ""}
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

  const tipoOptions =
    tipos?.map((t) => ({ value: t.id_tipo_insumo, label: t.nombre_tipo })) ??
    [];

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        py: 5,
        px: 3,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Editar Insumo
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
      >
        <Grid container spacing={2} alignItems="flex-start">
          {/* Columna principal */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", fontWeight: "bold", mb: 1 }}
            >
              Información General
            </Typography>
            {renderTextField("Nombre del Insumo", "nombre_insumo")}
            {renderTextField("Código de Barra", "codigo_barra")}
            {renderTextField("Descripción", "descripcion", "text", true, 4)}

            <Typography
              variant="h6"
              sx={{ color: "text.secondary", fontWeight: "bold", mt: 2 }}
            >
              Detalles del Insumo
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {renderTextField("Precio", "precio", "number")}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderTextField("Unidad de Medida", "unidad_de_medida")}
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
              sx={{ color: "text.secondary", fontWeight: "bold", mt: 2 }}
            >
              Opciones de Insumo
            </Typography>
            {renderSwitchField("¿Es para venta?", "es_para_venta")}
          </Grid>

          {/* Columna imagen */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Imagen del Insumo
            </Typography>

            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed",
                borderColor: fileError ? "error.main" : "grey.400",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                background: isDragActive ? "grey.100" : "background.paper",
                cursor: "pointer",
                mb: 2,
                outline: "none",
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <input {...getInputProps()} />
              <ImageOutlinedIcon sx={{ fontSize: 40, color: "grey.400" }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {isDragActive
                  ? "Suelta aquí tu imagen..."
                  : "Arrastra una imagen o haz clic para seleccionar"}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                JPG/PNG — Máx. 5MB
              </Typography>
              {fileError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Archivo no permitido o demasiado grande.
                </Typography>
              )}
            </Box>

            {imagePreview ? (
              <Box
                sx={{
                  mt: 1,
                  width: "100%",
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  borderRadius: 2,
                  background:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[50]
                      : theme.palette.grey[900],
                  boxShadow: theme.shadows[1],
                  p: 1,
                  position: "relative",
                }}
              >
                <img
                  src={getImageUrl(imagePreview)}
                  alt="Vista previa"
                  style={{
                    width: "100%",
                    maxHeight: 220,
                    objectFit: "contain",
                    borderRadius: 12,
                    boxShadow: "0 2px 16px 0 #0001",
                  }}
                />
                {(formData.imageFile || formData.image_url) && (
                  <IconButton
                    onClick={onRemoveImage}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "#fff",
                      boxShadow: 1,
                      "&:hover": { background: theme.palette.error.light },
                      zIndex: 10,
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" color="error" />
                  </IconButton>
                )}
              </Box>
            ) : null}

            {/* URL alternativa */}
            <TextField
              fullWidth
              label="URL de la Imagen (opcional)"
              name="image_url"
              value={formData.image_url ?? ""}
              onChange={handleChange}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>

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
  );
};

Edition.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  tipos: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  imagePreview: PropTypes.string.isRequired,
  setImagePreview: PropTypes.func.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
};

export default Edition;
