import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetAllVendedoresQuery } from "../store/services/usuariosApi";
import { useCreateVentaMutation } from "../store/services/ventasApi";
import { useCloseCajaMutation } from "../store/services/cajaApi";
import useVerificarCaja from "./useVerificationCaja";
import { useGetAvailabreProductosQuery } from "../store/services/productoApi";
import { useGetAllClientesQuery } from "../store/services/clientesApi";
import { useGetAllCategoriasQuery } from "../store/services/categoriaApi";
import { getFirstRelevantError } from "./firstError";
import {
  addItem,
  applyDiscount,
  calculateTaxes,
  clearCart,
  removeItem,
  updateItemPrice,
  updateItemQuantity,
} from "../store/reducers/cartSlice";
import { showNotification } from "../store/reducers/notificacionSlice";

export default function usePuntoDeVentaLogic() {
  const botonAbrirPagoRef = useRef(null);
  const [openPagoModal, setOpenPagoModal] = useState(false);
  const [ventaData, setVentaData] = useState(null);
  const [selectedVendedor, setSelectedVendedor] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [yaMostrado, setYaMostrado] = useState(false);
  const [openRetornablesModal, setOpenRetornablesModal] = useState(false);
  const [productosRetornables, setProductosRetornables] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [cajaCerrando, setCajaCerrando] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [tipoDocumento, setTipoDocumento] = useState("boleta");
  const [tipoEntrega, setTipoEntrega] = useState("retiro_en_sucursal");
  const [direccionEntrega, setDireccionEntrega] = useState("");
  const [usarDireccionGuardada, setUsarDireccionGuardada] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);

  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.auth);
  const {
    items: cart,
    subtotal,
    impuestos,
    descuento,
    total,
  } = useSelector((state) => state.cart);

  const {
    data: vendedores,
    isLoading: loadingVendedores,
    error: errorVendedores,
  } = useGetAllVendedoresQuery();
  const { data: clientes, isLoading: loadingClientes } =
    useGetAllClientesQuery();
  const [createVenta, { isLoading: isCreating }] = useCreateVentaMutation();
  const [closeCaja, { isLoading: isClosing }] = useCloseCajaMutation();
  const { estado, isLoading, error } = useVerificarCaja(selectedVendedor);

  const {
    data: productosData,
    isLoading: loadingProductos,
    error: errorProductos,
    refetch,
  } = useGetAvailabreProductosQuery({
    categoria: category === "all" ? undefined : category,
    search: debouncedSearch,
    page,
    limit: pageSize,
  });

  const {
    data: categoriasProductos,
    isLoading: loadingCategorias,
    error: errorCateogrias,
  } = useGetAllCategoriasQuery();

  const relevantError = getFirstRelevantError(
    error,
    errorProductos,
    errorCateogrias,
    usuario?.rol === "administrador" ? errorVendedores : null
  );

  const armarVentaData = (productosRetornablesSeleccionados = null) => {
    const isFactura = tipoDocumento === "factura";
    const data = {
      id_cliente: selectedCliente,
      id_vendedor: usuario.user.id,
      id_caja: estado?.asignada?.id_caja,
      id_sucursal: estado?.asignada?.id_sucursal,
      tipo_entrega: tipoEntrega,
      impuesto: taxRate,
      descuento_total_porcentaje: discount,
      direccion_entrega:
        tipoEntrega === "despacho_a_domicilio"
          ? usarDireccionGuardada
            ? clientes?.clientes?.find((c) => c.id_cliente === selectedCliente)
                ?.direccion || ""
            : direccionEntrega
          : null,
      productos: cart.map((item) => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        descuento_porcentaje: item.descuento_porcentaje || 0,
      })),
      id_metodo_pago: isFactura ? null : undefined,
      notas: "",
      tipo_documento: tipoDocumento,
      pago_recibido: isFactura ? null : undefined,
    };

    if (
      productosRetornablesSeleccionados &&
      productosRetornablesSeleccionados.length > 0
    ) {
      const productosValidos = productosRetornablesSeleccionados.filter(
        (p) => p.cantidad > 0
      );

      if (productosValidos.length > 0) {
        data.productos_retornables = productosValidos.map((item) => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          estado: item.estado,
          tipo_defecto: item.tipo_defecto || null,
        }));
      }
    }

    return data;
  };

  const handleProceedToPayment = () => {
    setProductosRetornables([]);
    const productosRetornablesEnCarrito = cart.filter(
      (item) => item.es_retornable
    );
    const isFactura = tipoDocumento === "factura";

    if (isFactura) {
      const cliente = clientes?.clientes?.find(
        (c) => c.id_cliente === selectedCliente
      );

      if (!cliente || !cliente.razon_social || !cliente.rut) {
        dispatch(
          showNotification({
            message:
              "Debes seleccionar un cliente con razón social y RUT de empresa para emitir una factura.",
            severity: "warning",
          })
        );
        return;
      }
      setOpenClienteModal(false);
      setOpenModal(false);
      setOpenRetornablesModal(false);
      setOpenAlert(false);
      setOpenPagoModal(true);
    }

    const yaConfirmados = productosRetornables.length > 0;
    if (productosRetornablesEnCarrito.length > 0 && !yaConfirmados) {
      setProductosRetornables(productosRetornablesEnCarrito);
      setOpenRetornablesModal(true);
      return;
    }

    const venta = armarVentaData(productosRetornables);
    setVentaData(venta);

    if (isFactura) {
      handleConfirmPayment({
        montoPago: null,
        metodoPago: null,
        notas: "Factura emitida, pago pendiente",
        referencia: null,
      });
    } else {
      setOpenPagoModal(true);
    }
  };

  const handleConfirmRetornables = async (productosSeleccionados) => {
    const productosValidos = productosSeleccionados.filter(
      (p) => p.cantidad > 0
    );
    setProductosRetornables(productosValidos);
    const venta = armarVentaData(productosValidos);
    setVentaData(venta);
    if (tipoDocumento === "factura") {
      await handleConfirmPayment({
        montoPago: null,
        metodoPago: null,
        notas: "Factura emitida, pago pendiente",
        referencia: null,
      });
      return "factura";
    } else {
      setOpenPagoModal(true);
      return "boleta";
    }
  };

  const handleConfirmPayment = async ({
    montoPago,
    metodoPago,
    notas,
    referencia,
  }) => {
    if (!ventaData) return;

    const isFactura = ventaData.tipo_documento === "factura";

    const ventaFinal = {
      ...ventaData,
      ...(isFactura
        ? {
            id_metodo_pago: null,
            pago_recibido: null,
            notas: notas || "Factura generada. Pago pendiente.",
          }
        : {
            id_metodo_pago: metodoPago,
            pago_recibido: montoPago,
            notas,
            ...(metodoPago !== 1 && { referencia }),
          }),
    };

    try {
      dispatch(calculateTaxes(taxRate));
      await createVenta(ventaFinal);
      dispatch(clearCart());
      dispatch(
        showNotification({
          message: isFactura
            ? "Factura registrada como pendiente"
            : "Venta creada exitosamente",
          severity: "success",
        })
      );
      setOpenPagoModal(false);
      setVentaData(null);
      setProductosRetornables([]);
      setTipoDocumento("boleta");
      setTipoEntrega("retiro_en_sucursal");
      setDireccionEntrega("");
      setUsarDireccionGuardada(true);
      setDiscount(0);
      if (selectedCliente) {
        setSelectedCliente(null);
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: `Error al crear la venta: ${error.message || error}`,
          severity: "error",
        })
      );
    }
  };

  const handleClosePagoModal = () => {
    setOpenPagoModal(false);
    setTimeout(() => {
      botonAbrirPagoRef.current?.focus();
    }, 100);
  };

  const isCajaDeHoy = (fechaApertura) => {
    if (!fechaApertura) return false;
    const fechaCaja = new Date(fechaApertura).toDateString();
    const fechaHoy = new Date().toDateString();
    return fechaCaja === fechaHoy;
  };

  const handleSelectVendedor = (rut) => {
    if (!rut) {
      console.error("⚠️ Error: Rut seleccionado es inválido.");
      return;
    }

    const cajaSeleccionada = vendedores?.find((v) => v.rut === rut)
      ?.cajasAsignadas[0];

    if (
      usuario?.rol === "vendedor" &&
      cajaSeleccionada &&
      !isCajaDeHoy(cajaSeleccionada.fecha_apertura)
    ) {
      alert("⚠️ La caja seleccionada no es del día de hoy. Elige otra.");
      return;
    }

    setSelectedVendedor(rut);
    setTimeout(() => setOpenModal(false), 200);
  };

  const handleCategoryClick = (category) => {
    setCategory(category);
  };

  const handleAddToCart = (product) => {
    dispatch(
      addItem({
        id_producto: product.id_producto,
        nombre: product.nombre_producto,
        precio_unitario: parseFloat(product.precio),
        cantidad: 1,
        descuento_porcentaje: 0,
        es_retornable: product.es_retornable,
        tipo: product.tipo || "producto",
      })
    );
  };

  const handleRemoveFromCart = (id_producto, tipo) => {
    dispatch(removeItem({ id_producto, tipo }));
  };

  const handleDiscountChange = (e) => {
    const descuentoPorcentaje = Number(e.target.value);
    if (isNaN(descuentoPorcentaje) || descuentoPorcentaje < 0) return;

    setDiscount(descuentoPorcentaje);
    dispatch(applyDiscount(descuentoPorcentaje));
    dispatch(calculateTaxes(taxRate));
  };

  const handleQuantityChange = (id_producto, tipo, cantidad) => {
    if (cantidad < 1) return;
    dispatch(updateItemQuantity({ id_producto, tipo, cantidad }));
  };

  const handleTaxRateChange = (e) => {
    const newTaxRate = parseFloat(e.target.value);
    if (isNaN(newTaxRate) || newTaxRate < 0) return;
    setTaxRate(newTaxRate);
    dispatch(calculateTaxes(newTaxRate));
  };

  const handlePriceChange = (id_producto, tipo, nuevoPrecio) => {
    dispatch(updateItemPrice({ id_producto, tipo, nuevoPrecio }));
  };

  const confirmAlert = () => {
    setOpenAlert(true);
  };

  const handleCerrarCaja = async () => {
    let cajaId;
    if (usuario?.rol === "administrador") {
      const vendedorSeleccionado = vendedores?.find(
        (v) => v.rut === selectedVendedor
      );
      cajaId = vendedorSeleccionado?.cajasAsignadas[0]?.id_caja;
    } else {
      cajaId = estado?.asignada?.id_caja;
    }
    if (!cajaId) {
      dispatch(
        showNotification({
          message: "No hay caja seleccionada para cerrar",
          severity: "error",
        })
      );
      return;
    }
    if (!estado?.asignada?.id_caja) return;
    setCajaCerrando(true);
    try {
      await closeCaja({ idCaja: cajaId });
      setCajaCerrando(false);
      dispatch(
        showNotification({
          message: "Caja cerrada exitosamente",
          severity: "success",
        })
      );
    } catch (error) {
      setCajaCerrando(false);
      dispatch(
        showNotification({
          message: `Error al cerrar la caja ${error}`,
          severity: "success",
        })
      );
    }
  };

  useEffect(() => {
    if (usuario?.rol === "administrador" && !selectedVendedor) {
      setOpenModal(true);
    }
  }, [usuario, selectedVendedor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
    }, 500);

    setIsSearching(true);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(calculateTaxes(taxRate));
  }, [subtotal, descuento, taxRate, dispatch]);

  useEffect(() => {
    refetch();
  }, [category, refetch]);

  useEffect(() => {
    if (usuario?.rol === "administrador" && !selectedVendedor && !yaMostrado) {
      setOpenModal(true);
      setYaMostrado(true);
    }
  }, [usuario, selectedVendedor, yaMostrado]);

  return {
    botonAbrirPagoRef,
    openPagoModal,
    setOpenPagoModal,
    ventaData,
    setVentaData,
    selectedVendedor,
    setSelectedVendedor,
    openModal,
    setOpenModal,
    openRetornablesModal,
    setOpenRetornablesModal,
    productosRetornables,
    setProductosRetornables,
    selectedCliente,
    setSelectedCliente,
    openClienteModal,
    setOpenClienteModal,
    cajaCerrando,
    setCajaCerrando,
    openAlert,
    setOpenAlert,
    taxRate,
    setTaxRate,
    tipoDocumento,
    setTipoDocumento,
    tipoEntrega,
    setTipoEntrega,
    direccionEntrega,
    setDireccionEntrega,
    usarDireccionGuardada,
    setUsarDireccionGuardada,
    category,
    setCategory,
    search,
    setSearch,
    debouncedSearch,
    isSearching,
    setIsSearching,
    discount,
    setDiscount,
    page,
    setPage,
    pageSize,
    dispatch,
    usuario,
    cart,
    subtotal,
    impuestos,
    descuento,
    total,
    vendedores,
    loadingVendedores,
    errorVendedores,
    clientes,
    loadingClientes,
    isCreating,
    closeCaja,
    isClosing,
    estado,
    isLoading,
    error,
    productosData,
    loadingProductos,
    errorProductos,
    refetch,
    categoriasProductos,
    loadingCategorias,
    errorCateogrias,
    relevantError,
    armarVentaData,
    handleProceedToPayment,
    handleConfirmRetornables,
    handleConfirmPayment,
    handleClosePagoModal,
    isCajaDeHoy,
    handleSelectVendedor,
    handleCategoryClick,
    handleAddToCart,
    handleRemoveFromCart,
    handleDiscountChange,
    handleQuantityChange,
    handleTaxRateChange,
    handlePriceChange,
    confirmAlert,
    handleCerrarCaja,
    showNotification
  };
}
