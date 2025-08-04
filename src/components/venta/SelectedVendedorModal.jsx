import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Autocomplete,
  TextField,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";
import { ListboxComponent } from "./ListboxComponent";


const SelectVendedorModal = ({
  open,
  onClose,
  vendedores,
  selectedVendedor,
  onSelect,
  esAdministrador,
}) => {
  console.log(vendedores);
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (selectedVendedor || esAdministrador) onClose();
      }}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
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
          sx={{
            marginBottom: "10px",
            fontSize: "1.1rem",
            textAlign: "center",
            mt: 2,
          }}
        >
          Elige un vendedor para continuar con el proceso.
        </Typography>

        <Box
          sx={{
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <Autocomplete
            options={vendedores || []}
            getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar vendedor"
                variant="outlined"
                fullWidth
              />
            )}
            onChange={(event, value) => {
              if (value) onSelect(value.rut);
            }}
            isOptionEqualToValue={(option, value) => option.rut === value.rut}
            sx={{
              mt: 1,
              borderRadius: "8px",
            }}
            ListboxComponent={ListboxComponent}
            renderOption={(props, option) => {
              // eslint-disable-next-line
              const { key, ...rest } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  {...rest}
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderBottom: "1px solid #eaeaea",
                    transition: "background-color 0.2s ease-in-out",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      <Typography fontWeight="500" fontSize="0.95rem">
                        {option.nombre} {option.apellido}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Rol: {option?.rol?.nombre || "Sin rol"}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              );
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          padding: "16px",
        }}
      ></DialogActions>
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
  esAdministrador: PropTypes.bool,
};

export default SelectVendedorModal;
