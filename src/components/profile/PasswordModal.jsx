import Dialog from "../common/CompatDialog";
import { DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  primaryActionButtonSx,
  secondaryActionButtonSx,
} from "../common/actionStyles";
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const PasswordModal = ({ open, onClose, onSave }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });


  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    onSave(passwordData);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#0F172A",
          color: "white",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>

        <Typography variant="h6" fontWeight="bold">
          Cambiar Contraseña
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 4, py: 3 }}>
        {[
        { field: "currentPassword", label: "Contraseña Actual" },
        { field: "newPassword", label: "Nueva Contraseña" },
        { field: "confirmPassword", label: "Confirmar Contraseña" }].
        map(({ field, label }) =>
        <Box key={field} sx={{ mb: 3, mt: 3, position: "relative" }}>
            <TextField
            fullWidth
            label={label}
            name={field}
            type={showPasswords[field] ? "text" : "password"}
            value={passwordData[field]}
            onChange={handlePasswordChange}
            variant="outlined"
            InputLabelProps={{ style: { fontWeight: "bold" } }}
            sx={{ borderRadius: 1 }} />

            <IconButton
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)"
            }}
            onClick={() => togglePasswordVisibility(field)}>

              {showPasswords[field] ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: 4,
          py: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "grey.100",
        }}>

        <Button
          variant="outlined"
          onClick={onClose}
          sx={(theme) => secondaryActionButtonSx(theme, { px: 3 })}>

          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={(theme) => primaryActionButtonSx(theme, { px: 3 })}>

          Guardar
        </Button>
      </DialogActions>
    </Dialog>);

};
PasswordModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default PasswordModal;
