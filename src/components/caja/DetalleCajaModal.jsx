import Modal from "../common/CompatModal";
import {
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  IconButton,
} from "@mui/material";
import {
  AccountBalance,
  AttachMoney,
  Close,
  DateRange,
  EditOutlined,
  LockOpenOutlined,
  LockOutlined,
  Person,
  PhoneOutlined,
  SaveOutlined,
  StorefrontOutlined,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
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
import TextField from "../common/CompatTextField";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const getModalSx = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "calc(100vw - 32px)", sm: 680 },
  maxWidth: "100%",
  maxHeight: "calc(100vh - 32px)",
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 18px 48px rgba(15, 23, 42, 0.18)"
      : "0 18px 48px rgba(0, 0, 0, 0.45)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});

const getEstadoMeta = (estado, theme) => {
  const key = String(estado || "").toLowerCase();
  const map = {
    abierta: {
      label: "Abierta",
      color: theme.palette.success.main,
      bg: alpha(theme.palette.success.main, 0.1),
    },
    pendiente: {
      label: "Pendiente",
      color: theme.palette.warning.dark,
      bg: alpha(theme.palette.warning.main, 0.14),
    },
    cerrada: {
      label: "Cerrada",
      color: theme.palette.error.main,
      bg: alpha(theme.palette.error.main, 0.1),
    },
  };

  return (
    map[key] || {
      label: estado || "Sin estado",
      color: theme.palette.text.secondary,
      bg: alpha(theme.palette.text.secondary, 0.1),
    }
  );
};

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleString() : "No disponible";

const actionButtonSx = (theme, variant = "primary") => ({
  borderRadius: 1,
  textTransform: "none",
  fontWeight: 800,
  boxShadow: "none",
  ...(variant === "primary"
    ? {
        bgcolor: "#0F172A",
        color: theme.palette.common.white,
        "&:hover": {
          bgcolor: theme.palette.common.black,
          boxShadow: "none",
        },
      }
    : {
        borderColor: alpha("#0F172A", 0.3),
        color: "#0F172A",
        "&:hover": {
          borderColor: "#0F172A",
          bgcolor: alpha("#0F172A", 0.04),
        },
      }),
});

const InfoItem = ({
  icon,
  label,
  value,
  children,
  indicator,
  fullWidth = false,
}) => (
  <Box
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 1,
      p: 1.25,
      display: "flex",
      gap: 1,
      minWidth: 0,
      gridColumn: fullWidth ? { xs: "auto", sm: "1 / -1" } : "auto",
    }}
  >
    <Box sx={{ mt: 0.25, flex: "0 0 auto" }}>{icon}</Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Box
        sx={{
          minHeight: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {indicator}
      </Box>
      {children || (
        <Typography variant="body2" fontWeight={800} noWrap sx={{ minHeight: 22 }}>
          {value}
        </Typography>
      )}
    </Box>
  </Box>
);

InfoItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  children: PropTypes.node,
  indicator: PropTypes.node,
  fullWidth: PropTypes.bool,
};

