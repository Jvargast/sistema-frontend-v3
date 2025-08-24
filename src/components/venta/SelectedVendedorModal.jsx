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
import { useMemo } from "react";

const SelectVendedorModal = ({
  open,
  onClose,
  vendedores,
  selectedVendedor,
  onSelect,
}) => {
  const selectedOption = useMemo(
    () => vendedores.find((v) => v.rut === selectedVendedor) || null,
    [vendedores, selectedVendedor]
  );
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
      }}
      disableEscapeKeyDown
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
          {vendedores.length === 0 ? (
            <Typography align="center" color="text.secondary" fontSize={16}>
              No hay vendedores/usuarios con caja disponibles en esta sucursal.
            </Typography>
          ) : (
            <Autocomplete
              value={selectedOption}
              disableClearable
              options={vendedores}
              getOptionLabel={(option) =>
                option?.nombre && option?.apellido
                  ? `${option.nombre} ${option.apellido}`
                  : option?.nombre || option?.apellido || ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar vendedor"
                  variant="outlined"
                  fullWidth
                />
              )}
              onChange={(_, value) => {
                if (!value) return;
                onSelect?.(value.rut);
                onClose?.();
              }}
              isOptionEqualToValue={(option, value) => option.rut === value.rut}
              sx={{
                mt: 1,
                borderRadius: "8px",
              }}
              ListboxComponent={ListboxComponent}
              renderOption={(props, option) => {
                //eslint-disable-next-line
                const { key, ...rest } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    {...rest}
                    sx={{
                      px: 2,
                      py: 1,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box>
                        <Typography fontWeight={500} fontSize="0.95rem">
                          {option.nombre} {option.apellido}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Rol: {option?.rol?.nombre || option.rol || "Sin rol"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                );
              }}
            />
          )}
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
