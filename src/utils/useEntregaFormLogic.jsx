import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
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
  const submittingRef = useRef(false);

  const [createEntrega, { isLoading }] = useCreateEntregaMutation();
  const {
    data: detallePedido,
    isFetching: isDetalleLoading,
    isError: isDetalleError,
  } = useGetDetalleConTotalQuery(
    open && destino?.id_pedido ? destino.id_pedido : skipToken
  );
  const montoTotalPedido = useMemo(
    () => Number(detallePedido?.monto_total) || 0,
    [detallePedido?.monto_total]
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
      if (destino?.tipo_documento === "factura") setPaso(2);
      else setPaso(detallePedido?.pagado ? 2 : 1);

      setClienteTrae(true);
      // precargar filas con cantidad 0
      const base = (detallePedido?.detalle || [])
        .filter((d) => d.es_retornable)
        .map((d) => ({ id_producto: d.id_producto, cantidad: 0 }));

      setProductosSeleccionados(base);
    }
  }, [open, detallePedido?.pagado, reset, destino?.tipo_documento, setPaso]);

  const enviarEntrega = useCallback(
    async (formData, retornables) => {
      if (submittingRef.current) return;
      submittingRef.current = true;

      try {
        if (!destino?.id_pedido || !detallePedido?.detalle?.length) {
          throw new Error("No se pudo cargar el detalle del pedido.");
        }

        const productos_entregados = [];
        const insumo_entregados = [];

        detallePedido.detalle.forEach((item) => {
          if (item.id_producto) {
            productos_entregados.push({
              id_producto: item.id_producto,
              cantidad: item.cantidad,
              es_retornable: item.es_retornable || false,
            });
          } else if (item.id_insumo) {
            insumo_entregados.push({
              id_insumo: item.id_insumo,
              cantidad: item.cantidad,
            });
          }
        });

        /*         const botellonesRetorno =
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
            : { pasados: false, items: [] }; */

        const itemsRecibidos = (retornables || [])
          .filter((i) => Number(i.cantidad) > 0)
          .map((i) => ({
            id_producto: i.id_producto,
            cantidad: Number(i.cantidad),
          }));

        const botellonesRetorno =
          clienteTrae && itemsRecibidos.length > 0
            ? { pasados: true, items: itemsRecibidos }
            : { pasados: false, items: [] };

        const isFactura = destino?.tipo_documento === "factura";
        const isEfectivo = parseInt(formData.id_metodo_pago) === 1;

        const payload = {
          id_agenda_viaje,
          id_pedido: destino.id_pedido,
          productos_entregados,
          insumo_entregados,
          botellones_retorno: botellonesRetorno,
          monto_total: montoTotalPedido,
          id_metodo_pago:
            destino?.tipo_documento === "factura"
              ? null
              : formData.id_metodo_pago || null,
          payment_reference:
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
            ? montoTotalPedido
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
      } finally {
        submittingRef.current = false;
      }
    },
    [
      clienteTrae,
      createEntrega,
      detallePedido,
      destino,
      id_agenda_viaje,
      dispatch,
      montoTotalPedido,
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
    isDetalleLoading,
    isDetalleError,
    montoTotalPedido,
    onSubmit,
    clienteTrae,
    setClienteTrae,
    setProductosSeleccionados,
  };
}

export default useEntregaFormLogic;
