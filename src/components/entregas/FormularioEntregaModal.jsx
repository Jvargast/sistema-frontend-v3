import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Divider,
  Paper,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PropTypes from "prop-types";
import useEntregaFormLogic from "../../utils/useEntregaFormLogic";
import EntregaPagoStep from "./EntregaPagoStep";
import EntregaBotellonesStep from "./EntregaBotellonesStep";

const PagoStepIcon = ({ active, completed, className }) => (
  <CreditCardIcon
    className={className}
    fontSize="small"
    color={completed ? "success" : active ? "primary" : "disabled"}
  />
);

const RetornablesStepIcon = ({ active, completed, className }) => (
  <AutorenewIcon
    className={className}
    fontSize="small"
    color={completed ? "success" : active ? "primary" : "disabled"}
  />
);

PagoStepIcon.propTypes = RetornablesStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  className: PropTypes.string,
};

const FormularioEntregaModal = ({
  open,
  onClose,
  destino,
  id_agenda_viaje,
  onSuccess,
}) => {
  const theme = useTheme();

  const {
    paso,
    setPaso,
    detallePedido,
    productosRetornables,
    handleSubmit,
    register,
    errors,
    watch,
    isLoading,
    onSubmit,
    clienteTrae,
    setClienteTrae,
    setProductosSeleccionados,
  } = useEntregaFormLogic({
    open,
    destino,
    id_agenda_viaje,
    onClose,
    onSuccess,
  });

  const montoFmt = (n) =>
    typeof n === "number"
      ? n.toLocaleString("es-CL", { style: "currency", currency: "CLP" })
      : "-";

  const pagado = Boolean(detallePedido?.pagado);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      keepMounted
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 24,
        },
      }}
    >
      {/* Header con gradiente e icono */}
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#fff",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)"
                : "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LocalShippingIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.1}>
                Registrar Entrega
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.9, display: "block" }}
              >
                Cliente: <strong>{destino?.nombre_cliente || "-"}</strong>
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,.12)",
              "&:hover": { bgcolor: "rgba(255,255,255,.2)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          pb: 0,
        }}
      >
        {/* Resumen pedido */}
        <Paper
          variant="outlined"
          sx={{
            mt: 2,
            mb: 2,
            px: 2,
            py: 1.5,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(59,130,246,.08)"
                : "rgba(59,130,246,.06)",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(59,130,246,.3)"
                : "rgba(59,130,246,.25)",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Monto total del pedido
            </Typography>
            <Typography variant="h6" fontWeight={800}>
              {montoFmt(detallePedido?.monto_total)}
            </Typography>
          </Box>
          <Chip
            label={pagado ? "Pagado" : "Pendiente"}
            color={pagado ? "success" : "warning"}
            variant={pagado ? "filled" : "outlined"}
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Paper>

        {/* Stepper */}
        <Stepper activeStep={(paso || 1) - 1} alternativeLabel sx={{ mb: 2 }}>
          <Step>
            <StepLabel StepIconComponent={PagoStepIcon}>Pago</StepLabel>
          </Step>
          <Step>
            <StepLabel StepIconComponent={RetornablesStepIcon}>
              Retornables
            </StepLabel>
          </Step>
        </Stepper>

        <Divider sx={{ mb: 2 }} />

        {/* Form */}
        <form id="entrega-form" onSubmit={handleSubmit(onSubmit)}>
          {paso === 1 && (
            <EntregaPagoStep
              detallePedido={detallePedido}
              register={register}
              errors={errors}
              watch={watch}
            />
          )}

          {paso === 2 && (
            <EntregaBotellonesStep
              productos={productosRetornables}
              onChange={setProductosSeleccionados}
              clienteTrae={clienteTrae}
              setClienteTrae={setClienteTrae}
              detallePedido={detallePedido}
              watch={watch}
            />
          )}
        </form>
      </DialogContent>

      {/* Footer pegajoso */}
      <DialogActions
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          borderTop: `1px solid ${theme.palette.divider}`,
          py: 1.5,
          px: 2,
        }}
      >
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancelar
        </Button>

        {paso === 1 && !pagado && (
          <Button
            onClick={() => setPaso(2)}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Siguiente
          </Button>
        )}

        {paso === 2 && (
          <Button
            type="submit"
            form="entrega-form"
            variant="contained"
            loading={isLoading}
            loadingIndicator={<CircularProgress size={20} />}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Registrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

FormularioEntregaModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  destino: PropTypes.object.isRequired,
  id_agenda_viaje: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default FormularioEntregaModal;
