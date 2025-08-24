import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PropTypes from "prop-types";
import { fetchCuentaPorCobrarPdf } from "../../utils/pdfHelper";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useState } from "react";
import { useNavigate } from "react-router";
import ModalPagoFactura from "../../components/cuentas_por_cobrar/ModalPagoFactura";
import {
  useGetCuentaPorCobrarByIdQuery,
  useUpdateCuentaPorCobrarMutation,
} from "../../store/services/cuentasPorCobrarApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useDispatch } from "react-redux";
import BackButton from "../../components/common/BackButton";
import PagosAsociados from "../../components/cuentas_por_cobrar/PagosAsociados";

const estadoColores = {
  pendiente: "warning",
  pagado: "success",
  vencido: "error",
};

const CLP = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(valor));

const CuentaPorCobrarDetalle = ({ cuenta }) => {
  const dispatch = useDispatch();
  const [loadingPdf, setLoadingPdf] = useState(false);

  const navigate = useNavigate();
  const [openModalPago, setOpenModalPago] = useState(false);
  const { refetch } = useGetCuentaPorCobrarByIdQuery(cuenta.id_cxc);
  const [updateCuenta] = useUpdateCuentaPorCobrarMutation();

  const [refetchPagosKey, setRefetchPagosKey] = useState(0);

  const {
    monto_total,
    monto_pagado,
    saldo_pendiente,
    fecha_emision,
    fecha_vencimiento,
    estado,
    documento,
    venta,
    id_venta,
    id_cxc,
  } = cuenta;

  const [modoEdicion, setModoEdicion] = useState(false);
  const [estadoEditado, setEstadoEditado] = useState(estado);
  const [fechaVencimientoEditada, setFechaVencimientoEditada] =
    useState(fecha_vencimiento);

  const handleGuardarCambios = async () => {
    try {
      await updateCuenta({
        id_cxc,
        estado: estadoEditado,
        fecha_vencimiento: fechaVencimientoEditada,
      }).unwrap();
      setModoEdicion(false);
      refetch();
      dispatch(
        showNotification({
          message: "Cuenta actualizada correctamente.",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error al actualizar cuenta:", error);
    }
  };
  const handleDownloadPdf = async () => {
    setLoadingPdf(true);
    try {
      await fetchCuentaPorCobrarPdf(id_cxc);
    } catch (error) {
      console.error("Error al generar PDF:", error);
    } finally {
      setLoadingPdf(false);
    }
  };
  if (!cuenta) return null;

  return (
    <Box sx={{ p: 2 }}>
      <BackButton to="/facturas" label="Volver a Facturas" />
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 2,
          background: modoEdicion
            ? "linear-gradient(135deg, #d32f2f, #ef5350)" 
            : "linear-gradient(135deg, #1e88e5, #64b5f6)", 
          color: "#fff",
          mb: 3,
          transition: "background 0.3s",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h5" fontWeight="bold">
            🧾 Detalle Factura #{id_cxc}
          </Typography>

          <Box display="flex" gap={1}>
            {modoEdicion ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setModoEdicion(false)}
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#ffffff22",
                    },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleGuardarCambios}
                  sx={{
                    backgroundColor: "#fff",
                    color: "#d32f2f",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  Guardar
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setModoEdicion(true)}
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#ffffff22",
                  },
                }}
              >
                Editar
              </Button>
            )}

            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={
                loadingPdf ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <PictureAsPdfIcon />
                )
              }
              onClick={handleDownloadPdf}
              disabled={loadingPdf}
              sx={{
                backgroundColor: "#ffffff",
                color: modoEdicion ? "#d32f2f" : "#1e88e5",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: 1,
                "&:hover": {
                  backgroundColor: "#fce4ec",
                },
              }}
            >
              {loadingPdf ? "Generando..." : "Ver PDF"}
            </Button>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" mt={1}>
          {modoEdicion ? (
            <TextField
              select
              value={estadoEditado}
              onChange={(e) => setEstadoEditado(e.target.value)}
              variant="standard"
              sx={{
                minWidth: 140,
                backgroundColor: "#ffffff",
                borderRadius: 1,
                "& .MuiSelect-select": {
                  fontWeight: "bold",
                  color: "#d32f2f",
                },
              }}
            >
              {["pendiente", "pagado", "vencido"].map((op) => (
                <MenuItem key={op} value={op}>
                  {op.charAt(0).toUpperCase() + op.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Chip
              label={`Estado: ${estado}`}
              color={estadoColores[estado] || "default"}
              sx={{ fontWeight: "bold", fontSize: 14 }}
            />
          )}
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          {/* Primera Columna */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Cliente
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountBoxIcon sx={{ mr: 1 }} />
              <Typography fontWeight="bold">
                {venta?.cliente?.razon_social} ({venta?.cliente?.rut})
              </Typography>
            </Box>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Fecha Emisión
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <EventNoteIcon sx={{ mr: 1 }} />
              <Typography>
                {new Date(fecha_emision).toLocaleDateString()}
              </Typography>
            </Box>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Fecha Vencimiento
            </Typography>
            <Box display="flex" alignItems="center">
              <EventNoteIcon
                sx={{ mr: 1, color: modoEdicion ? "#d32f2f" : "inherit" }}
              />
              {modoEdicion ? (
                <TextField
                  type="date"
                  value={fechaVencimientoEditada?.slice(0, 10)}
                  onChange={(e) => setFechaVencimientoEditada(e.target.value)}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontWeight: "bold",
                      fontSize: "1rem",
                      px: 1,
                      color: "#d32f2f",
                      backgroundColor: "#ffffffcc", // sutil blanco para destacar
                      borderRadius: 1,
                    },
                  }}
                  sx={{
                    "& input": {
                      color: "#d32f2f",
                      fontWeight: "bold",
                      textAlign: "left",
                    },
                  }}
                />
              ) : (
                <Typography>
                  {new Date(fecha_vencimiento).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Separador vertical */}
          <Grid
            item
            md={1}
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            <Divider orientation="vertical" flexItem />
          </Grid>

          {/* Segunda Columna */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Documento Asociado
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <ReceiptLongIcon sx={{ mr: 1 }} />
              <Typography fontWeight="bold">
                {`${documento.tipo_documento.toUpperCase()} N° ${
                  documento.numero
                }`}
              </Typography>
            </Box>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              ID de Venta
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography fontStyle="italic">{id_venta}</Typography>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => navigate(`/admin/ventas/ver/${id_venta}`)}
                sx={{
                  ml: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  borderColor: "#1e88e5",
                  color: "#1e88e5",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                    borderColor: "#1e88e5",
                  },
                }}
              >
                Ver Detalles
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Monto Total
                </Typography>
                <Box display="flex" alignItems="center">
                  <MonetizationOnIcon sx={{ mr: 1 }} />
                  <Typography fontWeight="bold" color="primary">
                    {CLP(monto_total)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Pagado
                </Typography>
                <Box display="flex" alignItems="center">
                  <MonetizationOnIcon sx={{ mr: 1 }} />
                  <Typography>{CLP(monto_pagado)}</Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Pendiente
                </Typography>
                <Box display="flex" alignItems="center">
                  <MonetizationOnIcon sx={{ mr: 1 }} />
                  <Typography color="error">{CLP(saldo_pendiente)}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end">
          {estado !== "pagado" ? (
            <Button
              variant="contained"
              color="success"
              onClick={() => setOpenModalPago(true)}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Registrar Pago
            </Button>
          ) : (
            <Chip
              label="Pagada"
              color="success"
              icon={<MonetizationOnIcon />}
              sx={{
                fontWeight: "bold",
                px: 2,
                height: 32,
                fontSize: 14,
              }}
            />
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="caption"
          textAlign="center"
          display="block"
          color="text.secondary"
        >
          Esta cuenta fue generada automáticamente al emitir una factura.
        </Typography>
      </Paper>
      <ModalPagoFactura
        open={openModalPago}
        onClose={() => {
          setOpenModalPago(false);
          refetch();
          setRefetchPagosKey((prev) => prev + 1);
        }}
        idCxc={cuenta.id_cxc}
        montoPorDefecto={cuenta.saldo_pendiente}
      />
      <PagosAsociados idVenta={id_venta} refetchTrigger={refetchPagosKey} />
    </Box>
  );
};

CuentaPorCobrarDetalle.propTypes = {
  cuenta: PropTypes.shape({
    id_cxc: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    monto_total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    monto_pagado: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    saldo_pendiente: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    fecha_emision: PropTypes.string.isRequired,
    fecha_vencimiento: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    documento: PropTypes.shape({
      tipo_documento: PropTypes.string.isRequired,
      numero: PropTypes.string.isRequired,
      id_documento: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }).isRequired,
    venta: PropTypes.shape({
      cliente: PropTypes.shape({
        razon_social: PropTypes.string.isRequired,
        rut: PropTypes.string.isRequired,
      }),
    }),
    id_venta: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
};

export default CuentaPorCobrarDetalle;
