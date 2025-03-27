import { Box, Typography, Switch, Divider, Button } from "@mui/material";
import PropTypes from "prop-types";

const SecuritySettings = ({ settings, onUpdate }) => {
  return (
    <Box
    sx={{
      maxWidth: "400px", // 📏 Ancho reducido
      width: "100%", // Adaptable en móviles
      padding: 3,
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
      margin: "0 auto", // Centrar en pantalla
    }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
        Configuraciones de Seguridad
      </Typography>

      {/* Opción: Autenticación de Dos Factores */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="body1">Autenticación de Dos Factores (2FA)</Typography>
        <Switch
          color="primary"
          checked={settings.twoFactorEnabled}
          onChange={(e) => onUpdate("twoFactorEnabled", e.target.checked)}
          disabled
        />
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Opción: Bloqueo por intentos fallidos */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="body1">Bloqueo por intentos fallidos</Typography>
        <Switch
          color="primary"
          checked={settings.lockoutEnabled}
          onChange={(e) => onUpdate("lockoutEnabled", e.target.checked)}
          disabled
        />
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Botón de Guardar */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#007AFF",
          fontSize: "1rem",
          fontWeight: "bold",
          padding: "10px",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#005BB5" },
        }}
        disabled
      >
        Guardar Cambios
      </Button>
    </Box>
  );
};

SecuritySettings.propTypes = {
  settings: PropTypes.shape({
    twoFactorEnabled: PropTypes.bool.isRequired,
    lockoutEnabled: PropTypes.bool.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default SecuritySettings;
