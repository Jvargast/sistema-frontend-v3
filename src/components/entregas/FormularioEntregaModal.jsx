import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import useEntregaFormLogic from "../../utils/useEntregaFormLogic";
import EntregaPagoStep from "./EntregaPagoStep";
import EntregaBotellonesStep from "./EntregaBotellonesStep";

const FormularioEntregaModal = ({
  open,
  onClose,
  destino,
  id_agenda_viaje,
  onSuccess,
}) => {
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

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Registrar Entrega</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Cliente: <strong>{destino?.nombre_cliente}</strong>
          </Typography>

          {detallePedido && (
            <Typography sx={{ mb: 2 }}>
              Monto total del pedido:{" "}
              <strong>${detallePedido.monto_total}</strong>
            </Typography>
          )}

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

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>

          {paso === 1 && !detallePedido?.pagado && (
            <Button onClick={() => setPaso(2)} variant="contained">
              Siguiente
            </Button>
          )}

          {paso === 2 && (
            <Button
              type="submit"
              form="entrega-form"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Registrar"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
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
