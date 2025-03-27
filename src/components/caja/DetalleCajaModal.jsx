import {
    Box,
    Typography,
    Modal,
    Backdrop,
    Fade,
    CircularProgress,
    Button,
    Divider,
  } from "@mui/material";
  import { Close, AccountBalance, DateRange, AttachMoney, Person } from "@mui/icons-material";
  import PropTypes from "prop-types";
  import { useGetCajaByIdQuery } from "../../store/services/cajaApi";
  
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 480,
    bgcolor: "background.paper",
    p: 4,
    borderRadius: 3,
    boxShadow: 24,
  };
  
  const DetalleCajaModal = ({ idCaja, onClose }) => {
    const { data: caja, isLoading, error } = useGetCajaByIdQuery(idCaja);
  
    // Función para formatear fechas y manejar valores nulos
    const formatFecha = (fecha) => {
      return fecha ? new Date(fecha).toLocaleString() : "No disponible";
    };
  
    return (
      <Modal
        open={!!idCaja}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={!!idCaja}>
          <Box sx={modalStyle}>
            {/* Botón de cierre */}
            <Button
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                minWidth: "32px",
                borderRadius: "50%",
                color: "#333",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
              }}
            >
              <Close />
            </Button>
  
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">Error al cargar los detalles.</Typography>
            ) : (
              <>
                <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
                  Detalles de Caja #{caja.id_caja}
                </Typography>
  
                <Divider sx={{ mb: 2 }} />
  
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {/* Sucursal */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccountBalance sx={{ color: "#0288d1" }} />
                    <Typography variant="body1">
                      <strong>Sucursal:</strong> {caja.sucursal.nombre}
                    </Typography>
                  </Box>
  
                  {/* Estado */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <DateRange sx={{ color: caja.estado === "abierta" ? "#4CAF50" : "#F44336" }} />
                    <Typography variant="body1">
                      <strong>Estado:</strong> {caja.estado}
                    </Typography>
                  </Box>
  
                  {/* Saldos */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <AttachMoney sx={{ color: "#ff9800" }} />
                    <Typography variant="body1">
                      <strong>Saldo Inicial:</strong> ${caja.saldo_inicial}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AttachMoney sx={{ color: "#ff9800" }} />
                    <Typography variant="body1">
                      <strong>Saldo Final:</strong> ${caja.saldo_final || "0"}
                    </Typography>
                  </Box>
  
                  {/* Fechas */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <DateRange sx={{ color: "#9C27B0" }} />
                    <Typography variant="body1">
                      <strong>Fecha Apertura:</strong> {formatFecha(caja.fecha_apertura)}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <DateRange sx={{ color: "#9C27B0" }} />
                    <Typography variant="body1">
                      <strong>Fecha Cierre:</strong> {formatFecha(caja.fecha_cierre)}
                    </Typography>
                  </Box>
  
                  {/* Usuarios */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person sx={{ color: "#673AB7" }} />
                    <Typography variant="body1">
                      <strong>Usuario Apertura:</strong> {caja.usuario_apertura || "No asignado"}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person sx={{ color: "#673AB7" }} />
                    <Typography variant="body1">
                      <strong>Usuario Cierre:</strong> {caja.usuario_cierre || "No asignado"}
                    </Typography>
                  </Box>
  
                  {/* Dirección y Teléfono */}
                  <Box display="flex" flexDirection="column" mt={2}>
                    <Typography variant="body2">
                      <strong>Dirección Sucursal:</strong> {caja.sucursal.direccion}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Teléfono Sucursal:</strong> {caja.sucursal.telefono}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    );
  };
  
  DetalleCajaModal.propTypes = {
    idCaja: PropTypes.number,
    onClose: PropTypes.func.isRequired,
  };
  
  export default DetalleCajaModal;
  