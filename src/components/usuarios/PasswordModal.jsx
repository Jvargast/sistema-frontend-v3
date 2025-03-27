import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PropTypes from "prop-types";

const PasswordModal = ({ open, onClose, onSave }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    if (password.trim() === "") return;
    console.log("Contraseña enviada:", password); 
    onSave(password);
    setPassword(""); 
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          textAlign: "center",
          py: 2,
          background: "linear-gradient(90deg, #4A90E2 0%, #6A5ACD 100%)",
        }}
      >
        <Typography variant="h5" fontWeight="bold">Cambiar Contraseña</Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Typography variant="body1" sx={{ mb: 2, color: "#666" }} component="label" htmlFor="password-field">
          Introduce tu nueva contraseña.
        </Typography>
        <TextField
          fullWidth
          id="password-field"
          margin="dense"
          label="Nueva Contraseña"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              transition: "0.3s",
              "&:hover fieldset": { borderColor: "#3498db" },
              "&.Mui-focused fieldset": { borderColor: "#2980b9" },
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: "#e74c3c",
            color: "#c0392b",
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1,
            "&:hover": { backgroundColor: "#fdecea" },
          }}
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#3498db",
            color: "#fff",
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1,
            "&:hover": { backgroundColor: "#2980b9" },
          }}
          onClick={handleSave}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PasswordModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default PasswordModal;
