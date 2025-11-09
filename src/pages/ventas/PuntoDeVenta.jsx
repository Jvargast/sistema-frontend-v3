import { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
  applyDiscount,
  calculateTaxes,
  updateItemPrice,
} from "../../store/reducers/cartSlice";
import { useGetAvailabreProductosQuery } from "../../store/services/productoApi";
import { useGetAllCategoriasQuery } from "../../store/services/categoriaApi";
import { useGetAllClientesQuery } from "../../store/services/clientesApi";
import { useGetAllUsuariosConCajaQuery } from "../../store/services/usuariosApi";
import { useCreateVentaMutation } from "../../store/services/ventasApi";
import { cajaApi, useCloseCajaMutation } from "../../store/services/cajaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import AperturaCajaModal from "../../components/caja/AperturaCajaModal";
import AlertDialog from "../../components/common/AlertDialog";
import SelectVendedorModal from "../../components/venta/SelectedVendedorModal";
import ProcesarPagoModal from "../../components/venta/ProcesarPagoModal";
import SelectClienteModal from "../../components/venta/SelectedClienteModal";
import ProductosRetornablesModal from "../../components/venta/ProductosRetornablesModal";
import PermissionMessage from "../../components/common/PermissionMessage";
import { getFirstRelevantError } from "../../utils/firstError";
import BarraSuperior from "../../components/venta/punto_venta/BarraSuperior";
import CategoriasSelector from "../../components/venta/punto_venta/CategoriasSelector";
import ProductoSearchBar from "../../components/venta/punto_venta/ProductoSearchBar";
import ProductosGrid from "../../components/venta/punto_venta/ProductosGrid";
import CarritoDeCompras from "../../components/venta/punto_venta/CarritoDeCompras";
import useSucursalActiva from "../../hooks/useSucursalActiva";
import { getStockForSucursal } from "../../utils/inventoryUtils";
import SelectCajaModal from "../../components/venta/SelectCajaModal";
import {
  useGetMyPrefsQuery,
  useSaveMyPrefsMutation,
} from "../../store/services/preferencesApi";
import { skipToken } from "@reduxjs/toolkit/query";
import usePOSSelector from "../../utils/usePOSSelector";
import usePOSMemory from "../../hooks/usePosMemory";
import { setCaja } from "../../store/reducers/posSlice";
import { useNavigate } from "react-router";

