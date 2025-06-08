import { Box, Typography, Switch, Divider, Button } from "@mui/material";
import PropTypes from "prop-types";

const SecuritySettings = ({ settings, onUpdate }) => {
  return (
    <Box
      sx={{
        width: "100%",
        padding: 3,
        borderRadius: "12px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
        Configuraciones de Seguridad
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="body1">
          Autenticación de Dos Factores (2FA)
        </Typography>
        <Switch
          color="primary"
          checked={settings.twoFactorEnabled}
          onChange={(e) => onUpdate("twoFactorEnabled", e.target.checked)}
          disabled
        />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="body1">Bloqueo por intentos fallidos</Typography>
        <Switch
          color="primary"
          checked={settings.lockoutEnabled}
          onChange={(e) => onUpdate("lockoutEnabled", e.target.checked)}
          disabled
        />
      </Box>
      <Divider sx={{ mb: 2 }} />

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
