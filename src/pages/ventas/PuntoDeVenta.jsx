import { useState, useEffect, useRef } from "react";
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
import { useGetAllVendedoresQuery } from "../../store/services/usuariosApi";
import { useCreateVentaMutation } from "../../store/services/ventasApi";
import { useCloseCajaMutation } from "../../store/services/cajaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import LoaderComponent from "../../components/common/LoaderComponent";
import AperturaCajaModal from "../../components/caja/AperturaCajaModal";
import useVerificarCaja from "../../utils/useVerificationCaja";
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
import PuntoDeVentaMobile from "../../components/venta/punto_venta/PuntoDeVentaMobile";

const PuntoDeVenta = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const botonAbrirPagoRef = useRef(null);
  const [openPagoModal, setOpenPagoModal] = useState(false);
  const [ventaData, setVentaData] = useState(null);
  const [selectedVendedor, setSelectedVendedor] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openRetornablesModal, setOpenRetornablesModal] = useState(false);
  const [productosRetornables, setProductosRetornables] = useState([]);

  const {
    data: vendedores,
    isLoading: loadingVendedores,
    error: errorVendedores,
  } = useGetAllVendedoresQuery();
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [openClienteModal, setOpenClienteModal] = useState(false);
  const { data: clientes, isLoading: loadingClientes } =
    useGetAllClientesQuery();

  const [createVenta, { isLoading: isCreating }] = useCreateVentaMutation();

  const { estado, isLoading, error } = useVerificarCaja(selectedVendedor);
  const usuario = useSelector((state) => state.auth);
  const [cajaCerrando, setCajaCerrando] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const [taxRate, setTaxRate] = useState(0);

  const [tipoDocumento, setTipoDocumento] = useState("boleta");
  const [tipoEntrega, setTipoEntrega] = useState("retiro_en_sucursal");
  const [direccionEntrega, setDireccionEntrega] = useState("");
  const [usarDireccionGuardada, setUsarDireccionGuardada] = useState(true);

  const dispatch = useDispatch();

  const {
    items: cart,
    subtotal,
    impuestos,
    descuento,
    total,
  } = useSelector((state) => state.cart);

  const [closeCaja, { isLoading: isClosing }] = useCloseCajaMutation();

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

  const handleConfirmRetornables = (productosSeleccionados) => {
    const productosValidos = productosSeleccionados.filter(
      (p) => p.cantidad > 0
    );
    setProductosRetornables(productosValidos);
    const venta = armarVentaData(productosValidos);
    setVentaData(venta);

    setOpenRetornablesModal(false);

    if (tipoDocumento === "factura") {
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);

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

  useEffect(() => {
    if (usuario?.rol === "administrador" && !selectedVendedor) {
      setOpenModal(true);
    }
  }, [usuario, selectedVendedor]);

  useEffect(() => {
    dispatch(calculateTaxes(taxRate));
  }, [subtotal, descuento, taxRate, dispatch]);

  useEffect(() => {
    refetch();
  }, [category, refetch]);

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
      console.error("Error al cerrar la caja:", error);
      setCajaCerrando(false);
      dispatch(
        showNotification({
          message: `Error al cerrar la caja ${error}`,
          severity: "success",
        })
      );
    }
  };

  if (usuario?.rol === "vendedor" && !estado?.cajaAbierta) {
    return (
      <AperturaCajaModal
        caja={estado.asignada}
        onCajaAbierta={() => {}}
        onClose={() => {}}
      />
    );
  }

  if (selectedVendedor && estado.fechaInvalida) {
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

  if (!["vendedor", "administrador"].includes(usuario?.rol)) {
    return (
      <Typography>No tienes permiso para acceder al Punto de Venta.</Typography>
    );
  }

  if (usuario?.rol === "vendedor" && !estado.asignada) {
    return <Typography>No tienes una caja asignada.</Typography>;
  }

  if (!estado.isLoading && estado.asignada && estado.cajaListaParaAbrir) {
    return (
      <AperturaCajaModal
        caja={estado.asignada}
        onCajaAbierta={() => {}}
        onClose={() => {}}
      />
    );
  }

  if (
    isLoading ||
    loadingProductos ||
    loadingCategorias ||
    loadingClientes ||
    (usuario?.rol !== "administrador" && loadingVendedores)
  ) {
    return <LoaderComponent />;
  }

  if (relevantError.type === "permission") {
    return <PermissionMessage requiredPermission={relevantError.permission} />;
  } else if (relevantError.type === "generic") {
    return <Typography color="error">{relevantError.message}</Typography>;
  }

  if (isMobile) {
    return <PuntoDeVentaMobile />;
  }

  return (
    <Box p={3} mb={3}>
      <BarraSuperior
        selectedVendedor={selectedVendedor}
        onSelectVendedor={() => setOpenModal(true)}
        selectedCliente={selectedCliente}
        onSelectCliente={() => setOpenClienteModal(true)}
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
        cajaAsignada={estado.asignada}
        clientes={clientes}
        isClosing={isClosing}
        cajaCerrando={cajaCerrando}
        theme={theme}
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

      <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}>
        <ProductosGrid
          productos={productosData?.productos}
          loading={loadingProductos}
          isSearching={isSearching}
          page={page}
          totalPages={
            productosData?.paginacion?.totalPages ||
            Math.ceil(productosData.paginacion.totalItems / pageSize)
          }
          onPageChange={(event, value) => setPage(value)}
          onAddToCart={handleAddToCart}
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
          />
        </Box>
      </Box>
      <SelectVendedorModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        vendedores={vendedores || []}
        selectedVendedor={selectedVendedor}
        onSelect={handleSelectVendedor}
      />
      <SelectClienteModal
        open={openClienteModal}
        onClose={() => setOpenClienteModal(false)}
        clientes={clientes || []}
        selectedCliente={selectedCliente}
        onSelect={setSelectedCliente}
      />
      <AlertDialog
        openAlert={openAlert}
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
      />
      <ProcesarPagoModal
        open={openPagoModal}
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
    </Box>
  );
};

export default PuntoDeVenta;
