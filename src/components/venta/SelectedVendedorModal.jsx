import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";

const SelectVendedorModal = ({
  open,
  onClose,
  vendedores,
  selectedVendedor,
  onSelect,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (selectedVendedor) onClose();
      }}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#F9FAFB",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          background: "linear-gradient(90deg, #4A90E2, #0052D4)",
          color: "white",
          padding: "16px",
          borderRadius: "10px 10px 0 0",
        }}
      >
        Seleccionar Vendedor
      </DialogTitle>

      <DialogContent>
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ marginBottom: "10px", fontSize: "1.1rem", textAlign: "center" }}
        >
          Elige un vendedor para continuar con el proceso.
        </Typography>

        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Select
            fullWidth
            value={selectedVendedor || ""}
            onChange={(event) => {
              const selectedRut = event.target.value;
              onSelect(selectedRut);
            }}
            displayEmpty
            sx={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              padding: "12px",
              backgroundColor: "#F3F4F6",
              borderRadius: "8px",
            }}
          >
            <MenuItem value="" disabled>
              Selecciona un vendedor
            </MenuItem>
            {vendedores?.map((vendedor) => (
              <MenuItem key={vendedor.rut} value={vendedor.rut}>
                <Typography fontSize="1.1rem">
                  {vendedor.nombre} {vendedor.apellido} - {vendedor.email}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          padding: "16px",
        }}
      >
      </DialogActions>
    </Dialog>
  );
};

SelectVendedorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  vendedores: PropTypes.arrayOf(
    PropTypes.shape({
      rut: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedVendedor: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default SelectVendedorModal;
