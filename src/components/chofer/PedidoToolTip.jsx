import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import { useGetPedidoByIdQuery } from "../../store/services/pedidosApi";
import PropTypes from "prop-types";

const PedidoTooltip = ({ idPedido }) => {
  const { data: pedido, isLoading, isError } = useGetPedidoByIdQuery(idPedido);

  if (isLoading)
    return (
      <Paper className="p-4 shadow-md flex justify-center items-center">
        <CircularProgress size={20} />
      </Paper>
    );

  if (isError || !pedido)
    return (
      <Paper className="p-4 shadow-md">
        <Typography variant="body2" color="error">
          Error al cargar pedido.
        </Typography>
      </Paper>
    );

  return (
    <Paper className="p-4 shadow-lg max-w-sm">
      <Typography variant="h6" className="font-bold mb-2 text-indigo-600">
        Pedido #{pedido.id_pedido}
      </Typography>

      <Divider className="mb-2" />

      <Typography variant="body2" className="mb-1">
        <strong>Cliente:</strong> {pedido.Cliente?.nombre ?? "Desconocido"}{" "}
        {pedido.Cliente?.apellido ?? ""}
      </Typography>

      <Typography variant="body2" className="mb-1">
        <strong>Chofer:</strong>{" "}
        {pedido.Chofer?.nombre
          ? `${pedido.Chofer.nombre} ${pedido.Chofer.apellido}`
          : "No asignado"}
      </Typography>

      <Typography variant="body2" className="mb-1">
        <strong>Creado por:</strong> {pedido.Creador?.nombre ?? "Desconocido"} (
        {pedido.Creador?.rut ?? "Sin RUT"})
      </Typography>

      <Typography variant="body2" className="mb-1">
        <strong>Método de Pago:</strong>{" "}
        {pedido.MetodoPago?.nombre ?? "No especificado"}
      </Typography>

      <Typography variant="body2" component="div" className="mb-2">
        <strong>Estado Pago:</strong>{" "}
        <Chip
          label={pedido.estado_pago}
          color={pedido.pagado ? "success" : "warning"}
          size="small"
        />
      </Typography>

      <Divider className="mb-2" />

      <Typography
        variant="subtitle2"
        className="font-semibold text-indigo-500 mb-1"
      >
        Productos:
      </Typography>

      {pedido.DetallesPedido?.map((item) => {
        const isProducto = !!item.Producto;
        const nombre = isProducto
          ? item.Producto.nombre_producto
          : item.Insumo?.nombre_insumo ?? "Desconocido";

        const tipoLabel = isProducto ? "Producto" : "Insumo";
        const tipoColor = isProducto ? "primary" : "default";

        return (
          <div
            key={item.id_detalle_pedido}
            className="flex items-start gap-2 mb-1"
          >
            <Chip
              label={tipoLabel}
              size="small"
              color={tipoColor}
              sx={{ fontSize: "0.75rem", height: "20px" }}
            />
            <Typography variant="body2">
              {nombre} ({item.cantidad} x $
              {Number(item.precio_unitario).toFixed(0)}) = $
              {Number(item.subtotal).toFixed(0)}
            </Typography>
          </div>
        );
      })}

      <Divider className="my-2" />

      <Typography
        variant="subtitle1"
        className="font-semibold text-right text-indigo-700"
      >
        Total: ${pedido.total}
      </Typography>

      {pedido.notas && (
        <>
          <Divider className="my-2" />
          <Typography variant="body2">
            <strong>Notas:</strong> {pedido.notas}
          </Typography>
        </>
      )}
    </Paper>
  );
};

PedidoTooltip.propTypes = {
  idPedido: PropTypes.number.isRequired,
};

export default PedidoTooltip;
