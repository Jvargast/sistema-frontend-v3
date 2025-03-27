import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRegistrarDesdePedidoMutation } from "../../store/services/pedidosApi";
import useVerificarCaja from "../../utils/useVerificationCaja";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";

// Lista de métodos de pago para el select
const metodosPagoDisponibles = [
  { id: 1, nombre: "Efectivo" },
  { id: 2, nombre: "Tarjeta crédito" },
  { id: 3, nombre: "Tarjeta débito" },
  { id: 4, nombre: "Transferencia" },
];

const ModalPagoPedido = ({ open, onClose, pedido }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      tipo_documento: "boleta",
      id_metodo_pago: pedido?.id_metodo_pago || "",
    },
  });
  const dispatch = useDispatch();

  const usuario = useSelector((state) => state.auth.user);
  const { estado } = useVerificarCaja();

  const idCajaFinal =
    usuario?.rol === "vendedor" ? estado?.asignada?.id_caja : null;

  const [registrarPago, { isLoading }] = useRegistrarDesdePedidoMutation();

  const onSubmit = async (data) => {
    try {
      await registrarPago({
        id_pedido: pedido.id_pedido,
        id_caja: idCajaFinal, // null si es admin
        tipo_documento: data.tipo_documento,
        pago_recibido: parseFloat(data.pago_recibido),
        referencia: data.referencia,
        notas: data.notas,
        id_usuario_creador: usuario?.rut,
        // solo enviamos si no venía predefinido
        ...(pedido.id_metodo_pago
          ? {}
          : { id_metodo_pago: parseInt(data.id_metodo_pago) }),
      }).unwrap();
      dispatch(
        showNotification({
          message: "Se ha registrado pago con éxito.",
          severity: "success",
        })
      );
      onClose();
      reset();
    } catch (err) {
      dispatch(
        showNotification({
          message: `Error al registrar pago ${err.data.mensaje}`,
          severity: "error",
        })
      );
      console.error("Error al registrar el pago del pedido:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Registrar Pago del Pedido #{pedido.id_pedido}</DialogTitle>
      <DialogContent>
        <form id="form-pago-pedido" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Tipo de Documento"
            select
            fullWidth
            margin="normal"
            {...register("tipo_documento", { required: true })}
            defaultValue="boleta"
          >
            <MenuItem value="boleta">Boleta</MenuItem>
            <MenuItem value="factura">Factura</MenuItem>
          </TextField>

          {!pedido.id_metodo_pago && (
            <TextField
              label="Método de Pago"
              select
              fullWidth
              margin="normal"
              defaultValue=""
              {...register("id_metodo_pago", { required: true })}
            >
              {metodosPagoDisponibles.map((metodo) => (
                <MenuItem key={metodo.id} value={metodo.id}>
                  {metodo.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label="Monto recibido"
            type="number"
            fullWidth
            margin="normal"
            {...register("pago_recibido", { required: true })}
          />

          <TextField
            label="Referencia (opcional)"
            fullWidth
            margin="normal"
            {...register("referencia")}
          />

          <TextField
            label="Notas"
            fullWidth
            multiline
            rows={2}
            margin="normal"
            {...register("notas")}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          type="submit"
          form="form-pago-pedido"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "Procesando..." : "Registrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalPagoPedido.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pedido: PropTypes.object.isRequired,
};

export default ModalPagoPedido;
