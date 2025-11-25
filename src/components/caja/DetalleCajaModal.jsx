import {
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
  CircularProgress,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import {
  Close,
  AccountBalance,
  DateRange,
  AttachMoney,
  Person,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import {
  useCloseCajaMutation,
  useGetCajaByIdQuery,
  useOpenCajaMutation,
  useUpdateCajaMutation,
} from "../../store/services/cajaApi";
import { useEffect, useState } from "react";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useDispatch } from "react-redux";
import AlertDialog from "../common/AlertDialog";

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
  const dispatch = useDispatch();
  const [alertType, setAlertType] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const { data: caja, isLoading, refetch, error } = useGetCajaByIdQuery(idCaja);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    saldo_inicial: caja?.saldo_inicial || 0,
    // otros campos que quieras editar
  });

  const [abrirCaja] = useOpenCajaMutation();
  const [cerrarCaja] = useCloseCajaMutation();
  const [updateCaja] = useUpdateCajaMutation();

  useEffect(() => {
    if (caja) {
      setFormData({ saldo_inicial: caja.saldo_inicial || 0 });
    }
  }, [caja]);

  const handleConfirmAction = async () => {
    try {
      if (alertType === "abrir") {
        await handleAbrirCaja();
      } else if (alertType === "cerrar") {
        await handleCerrarCaja();
      } else if (alertType === "guardar") {
        await handleGuardarCambios();
      }
    } finally {
      setAlertOpen(false);
      setAlertType(null);
    }
  };

  const handleAbrirCaja = async () => {
    try {
      await abrirCaja({
        idCaja: caja.id_caja,
        saldoInicial: Number(formData.saldo_inicial),
      }).unwrap();
      dispatch(
        showNotification({
          message: "Caja abierta exitosamente",
          severity: "success",
        })
      );
      refetch();
    } catch (err) {
      console.error("Error al abrir caja:", err);
      dispatch(
        showNotification({
          message: `Error al abrir la caja: ${err?.data}`,
          severity: "error",
        })
      );
    }
  };

  const handleCerrarCaja = async () => {
    try {
      await cerrarCaja({ idCaja: caja.id_caja }).unwrap();
      dispatch(
        showNotification({
          message: "Caja cerrada correctamente",
          severity: "success",
        })
      );
      refetch();
    } catch (err) {
      console.error("Error al cerrar caja:", err);
      dispatch(
        showNotification({
          message: "Error al cerrar la caja",
          severity: "error",
        })
      );
    }
  };

  const handleGuardarCambios = async () => {
    try {
      await updateCaja({
        id: caja.id_caja,
        updatedCaja: {
          saldo_inicial: Number(formData.saldo_inicial),
        },
      }).unwrap();
      setEditMode(false);
      dispatch(
        showNotification({
          message: "Cambios guardados exitosamente",
          severity: "success",
        })
      );
      refetch();
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      dispatch(
        showNotification({
          message: "Error al guardar los cambios",
          severity: "error",
        })
      );
    }
  };
  const formatFecha = (fecha) => {
    return fecha ? new Date(fecha).toLocaleString() : "No disponible";
  };

  return (
    <>
      <Modal
        open={!!idCaja}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <>
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
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="200px"
                >
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error">
                  Error al cargar los detalles.
                </Typography>
              ) : (
                <>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={2}
                    textAlign="center"
                  >
                    Detalles de Caja #{caja.id_caja}
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2} mb={2}>
                    {caja.estado === "cerrada" && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          setAlertType("abrir");
                          setAlertOpen(true);
                        }}
                      >
                        Abrir Caja
                      </Button>
                    )}

                    {caja.estado === "abierta" && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setAlertType("cerrar");
                          setAlertOpen(true);
                        }}
                      >
                        Cerrar Caja
                      </Button>
                    )}

                    {!editMode && (
                      <Button
                        variant="outlined"
                        onClick={() => setEditMode(true)}
                      >
                        Editar
                      </Button>
                    )}
                  </Box>

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
                      <DateRange
                        sx={{
                          color:
                            caja.estado === "abierta" ? "#4CAF50" : "#F44336",
                        }}
                      />
                      <Typography variant="body1">
                        <strong>Estado:</strong> {caja.estado}
                      </Typography>
                    </Box>

                    {/* Saldos */}
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{
                        backgroundColor: editMode
                          ? "rgba(255, 152, 0, 0.08)"
                          : "transparent",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        transition: "background-color 0.3s",
                      }}
                    >
                      <AttachMoney sx={{ color: "#ff9800" }} />
                      <Typography variant="body1" fontWeight="500" width={140}>
                        Saldo Inicial:
                      </Typography>

                      {editMode ? (
                        <TextField
                          variant="standard"
                          type="number"
                          value={formData.saldo_inicial}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              saldo_inicial: e.target.value,
                            })
                          }
                          inputProps={{
                            style: { textAlign: "right", fontWeight: "bold" },
                          }}
                          sx={{
                            maxWidth: 100,
                            "& input": {
                              fontSize: "1rem",
                            },
                          }}
                        />
                      ) : (
                        caja.saldo_inicial
                      )}
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
                        <strong>Fecha Apertura:</strong>{" "}
                        {formatFecha(caja.fecha_apertura)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DateRange sx={{ color: "#9C27B0" }} />
                      <Typography variant="body1">
                        <strong>Fecha Cierre:</strong>{" "}
                        {formatFecha(caja.fecha_cierre)}
                      </Typography>
                    </Box>

                    {/* Usuarios */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person sx={{ color: "#673AB7" }} />
                      <Typography variant="body1">
                        <strong>Usuario Apertura:</strong>{" "}
                        {caja.usuario_apertura || "No asignado"}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person sx={{ color: "#673AB7" }} />
                      <Typography variant="body1">
                        <strong>Usuario Cierre:</strong>{" "}
                        {caja.usuario_cierre || "No asignado"}
                      </Typography>
                    </Box>

                    {/* Dirección y Teléfono */}
                    <Box display="flex" flexDirection="column" mt={2}>
                      <Typography variant="body2">
                        <strong>Dirección Sucursal:</strong>{" "}
                        {caja.sucursal.direccion}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Teléfono Sucursal:</strong>{" "}
                        {caja.sucursal.telefono}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
              {editMode && (
                <Box mt={3} display="flex" justifyContent="space-between">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setAlertType("guardar");
                      setAlertOpen(true);
                    }}
                  >
                    Guardar Cambios
                  </Button>
                  <Button variant="outlined" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        </>
      </Modal>
      <AlertDialog
        openAlert={alertOpen}
        onCloseAlert={() => setAlertOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          alertType === "abrir"
            ? "Confirmar apertura"
            : alertType === "cerrar"
            ? "Confirmar cierre"
            : "Guardar cambios"
        }
        message={
          alertType === "abrir"
            ? "¿Estás seguro de que deseas abrir esta caja?"
            : alertType === "cerrar"
            ? "¿Estás seguro de que deseas cerrar esta caja?"
            : "¿Deseas guardar los cambios realizados?"
        }
      />
    </>
  );
};

DetalleCajaModal.propTypes = {
  idCaja: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

export default DetalleCajaModal;
