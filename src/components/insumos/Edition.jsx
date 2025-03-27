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
} from "@mui/material";

const Edition = ({
  handleSubmit,
  handleChange,
  formData,
  setFormData,
  tipos,
  navigate,
  isUpdating,
  imagePreview,
}) => {

  const formFields = [
    {
      label: "Nombre del Insumo",
      name: "nombre_insumo",
      type: "text",
      multiline: false,
      rows: 1,
    },
    {
      label: "Descripción",
      name: "descripcion",
      type: "text",
      multiline: true,
      rows: 3,
    },
    {
      label: "Código de Barra",
      name: "codigo_barra",
      type: "text",
      multiline: false,
      rows: 1,
    },
    {
      label: "Precio",
      name: "precio",
      type: "number",
      multiline: false,
      rows: 1,
    },
    {
      label: "Stock",
      name: "stock",
      type: "number",
      multiline: false,
      rows: 1,
    },
    {
      label: "URL de la Imagen",
      name: "image_url",
      type: "text",
      multiline: false,
      rows: 1,
    },
  ];

  return (
    <Box
      sx={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "auto",
        backgroundColor: "#f4f6f8",
        borderRadius: "10px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        gap: "2rem",
      }}
    >
      {/* Imagen del Insumo */}
      <Box
        sx={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Vista Previa
        </Typography>
        <Box
          sx={{
            width: "100%",
            maxWidth: "300px",
            height: "300px",
            backgroundColor: "#e0e0e0",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={imagePreview}
            alt="Vista Previa"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: "10px",
            }}
          />
        </Box>
      </Box>

      {/* Formulario */}
      <Box sx={{ flex: "2" }}>
        <Typography variant="h4" gutterBottom>
          Editar Insumo
        </Typography>
        <Divider sx={{ marginBottom: "2rem" }} />

        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <TextField
              key={field.name}
              id={`field-${field.name}`}
              label={field.label}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              fullWidth
              type={field.type}
              multiline={field.multiline}
              rows={field.rows}
              sx={{ marginBottom: "1.5rem" }}
            />
          ))}

          {/* Selector: Tipo de Insumo */}
          <FormControl fullWidth sx={{ marginBottom: "1.5rem" }}>
            <InputLabel id="tipo-insumo-label">Tipo de Insumo</InputLabel>
            <Select
              id="tipo-insumo-select"
              labelId="tipo-insumo-label"
              name="id_tipo_insumo"
              label="id_tipo_insumo"
              value={formData.id_tipo_insumo || ""}
              onChange={handleChange}
            >
              {tipos?.map((tipo) => (
                <MenuItem key={tipo.id_tipo_insumo} value={tipo.id_tipo_insumo}>
                  {tipo.nombre_tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Selector: ¿Es para venta? */}
          <FormControl fullWidth sx={{ marginBottom: "1.5rem" }}>
            <InputLabel id="es-para-venta-label">¿Es para venta?</InputLabel>
            <Select
              id="es-para-venta-select"
              labelId="es-para-venta-label"
              name="es-para-venta-label"
              label="es-para-venta-label"
              value={formData?.es_para_venta === true ? "true" : "false"} // Convierte el booleano a cadena
              onChange={(e) =>
                setFormData({
                  ...formData,
                  es_para_venta: e.target.value === "true", // Convierte la cadena de vuelta a booleano
                })
              }
            >
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>

          {/* Botones */}
          <Box display="flex" justifyContent="flex-end" gap="1.5rem" mt="2rem">
            <Button
              variant="outlined"
              onClick={() => navigate("/insumos")}
              sx={{
                color: "#f44336",
                borderColor: "#f44336",
                "&:hover": {
                  backgroundColor: "#f4433620",
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isUpdating}
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
  setFormData: PropTypes.func.isRequired,
  tipos: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  imagePreview: PropTypes.string.isRequired,
};

export default Edition;
