import { Box, Paper, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PropTypes from "prop-types";

const PermissionMessage = ({ requiredPermission }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        backgroundColor: "#ffebee", 
        borderRadius: 2,
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ mr: 2, fontSize: 32 }} />
      <Box>
        <Typography variant="h6" color="error" sx={{ fontWeight: "bold" }}>
          Permiso requerido
        </Typography>
        <Typography variant="body1">
          Necesitas el permiso <strong>{requiredPermission}</strong> para acceder
          a esta sección.
        </Typography>
      </Box>
    </Paper>
  );
};
PermissionMessage.propTypes = {
  requiredPermission: PropTypes.string.isRequired,
};

export default PermissionMessage;
