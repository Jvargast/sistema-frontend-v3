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
import { useIsMobile } from "../../utils/useIsMobile";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";

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
  const isMobile = useIsMobile();

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
          borderRadius: 2,
          height: "350px",
          p: isMobile ? 2 : 0,
          gap: isMobile ? 2 : 0,
        }}
      >
        {imagePreview ? (
          <a
            href={imagePreview}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", width: "100%" }}
            tabIndex={-1}
          >
            <img
              src={imagePreview}
              alt="Vista Previa"
              style={{
                maxHeight: "220px",
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: "12px",
                margin: "0 auto",
                transition: "box-shadow 0.3s",
                boxShadow: "0 2px 16px 0 #0001",
                cursor: "pointer",
                background: theme.palette.grey[isMobile ? 100 : 200],
              }}
              onError={(e) => {
                e.target.src = "";
              }}
            />
          </a>
        ) : (
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              boxShadow: "0 2px 12px 0 #0002",
            }}
          >
            <ImageNotSupportedOutlinedIcon
              sx={{ fontSize: 64, color: theme.palette.grey[400] }}
            />
          </Box>
        )}
        {isMobile && (
          <TextField
            fullWidth
            label="URL de la Imagen"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        )}
      </Box>

      <Box>
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

          {!isMobile && (
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.secondary, fontWeight: "bold" }}
            >
              Imagen del Insumo
            </Typography>
          )}
          {!isMobile && renderTextField("URL de la Imagen", "image_url")}

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
