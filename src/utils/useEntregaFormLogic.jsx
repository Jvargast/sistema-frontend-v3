import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useCreateEntregaMutation } from "../store/services/entregasApi";
import { useGetDetalleConTotalQuery } from "../store/services/pedidosApi";
import { showNotification } from "../store/reducers/notificacionSlice";

function useEntregaFormLogic({
  open,
  destino,
  id_agenda_viaje,
  onClose,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.auth.user);
  const [paso, setPaso] = useState(1);
  const [clienteTrae, setClienteTrae] = useState(true);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const [createEntrega, { isLoading }] = useCreateEntregaMutation();
  const { data: detallePedido } = useGetDetalleConTotalQuery(
    destino?.id_pedido
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const productosRetornables = useMemo(() => {
    return detallePedido?.detalle?.filter((item) => item.es_retornable) || [];
  }, [detallePedido]);

  useEffect(() => {
    if (open) {
      reset();
      if (destino?.tipo_documento === "factura") {
        setPaso(2);
      } else {
        setPaso(detallePedido?.pagado ? 2 : 1);
      }
      setClienteTrae(true);
      setProductosSeleccionados([]);
    }
  }, [open, detallePedido?.pagado]);

  const enviarEntrega = useCallback(
    async (formData, retornables) => {
      try {
        const productos_entregados =
          detallePedido?.detalle.map((item) => ({
            id_producto: item.id_producto,
            cantidad: item.cantidad,
            es_retornable: item.es_retornable || false,
          })) || [];

        const botellonesRetorno =
          retornables.length > 0
            ? {
                pasados: true,
                items: retornables.map((item) => ({
                  id_producto: item.id_producto,
                  cantidad: item.cantidad,
                  estado: item.estado,
                  tipo_defecto: item.tipo_defecto,
                })),
              }
            : { pasados: false, items: [] };

        const isFactura = destino?.tipo_documento === "factura";
        const isEfectivo = parseInt(formData.id_metodo_pago) === 1;
        
        const payload = {
          id_agenda_viaje,
          id_pedido: destino.id_pedido,
          productos_entregados,
          insumo_entregados: [],
          botellones_retorno: botellonesRetorno,
          monto_total: detallePedido?.monto_total || 0,
          id_metodo_pago:
            destino?.tipo_documento === "factura"
              ? null
              : formData.id_metodo_pago || null,
          referencia:
            destino?.tipo_documento === "factura"
              ? null
              : formData.payment_reference || null,
          tipo_documento: destino?.tipo_documento || "boleta",
          notas: formData.notas || "",
          impuesto: 0,
          descuento_total_porcentaje: 0,
          id_chofer: usuario?.id,
          pago_recibido: isFactura
            ? null
            : isEfectivo
            ? detallePedido?.monto_total || 0
            : null,
        };

        const response = await createEntrega(payload).unwrap();
        dispatch(
          showNotification({
            message: "Entrega registrada correctamente",
            severity: "success",
          })
        );
        onSuccess(destino.id_pedido, response.entrega);
        reset();
        setPaso(1);
        setClienteTrae(true);
        setProductosSeleccionados([]);
        onClose();
      } catch (error) {
        console.error(error);
        dispatch(
          showNotification({
            message: "Error al registrar la entrega",
            severity: "error",
          })
        );
      }
    },
    [
      createEntrega,
      detallePedido,
      destino,
      id_agenda_viaje,
      dispatch,
      onClose,
      onSuccess,
      reset,
      usuario,
    ]
  );

  const onSubmit = useCallback(
    async (formData) => {
      if (productosRetornables.length > 0 && clienteTrae) {
        await enviarEntrega(formData, productosSeleccionados);
      } else {
        await enviarEntrega(formData, []);
      }
    },
    [clienteTrae, productosRetornables, enviarEntrega, productosSeleccionados]
  );

  return {
    paso,
    setPaso,
    detallePedido,
    productosRetornables,
    handleSubmit,
    register,
    errors,
    watch,
    reset,
    isLoading,
    onSubmit,
    clienteTrae,
    setClienteTrae,
    setProductosSeleccionados,
  };
}

export default useEntregaFormLogic;