const DetalleCajaModal = ({ idCaja, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [alertType, setAlertType] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    saldo_inicial: 0,
  });

  const { data: caja, isLoading, refetch, error } = useGetCajaByIdQuery(idCaja);
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
          message:
            err?.data?.message ||
            err?.data?.error ||
            "Error al abrir la caja",
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
          message:
            err?.data?.message ||
            err?.data?.error ||
            "Error al cerrar la caja",
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
          message:
            err?.data?.message ||
            err?.data?.error ||
            "Error al guardar los cambios",
          severity: "error",
        })
      );
    }
  };

  const estado = caja ? getEstadoMeta(caja.estado, theme) : null;

  return (
    <>
      <Modal
        open={!!idCaja}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={!!idCaja}>
          <Box sx={getModalSx(theme)}>
            <Box
              sx={{
                px: { xs: 2, sm: 2.5 },
                py: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor:
                  theme.palette.mode === "light"
                    ? alpha(theme.palette.grey[100], 0.72)
                    : alpha(theme.palette.common.white, 0.04),
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 1,
                  bgcolor: "#0F172A",
                  color: theme.palette.common.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AccountBalance fontSize="small" />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                  Detalle de caja
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {caja ? `Caja #${caja.id_caja}` : "Cargando información"}
                </Typography>
              </Box>

              {estado && (
                <Chip
                  size="small"
                  label={estado.label}
                  sx={{
                    borderRadius: 1,
                    color: estado.color,
                    bgcolor: estado.bg,
                    fontWeight: 800,
                  }}
                />
              )}

              <IconButton
                size="small"
                aria-label="Cerrar"
                onClick={onClose}
                sx={{
                  borderRadius: "50%",
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.text.primary, 0.08),
                  },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 2.5 }, overflow: "auto" }}>
              {isLoading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight={240}
                >
                  <CircularProgress size={30} />
                </Box>
              ) : error ? (
                <Box
                  sx={{
                    py: 5,
                    textAlign: "center",
                    color: "error.main",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  Error al cargar los detalles.
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 1.25,
                    }}
                  >
                    <InfoItem
                      fullWidth
                      icon={
                        <StorefrontOutlined
                          fontSize="small"
                          sx={{ color: "text.secondary" }}
                        />
                      }
                      label="Sucursal"
                      value={caja?.sucursal?.nombre || "Sin sucursal"}
                    />

                    <InfoItem
                      icon={
                        <AttachMoney
                          fontSize="small"
                          sx={{ color: theme.palette.warning.dark }}
                        />
                      }
                      label="Saldo inicial"
                      indicator={
                        editMode ? (
                          <Chip
                            size="small"
                            label="Editando"
                            sx={{
                              height: 18,
                              borderRadius: 1,
                              fontSize: 11,
                              fontWeight: 800,
                              color: theme.palette.warning.dark,
                              bgcolor: alpha(theme.palette.warning.main, 0.14),
                            }}
                          />
                        ) : null
                      }
                    >
                      {editMode ? (
                        <Box
                          sx={{
                            minHeight: 22,
                            display: "flex",
                            alignItems: "center",
                            maxWidth: 180,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={800}
                            sx={{ mr: 0.25 }}
                          >
                            $
                          </Typography>
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
                            InputProps={{ disableUnderline: true }}
                            inputProps={{
                              "aria-label": "Saldo inicial",
                              inputMode: "numeric",
                            }}
                            sx={{
                              width: 120,
                              "& .MuiInputBase-root": {
                                p: 0,
                                height: 22,
                                fontSize: "0.875rem",
                                fontWeight: 800,
                                lineHeight: 1.43,
                                color: "text.primary",
                              },
                              "& .MuiInputBase-input": {
                                p: 0,
                                height: "auto",
                                fontWeight: 800,
                              },
                              "& input[type=number]": {
                                MozAppearance: "textfield",
                              },
                              "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                {
                                  WebkitAppearance: "none",
                                  margin: 0,
                                },
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" fontWeight={800} sx={{ minHeight: 22 }}>
                          {formatCLP(caja.saldo_inicial)}
                        </Typography>
                      )}
                    </InfoItem>

                    <InfoItem
                      icon={
                        <AttachMoney
                          fontSize="small"
                          sx={{ color: theme.palette.warning.dark }}
                        />
                      }
                      label="Saldo final"
                      value={formatCLP(caja.saldo_final)}
                    />

                    <InfoItem
                      icon={
                        <DateRange
                          fontSize="small"
                          sx={{ color: theme.palette.text.secondary }}
                        />
                      }
                      label="Fecha apertura"
                      value={formatFecha(caja.fecha_apertura)}
                    />

                    <InfoItem
                      icon={
                        <DateRange
                          fontSize="small"
                          sx={{ color: theme.palette.text.secondary }}
                        />
                      }
                      label="Fecha cierre"
                      value={formatFecha(caja.fecha_cierre)}
                    />

                    <InfoItem
                      icon={
                        <Person
                          fontSize="small"
                          sx={{ color: theme.palette.text.secondary }}
                        />
                      }
                      label="Usuario apertura"
                      value={caja.usuario_apertura || "No asignado"}
                    />

                    <InfoItem
                      icon={
                        <Person
                          fontSize="small"
                          sx={{ color: theme.palette.text.secondary }}
                        />
                      }
                      label="Usuario cierre"
                      value={caja.usuario_cierre || "No asignado"}
                    />
                  </Box>

                  <Box
                    sx={{
                      mt: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 1.5,
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 1.25,
                      bgcolor:
                        theme.palette.mode === "light"
                          ? alpha(theme.palette.grey[100], 0.42)
                          : alpha(theme.palette.common.white, 0.03),
                    }}
                  >
                    <Box display="flex" gap={1} sx={{ minWidth: 0 }}>
                      <StorefrontOutlined
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary">
                          Dirección sucursal
                        </Typography>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {caja?.sucursal?.direccion || "No disponible"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" gap={1} sx={{ minWidth: 0 }}>
                      <PhoneOutlined
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary">
                          Teléfono sucursal
                        </Typography>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {caja?.sucursal?.telefono || "No disponible"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            {!isLoading && !error && caja && (
              <>
                <Divider />
                <Box
                  sx={{
                    px: { xs: 2, sm: 2.5 },
                    py: 1.5,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    gap: 1,
                    bgcolor:
                      theme.palette.mode === "light"
                        ? alpha(theme.palette.grey[50], 0.8)
                        : alpha(theme.palette.common.white, 0.03),
                  }}
                >
                  {editMode ? (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => setEditMode(false)}
                        sx={actionButtonSx(theme, "secondary")}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveOutlined />}
                        onClick={() => {
                          setAlertType("guardar");
                          setAlertOpen(true);
                        }}
                        sx={actionButtonSx(theme, "primary")}
                      >
                        Guardar cambios
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<EditOutlined />}
                        onClick={() => setEditMode(true)}
                        sx={actionButtonSx(theme, "secondary")}
                      >
                        Editar saldo
                      </Button>

                      {caja.estado === "cerrada" && (
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<LockOpenOutlined />}
                          onClick={() => {
                            setAlertType("abrir");
                            setAlertOpen(true);
                          }}
                          sx={{
                            borderRadius: 1,
                            textTransform: "none",
                            fontWeight: 800,
                            boxShadow: "none",
                          }}
                        >
                          Abrir caja
                        </Button>
                      )}

                      {caja.estado === "abierta" && (
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<LockOutlined />}
                          onClick={() => {
                            setAlertType("cerrar");
                            setAlertOpen(true);
                          }}
                          sx={{
                            borderRadius: 1,
                            textTransform: "none",
                            fontWeight: 800,
                            boxShadow: "none",
                          }}
                        >
                          Cerrar caja
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Fade>
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
