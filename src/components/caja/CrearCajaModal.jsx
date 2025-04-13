import { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Backdrop,
  Fade,
} from "@mui/material";
import { useCreateCajaMutation } from "../../store/services/cajaApi";
import { useGetAllSucursalsQuery } from "../../store/services/empresaApi";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CrearCajaModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [idSucursal, setIdSucursal] = useState("");
  const [createCaja, { isLoading }] = useCreateCajaMutation();
  const {
    data: sucursales,
    isLoading: loadingSucursales,
    error,
  } = useGetAllSucursalsQuery();

  const handleCrearCaja = async () => {
    if (!idSucursal) {
      alert("Seleccione una sucursal");
      return;
    }

    try {
      await createCaja({ id_sucursal: idSucursal });
      dispatch(
        showNotification({
          message: "Caja creada con éxito",
          severity: "success",
        })
      );
      onClose();
    } catch (error) {
      console.log(error);
      dispatch(
        showNotification({
          message: `Error al crear la caja ${error}`,
          severity: "error",
        })
      );
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={true}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Crear Nueva Caja
          </Typography>

          {/* Seleccionar Sucursal */}
          <FormControl
            fullWidth
            sx={{ mb: 2 }}
            disabled={loadingSucursales || error}
          >
            <InputLabel htmlFor="sucursal-select">
              Seleccionar Sucursal
            </InputLabel>
            <Select
              id="sucursal-select"
              labelId="sucursal-label"
              label="sucursal-label"
              name="sucursal"
              value={idSucursal}
              onChange={(e) => setIdSucursal(e.target.value)}
              defaultValue=""
            >
              {loadingSucursales ? (
                <MenuItem disabled>Cargando sucursales...</MenuItem>
              ) : error ? (
                <MenuItem disabled>Error al cargar sucursales</MenuItem>
              ) : sucursales?.length > 0 ? (
                sucursales.map((sucursal) => (
                  <MenuItem
                    key={sucursal.id_sucursal}
                    value={sucursal.id_sucursal}
                  >
                    {sucursal.nombre} - {sucursal.direccion}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No hay sucursales disponibles</MenuItem>
              )}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              width: "100%",
              "&:hover": {
                backgroundColor: "#388E3C",
              },
            }}
            onClick={handleCrearCaja}
            disabled={isLoading || !idSucursal}
          >
            {isLoading ? "Creando..." : "Crear Caja"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

CrearCajaModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CrearCajaModal;
