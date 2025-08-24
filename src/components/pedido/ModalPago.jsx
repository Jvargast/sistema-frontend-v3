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
import {
  Paid,
  CreditCard,
  ReceiptLong,
  Notes,
  Close,
  CheckCircle,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRegistrarDesdePedidoMutation } from "../../store/services/pedidosApi";
import useVerificarCaja from "../../utils/useVerificationCaja";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/reducers/notificacionSlice";
import { useEffect, useMemo } from "react";

const metodosPagoDisponibles = [
  { id: 1, nombre: "Efectivo" },
  { id: 2, nombre: "Tarjeta crédito" },
  { id: 3, nombre: "Tarjeta débito" },
  { id: 4, nombre: "Transferencia" },
];

const ModalPagoPedido = ({ open, onClose, pedido }) => {
  const usuario = useSelector((state) => state.auth.user);
  const { estado } = useVerificarCaja();
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      tipo_documento: "boleta",
      id_metodo_pago:
        pedido?.id_metodo_pago != null ? String(pedido.id_metodo_pago) : "",
    },
  });
  const sucursalPedido = Number(pedido?.id_sucursal);

  const cajasEnSucursal = useMemo(() => {
    const cajasAsignadas = Array.isArray(estado?.cajasAsignadas)
      ? estado.cajasAsignadas
      : [];
    return cajasAsignadas.filter(
      (c) =>
        c.estado === "abierta" && Number(c.id_sucursal) === sucursalPedido
    );
  }, [estado?.cajasAsignadas, sucursalPedido]);

  const montoPendiente = (() => {
    const total = Number(pedido?.total ?? 0);
    const pagado = Number(pedido?.monto_pagado ?? 0);
    const restante = total - pagado;
    return Number.isFinite(restante) && restante > 0 ? restante : total;
  })();

  useEffect(() => {
    if (!open || !pedido) return;
    reset({
      tipo_documento: "boleta",
      id_metodo_pago:
        pedido?.id_metodo_pago != null ? String(pedido.id_metodo_pago) : "",
      pago_recibido: montoPendiente,
      referencia: "",
      notas: "",
      id_caja:
        usuario?.rol === "vendedor"
          ? cajasEnSucursal[0]?.id_caja
            ? String(cajasEnSucursal[0].id_caja)
            : ""
          : cajasEnSucursal.length === 1
          ? String(cajasEnSucursal[0].id_caja)
          : "",
    });
  }, [open, pedido, reset, montoPendiente, usuario?.rol, cajasEnSucursal]);
  const dispatch = useDispatch();

  const [registrarPago, { isLoading }] = useRegistrarDesdePedidoMutation();

  const onSubmit = async (data) => {
    if (usuario?.rol === "vendedor" && !data.id_caja) {
      dispatch(
        showNotification({
          message:
            "No tienes una caja abierta en la sucursal del pedido. Abre o selecciona una para registrar el pago.",
          severity: "warning",
        })
      );
      return;
    }
    try {
      await registrarPago({
        id_pedido: pedido.id_pedido,
        id_caja: data.id_caja ? parseInt(data.id_caja, 10) : undefined,
        tipo_documento: data.tipo_documento,
        pago_recibido: parseFloat(data.pago_recibido),
        referencia: data.referencia,
        notas: data.notas,
        id_usuario_creador: usuario?.rut,
        id_metodo_pago: parseInt(data.id_metodo_pago, 10),
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          boxShadow: 6,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: 800,
        }}
      >
        <Paid fontSize="small" />
        Registrar pago
        <span style={{ flex: 1 }} />
        <TextField
          value={`#${pedido.id_pedido}`}
          size="small"
          variant="outlined"
          InputProps={{ readOnly: true }}
          sx={{
            width: 120,
            "& .MuiInputBase-input": { fontWeight: 700, textAlign: "center" },
          }}
        />
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            marginBottom: 12,
            padding: "10px 12px",
            borderRadius: 10,
            background:
              "linear-gradient(135deg, rgba(25,118,210,0.08), rgba(25,118,210,0.02))",
            border: "1px dashed rgba(25,118,210,0.35)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          <span>Saldo pendiente</span>
          <span style={{ color: "#1976d2" }}>
            ${montoPendiente.toLocaleString()}
          </span>
        </div>
        <form id="form-pago-pedido" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="id_caja"
            control={control}
            rules={{
              required:
                usuario?.rol === "administrador" && cajasEnSucursal.length > 0,
            }}
            render={({ field }) => (
              <TextField
                label={`Caja (sucursal ${sucursalPedido || "-"})`}
                select
                fullWidth
                margin="normal"
                size="small"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                SelectProps={{ displayEmpty: true }}
                helperText={
                  cajasEnSucursal.length === 0
                    ? "No tienes cajas abiertas en esta sucursal."
                    : undefined
                }
              >
                <MenuItem value="" disabled>
                  {cajasEnSucursal.length === 0
                    ? "Sin cajas abiertas"
                    : "Selecciona una caja…"}
                </MenuItem>
                {cajasEnSucursal.map((c) => (
                  <MenuItem key={c.id_caja} value={String(c.id_caja)}>
                    {`Caja #${c.id_caja}${
                      c.sucursal?.nombre ? ` · ${c.sucursal.nombre}` : ""
                    }`}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            label="Tipo de Documento"
            select
            fullWidth
            margin="normal"
            size="small"
            {...register("tipo_documento", { required: true })}
            defaultValue="boleta"
          >
            <MenuItem value="boleta">Boleta</MenuItem>
            {/* <MenuItem value="factura">Factura</MenuItem> */}
          </TextField>

          {/* <TextField
            label="Método de Pago"
            select
            fullWidth
            margin="normal"
            size="small"
            defaultValue={
              pedido?.id_metodo_pago != null
                ? String(pedido.id_metodo_pago)
                : ""
            }
            {...register("id_metodo_pago", { required: true })}
            SelectProps={{ displayEmpty: true }}
            InputProps={{
              startAdornment: <CreditCard sx={{ mr: 1, opacity: 0.6 }} />,
            }}
          >
            <MenuItem value="" disabled>
              Selecciona un método…
            </MenuItem>
            {metodosPagoDisponibles.map((metodo) => (
              <MenuItem key={metodo.id} value={String(metodo.id)}>
                {metodo.nombre}
              </MenuItem>
            ))}
          </TextField> */}
          <Controller
            name="id_metodo_pago"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Método de Pago"
                select
                fullWidth
                margin="normal"
                size="small"
                SelectProps={{ displayEmpty: true }}
                value={field.value ?? ""} // <- nunca undefined
                onChange={(e) => field.onChange(e.target.value)}
                InputProps={{
                  startAdornment: <CreditCard sx={{ mr: 1, opacity: 0.6 }} />,
                }}
              >
                <MenuItem value="" disabled>
                  Selecciona un método…
                </MenuItem>
                {metodosPagoDisponibles.map((metodo) => (
                  <MenuItem key={metodo.id} value={String(metodo.id)}>
                    {metodo.nombre}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            label="Monto recibido"
            type="number"
            fullWidth
            margin="normal"
            size="small"
            inputProps={{ min: 0, step: "0.01" }}
            helperText={`Sugerido: $${montoPendiente.toLocaleString()}`}
            {...register("pago_recibido", { required: true })}
            InputProps={{
              startAdornment: <Paid sx={{ mr: 1, opacity: 0.6 }} />,
            }}
          />

          <TextField
            label="Referencia (opcional)"
            fullWidth
            margin="normal"
            size="small"
            {...register("referencia")}
            InputProps={{
              startAdornment: <ReceiptLong sx={{ mr: 1, opacity: 0.6 }} />,
            }}
          />

          <TextField
            label="Notas"
            fullWidth
            multiline
            rows={2}
            margin="normal"
            size="small"
            {...register("notas")}
            InputProps={{
              startAdornment: (
                <Notes sx={{ mr: 1, opacity: 0.6, alignSelf: "flex-start" }} />
              ),
            }}
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          startIcon={<Close />}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="form-pago-pedido"
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={!isLoading ? <CheckCircle /> : null}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
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