function useDebouncedValue(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const blurActive = () => {
  const el = document.activeElement;
  if (el && typeof el.blur === "function") el.blur();
};

const PuntoDeVenta = () => {
  const { mode, activeSucursalId } = useSelector((s) => s.scope);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const closingLockRef = useRef(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const botonAbrirPagoRef = useRef(null);

  const [openPagoModal, setOpenPagoModal] = useState(false);
  const [ventaData, setVentaData] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [retornablesConfirmados, setRetornablesConfirmados] = useState(false);

  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [openRetornablesModal, setOpenRetornablesModal] = useState(false);
  const [cajaCerrando, setCajaCerrando] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const [productosRetornables, setProductosRetornables] = useState([]);

  const usuario = useSelector((state) => state.auth);
  const {
    items: cart,
    subtotal,
    impuestos,
    descuento,
    total,
  } = useSelector((state) => state.cart);
  const sucursalActiva = useSucursalActiva();

  const { data: myPrefs } = useGetMyPrefsQuery();
  const [savePrefs] = useSaveMyPrefsMutation();
  const {
    data: vendedores,
    isLoading: loadingVendedores,
    error: errorVendedores,
    refetch: refetchVendedores,
  } = useGetAllUsuariosConCajaQuery();

  const {
    estado,
    seleccionarCaja,
    reloadEstado,
    rol,
    selectedVendedor,
    setSelectedVendedor,
    vendedoresFiltrados,
    cajasParaModal,
    openVendedorModal,
    setOpenVendedorModal,
    openCajaModal,
    setOpenCajaModal,
    openAperturaModal,
    setOpenAperturaModal,
    cajaParaApertura,
    handleSelectVendedor,
    handleSelectCaja,
    handleCajaAbierta,
    isLoading: isPOSLoading,
  } = usePOSSelector({
    mode,
    activeSucursalId,
    vendedoresAll: vendedores,
    myPrefs,
    savePrefs,
  });

  usePOSMemory({
    selectedVendedor,
    setSelectedVendedor,
    estado,
    seleccionarCaja,
  });

  const [createVenta, { isLoading: isCreating }] = useCreateVentaMutation();
  const [closeCaja, { isLoading: isClosing }] = useCloseCajaMutation();

  const [taxRate, setTaxRate] = useState(0);
  const [tipoDocumento, setTipoDocumento] = useState("boleta");
  const [tipoEntrega, setTipoEntrega] = useState("retiro_en_sucursal");
  const [direccionEntrega, setDireccionEntrega] = useState("");
  const [usarDireccionGuardada, setUsarDireccionGuardada] = useState(true);

  const cajaSeleccionada = estado?.cajaSeleccionada;
  const vendedorRut = cajaSeleccionada?.usuario_asignado
    ? cajaSeleccionada?.usuario_asignado
    : cajaSeleccionada?._vendedor?.rut || null;

  const handleBackFromCaja = () => {
    if (rol === "administrador") {
      setOpenCajaModal(false);
      setOpenVendedorModal(true);
      seleccionarCaja(null);
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        setOpenCajaModal(false);
      }
    }
  };

  const sucursalOrigenId = useMemo(() => {
    if (cajaSeleccionada?.id_sucursal) return cajaSeleccionada.id_sucursal;
    if (rol === "administrador") return sucursalActiva?.id_sucursal || null;
    return usuario?.user?.id_sucursal || null;
  }, [
    cajaSeleccionada?.id_sucursal,
    rol,
    sucursalActiva?.id_sucursal,
    usuario?.user?.id_sucursal,
  ]);

  const readyForData =
    !!estado?.cajaSeleccionada?.id_caja && !!sucursalOrigenId;

  const clientesParams = useMemo(() => {
    const base = { page: 1, limit: 200, activo: true };
    if (mode !== "global" && sucursalOrigenId) {
      base.id_sucursal = Number(sucursalOrigenId);
    }
    return base;
  }, [mode, sucursalOrigenId]);

  const { data: clientes, isLoading: loadingClientes } = useGetAllClientesQuery(
    readyForData ? clientesParams : skipToken,
    {
      skip: mode !== "global" && !sucursalOrigenId,
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  useEffect(() => {
    if (rol !== "administrador" || !selectedVendedor) return;

    const rutCajaActual =
      estado?.cajaSeleccionada?._vendedor?.rut ||
      estado?.cajaSeleccionada?.usuario_asignado ||
      null;

    if (rutCajaActual && String(rutCajaActual) === String(selectedVendedor)) {
      return;
    }

    if (!estado?.cajaSeleccionada?.id_caja) return;

    seleccionarCaja(null);
    dispatch(setCaja(null));
    dispatch(clearCart());
    dispatch(cajaApi.util.invalidateTags(["Caja", "CajaUsuario"]));
    reloadEstado?.();
    refetchVendedores?.();
    //eslint-disable-next-line
  }, [
    selectedVendedor,
    rol,
    estado?.cajaSeleccionada?.id_caja,
    estado?.cajaSeleccionada?._vendedor?.rut,
    estado?.cajaSeleccionada?.usuario_asignado,
  ]);

  const armarVentaData = (productosRetornablesSeleccionados = null) => {
    const isFactura = tipoDocumento === "factura";
    const data = {
      id_cliente: selectedCliente,
      id_vendedor: vendedorRut,
      id_caja: cajaSeleccionada.id_caja,
      id_sucursal: sucursalOrigenId,
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
          tipo_defecto: item.tipo_defecto ?? null,
          ...(item.id_insumo_destino != null
            ? { id_insumo_destino: Number(item.id_insumo_destino) }
            : {}),
        }));
      }
    }

    return data;
  };

  const finalizarFlujoVenta = (productosRetornablesSeleccionados = []) => {
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
    }

    if (tipoEntrega === "despacho_a_domicilio") {
      const cliente = clientes?.clientes?.find(
        (c) => Number(c.id_cliente) === Number(selectedCliente)
      );
      const direccionFinal = usarDireccionGuardada
        ? (cliente?.direccion || "").trim()
        : (direccionEntrega || "").trim();

      if (!direccionFinal) {
        dispatch(
          showNotification({
            message:
              "Para envío a domicilio debes indicar una dirección de entrega.",
            severity: "warning",
          })
        );
        return;
      }
    }
    const venta = armarVentaData(productosRetornablesSeleccionados);
    setVentaData(venta);

    setOpenClienteModal(false);
    setOpenRetornablesModal(false);
    setOpenAlert(false);

    if (isFactura) {
      handleConfirmPayment(
        {
          montoPago: null,
          metodoPago: null,
          notas: "Factura emitida, pago pendiente",
          referencia: null,
        },
        venta
      );
    } else {
      blurActive();
      setOpenPagoModal(true);
    }
  };

  const handleProceedToPayment = () => {
    const productosRetornablesEnCarrito = cart.filter(
      (item) => item.es_retornable
    );
    const yaConfirmados =
      retornablesConfirmados || productosRetornables.length > 0;

    if (productosRetornablesEnCarrito.length > 0 && !yaConfirmados) {
      blurActive();
      setProductosRetornables(productosRetornablesEnCarrito);
      setOpenRetornablesModal(true);
      return;
    }

    blurActive();
    finalizarFlujoVenta(productosRetornables);
  };

  const handleConfirmRetornables = (productosSeleccionados) => {
    const productosValidos = (productosSeleccionados || []).filter(
      (p) => p.cantidad > 0
    );
    setProductosRetornables(productosValidos);
    setOpenRetornablesModal(false);
    setRetornablesConfirmados(true);

    finalizarFlujoVenta(productosValidos);
  };

  const handleConfirmPayment = async (
    { montoPago, metodoPago, notas, referencia },
    ventaOverride = null
  ) => {
    const baseVenta = ventaOverride || ventaData;
    if (!baseVenta) return;

    const isFactura = baseVenta.tipo_documento === "factura";

    const ventaFinal = {
      ...baseVenta,
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

    console.log("Venta Final JSON:", ventaFinal);

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
      setRetornablesConfirmados(false);
      setTipoDocumento("boleta");
      setTipoEntrega("retiro_en_sucursal");
      setDireccionEntrega("");
      setUsarDireccionGuardada(true);
      setDiscount(0);
      if (selectedCliente) {
        setSelectedCliente(null);
      }
    } catch (error) {
      console.log(error);
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

  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const debouncedSearch = useDebouncedValue(search, 500);
  const isSearching = search !== debouncedSearch;

  useEffect(() => {
    if (openCajaModal) setOpenAlert(false);
  }, [openCajaModal]);

  useEffect(() => {
    if (estado?.cajaSeleccionada?.id_caja) setOpenAlert(false);
  }, [estado?.cajaSeleccionada?.id_caja]);

  /*********************+*
  
  Reset Retornables

  **************************/
  useEffect(() => {
    if (!cart.some((i) => i.es_retornable)) {
      setRetornablesConfirmados(false);
      setProductosRetornables([]);
    }
  }, [cart]);

  /*   const productosArgs = useMemo(() => {
    if (!readyForData) return null;
    return {
      categoria: category === "all" ? undefined : category,
      search: debouncedSearch,
      page,
      limit: pageSize,
      id_sucursal: sucursalOrigenId,
    };
  }, [
    readyForData,
    category,
    debouncedSearch,
    page,
    pageSize,
    sucursalOrigenId,
  ]); */

  const productosArgs = useMemo(() => {
    if (!readyForData || !sucursalOrigenId) return null;
    return {
      categoria: category === "all" ? undefined : category,
      search: debouncedSearch || undefined,
      page,
      limit: pageSize,
      id_sucursal: Number(sucursalOrigenId),
    };
  }, [
    readyForData,
    category,
    debouncedSearch,
    page,
    pageSize,
    sucursalOrigenId,
  ]);

  const {
    data: productosData,
    isLoading: loadingProductos,
    error: errorProductos,
  } = useGetAvailabreProductosQuery(productosArgs ?? skipToken, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: categoriasProductos,
    isLoading: loadingCategorias,
    error: errorCateogrias,
  } = useGetAllCategoriasQuery();

  const relevantError = getFirstRelevantError(
    errorProductos,
    errorCateogrias,
    usuario?.rol === "administrador" ? errorVendedores : null
  );

  const debeElegirCaja =
    !estado?.cajaSeleccionada?.id_caja && !estado.initializing;

  /**
   *
   * Calculo de subtotales
   *
   */
  useEffect(() => {
    dispatch(calculateTaxes(taxRate));
  }, [subtotal, descuento, taxRate, dispatch]);

  const handleCategoryClick = (c) => {
    setCategory(c);
    setPage(1);
  };
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const sucursalCart = cart[0]?.id_sucursal_origen;
  if (sucursalCart && sucursalCart !== sucursalOrigenId) {
    dispatch(
      showNotification({
        message:
          "No puedes mezclar productos de distintas sucursales en la misma venta.",
        severity: "info",
      })
    );
    return;
  }

  const handleAddToCart = (product) => {
    const stockDisponible = getStockForSucursal(
      product.inventario,
      sucursalOrigenId
    );

    const qtyEnCarrito = cart
      .filter(
        (i) =>
          i.id_producto === product.id_producto &&
          i.id_sucursal_origen === sucursalOrigenId
      )
      .reduce((s, i) => s + i.cantidad, 0);

    if (qtyEnCarrito + 1 > stockDisponible) {
      dispatch(
        showNotification({
          message: "No hay stock suficiente en la sucursal seleccionada.",
          severity: "warning",
        })
      );
      return;
    }
    dispatch(
      addItem({
        id_producto: product.id_producto,
        nombre: product.nombre_producto,
        precio_unitario: parseFloat(product.precio),
        cantidad: 1,
        descuento_porcentaje: 0,
        es_retornable: product.es_retornable,
        id_insumo_retorno: product.id_insumo_retorno || null,
        tipo: product.tipo || "producto",
        id_sucursal_origen: sucursalOrigenId,
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

    const item = cart.find(
      (i) => i.id_producto === id_producto && i.tipo === tipo
    );
    if (item) {
      const stockDisponible = getStockForSucursal(
        (productosData?.productos || []).find(
          (p) => p.id_producto === id_producto
        )?.inventario,
        item.id_sucursal_origen
      );
      if (cantidad > stockDisponible) {
        dispatch(
          showNotification({
            message: "Cantidad supera el stock disponible en la sucursal.",
            severity: "warning",
          })
        );
        return;
      }
    }

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
    blurActive();
    setOpenAlert(true);
  };

  const handleCerrarCaja = async () => {
    const cajaId = estado?.cajaSeleccionada?.id_caja;
    if (!cajaId || closingLockRef.current) return;

    closingLockRef.current = true;
    setCajaCerrando(true);
    setOpenAlert(false);

    try {
      // 1) Llamada al backend
      await closeCaja({ idCaja: cajaId }).unwrap();

      // 2) Invalidar cachés relacionadas (sin depender de arg)
      //    Nota: aunque closeCaja ya invalide, aquí forzamos por seguridad.
      dispatch(cajaApi.util.invalidateTags(["Caja", "CajaUsuario"]));

      // 3) Refrescar estado del hook (asignadas + estado)
      await Promise.all([reloadEstado?.(), refetchVendedores?.()]);

      // 4) Limpiar selección de caja en UI + store + memoria local
      seleccionarCaja(null);
      dispatch(setCaja(null));
      try {
        const raw = localStorage.getItem("posSelection:v1");
        if (raw) {
          const parsed = JSON.parse(raw);
          localStorage.setItem(
            "posSelection:v1",
            JSON.stringify({ ...parsed, caja: null, ts: Date.now() })
          );
        }
      } catch {
        /* noop */
      }

      // 5) UI feedback
      dispatch(
        showNotification({
          message: "Caja cerrada exitosamente",
          severity: "success",
        })
      );
      setOpenCajaModal(true); // deja visible el selector para abrir otra caja
    } catch (error) {
      // Si ya estaba cerrada, tratamos como éxito (idempotente)
      const msg =
        error?.data?.error ||
        error?.data?.message ||
        error?.message ||
        String(error);
      const yaCerrada = /ya está cerrada/i.test(msg);
      if (yaCerrada) {
        dispatch(cajaApi.util.invalidateTags(["Caja", "CajaUsuario"]));
        await Promise.all([reloadEstado?.(), refetchVendedores?.()]);
        seleccionarCaja(null);
        dispatch(setCaja(null));
        dispatch(
          showNotification({
            message: "La caja ya estaba cerrada",
            severity: "info",
          })
        );
        setOpenCajaModal(true);
      } else {
        console.error("Error al cerrar la caja:", error);
        dispatch(
          showNotification({
            message: `Error al cerrar la caja: ${msg}`,
            severity: "error",
          })
        );
      }
    } finally {
      setCajaCerrando(false);
      closingLockRef.current = false;
    }
  };

  if (!["vendedor", "administrador"].includes(usuario?.rol)) {
    return (
      <Typography>No tienes permiso para acceder al Punto de Venta.</Typography>
    );
  }

  if (usuario?.rol === "vendedor" && !estado.cajasAsignadas?.length) {
    return <Typography>No tienes una caja asignada.</Typography>;
  }

  if (
    usuario?.rol === "administrador" &&
    selectedVendedor &&
    estado?.fechaInvalida
  ) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h5" color="error">
          ⚠️ No puedes abrir esta caja porque la fecha de apertura no coincide
          con el día de hoy.
        </Typography>
        <Typography variant="body1" mt={1}>
          Selecciona un vendedor con una caja válida para continuar.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 3,
            backgroundColor: "#007AFF",
            fontSize: "1.1rem",
            fontWeight: "bold",
            padding: "10px 20px",
            "&:hover": { backgroundColor: "#005BB5" },
          }}
          onClick={() => window.location.reload()}
        >
          Volver a seleccionar vendedor
        </Button>
      </Box>
    );
  }

  if (
    isPOSLoading ||
    loadingProductos ||
    loadingCategorias ||
    loadingClientes ||
    (rol === "administrador" && loadingVendedores)
  ) {
    return <LoaderComponent />;
  }

  if (relevantError.type === "permission") {
    return <PermissionMessage requiredPermission={relevantError.permission} />;
  } else if (relevantError.type === "generic") {
    return <Typography color="error">{relevantError.message}</Typography>;
  }

  const isFactura = tipoDocumento === "factura";

  return (
    <Box p={3} mb={3}>
      {debeElegirCaja && !openCajaModal && (
        <Typography>Selecciona una caja para continuar.</Typography>
      )}
      <BarraSuperior
        selectedVendedor={selectedVendedor}
        onSelectVendedor={() => {
          blurActive();
          setOpenAlert(false);
          setOpenVendedorModal(true);
        }}
        selectedCliente={selectedCliente}
        onSelectCliente={() => {
          blurActive();
          setOpenClienteModal(true);
        }}
        tipoDocumento={tipoDocumento}
        onChangeTipoDocumento={setTipoDocumento}
        tipoEntrega={tipoEntrega}
        onChangeTipoEntrega={setTipoEntrega}
        direccionEntrega={direccionEntrega}
        onChangeDireccionEntrega={setDireccionEntrega}
        usarDireccionGuardada={usarDireccionGuardada}
        onChangeUsarDireccionGuardada={setUsarDireccionGuardada}
        onCerrarCaja={confirmAlert}
        cajaAbierta={estado.cajaAbierta}
        cajaSeleccionada={estado.cajaSeleccionada}
        clientes={clientes}
        isClosing={isClosing}
        cajaCerrando={cajaCerrando}
        theme={theme}
        rol={rol}
      />
      <CategoriasSelector
        categorias={categoriasProductos}
        categoriaSeleccionada={category}
        onCategoriaClick={handleCategoryClick}
      />
      <ProductoSearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {!debeElegirCaja && (
        <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}>
          <ProductosGrid
            productos={productosData?.productos}
            loading={loadingProductos}
            isSearching={isSearching}
            page={page}
            totalPages={productosData?.pagination?.totalPages ?? 1}
            onPageChange={(event, value) => setPage(value)}
            onAddToCart={handleAddToCart}
            sucursalId={sucursalOrigenId}
          />
          <Box
            width={isMobile ? "100%" : "75%"}
            maxWidth={"100%"}
            mt={isMobile ? 3 : 0}
          >
            <CarritoDeCompras
              cart={cart}
              subtotal={subtotal}
              descuento={descuento}
              impuestos={impuestos}
              total={total}
              discount={discount}
              taxRate={taxRate}
              onRemove={handleRemoveFromCart}
              onQuantityChange={handleQuantityChange}
              onPriceChange={handlePriceChange}
              onTaxRateChange={handleTaxRateChange}
              onDiscountChange={handleDiscountChange}
              onProceedToPayment={handleProceedToPayment}
              productosRetornables={productosRetornables}
              refButton={botonAbrirPagoRef}
              ctaLabel={isFactura ? "Confirmar venta" : "Proceder al pago"}
            />
          </Box>
        </Box>
      )}

      <SelectVendedorModal
        open={openVendedorModal}
        onClose={() => setOpenVendedorModal(false)}
        vendedores={vendedoresFiltrados}
        selectedVendedor={selectedVendedor}
        onSelect={handleSelectVendedor}
      />
      <SelectCajaModal
        open={openCajaModal}
        onBack={handleBackFromCaja}
        onClose={() => {
          setOpenAlert(false);
          setOpenCajaModal(false);
        }}
        cajas={cajasParaModal}
        onSelect={handleSelectCaja}
        usuario={usuario}
        vendedor={selectedVendedor}
        isAdmin={rol === "administrador"}
      />

      <SelectClienteModal
        open={openClienteModal}
        onClose={() => setOpenClienteModal(false)}
        clientes={clientes || []}
        selectedCliente={selectedCliente}
        onSelect={setSelectedCliente}
        idSucursal={mode !== "global" ? sucursalOrigenId : undefined}
      />
      <AlertDialog
        openAlert={
          openAlert &&
          !!estado?.cajaSeleccionada?.id_caja &&
          estado?.cajaAbierta
        }
        onCloseAlert={() => setOpenAlert(false)}
        onConfirm={handleCerrarCaja}
        title="Confirmar Cierre de Caja"
        message="¿Estás seguro de que deseas cerrar la caja?"
      />
      <ProductosRetornablesModal
        open={openRetornablesModal}
        onClose={() => setOpenRetornablesModal(false)}
        productos={productosRetornables}
        onConfirm={handleConfirmRetornables}
        isFactura={isFactura}
      />
      <ProcesarPagoModal
        open={openPagoModal && !isFactura}
        onClose={handleClosePagoModal}
        onConfirm={handleConfirmPayment}
        total={total}
        metodosPago={[
          { id: 1, nombre: "Efectivo" },
          { id: 2, nombre: "Tarjeta crédito" },
          { id: 3, nombre: "Tarjeta débito" },
          { id: 4, nombre: "Transferencia" },
        ]}
        isLoading={isCreating}
      />
      <AperturaCajaModal
        open={openAperturaModal}
        caja={cajaParaApertura}
        onClose={() => setOpenAperturaModal(false)}
        onCajaAbierta={handleCajaAbierta}
      />
    </Box>
  );
};

export default PuntoDeVenta;
