import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Pagination,
  Paper,
  MenuItem,
  Checkbox,
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

import ProductCard from "../../components/venta/ProductCard";
import LoaderComponent from "../../components/common/LoaderComponent";
import ShoppingCartItem from "../../components/venta/ShoppingCartItem";
import { SearchOutlined } from "@mui/icons-material";
import { useGetAvailabreProductosQuery } from "../../store/services/productoApi";
import TotalsDisplay from "../../components/venta/TotalDisplay";
import { useGetAllCategoriasQuery } from "../../store/services/categoriaApi";
import CategoryBlock from "../../components/venta/CategoryBlock";
import AperturaCajaModal from "../../components/caja/AperturaCajaModal";
import useVerificarCaja from "../../utils/useVerificationCaja";
import { useCloseCajaMutation } from "../../store/services/cajaApi";
import { showNotification } from "../../store/reducers/notificacionSlice";
import AlertDialog from "../../components/common/AlertDialog";
import CajaInfo from "../../components/caja/CajaInfo";
import { useGetAllVendedoresQuery } from "../../store/services/usuariosApi";
import SelectVendedorModal from "../../components/venta/SelectedVendedorModal";
import ProcesarPagoModal from "../../components/venta/ProcesarPagoModal";
import { useGetAllClientesQuery } from "../../store/services/clientesApi";
import SelectClienteModal from "../../components/venta/SelectedClienteModal";
import { useCreateVentaMutation } from "../../store/services/ventasApi";
import ProductosRetornablesModal from "../../components/venta/ProductosRetornablesModal";

const PuntoDeVenta = () => {
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
  const [cajaAbierta, setCajaAbierta] = useState(false);
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
      id_metodo_pago: null,
      notas: "",
      tipo_documento: tipoDocumento,
      pago_recibido: null,
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
    const productosRetornablesEnCarrito = cart.filter(
      (item) => item.es_retornable
    ); // 🔹 Filtrar
    if (productosRetornablesEnCarrito.length > 0) {
      setProductosRetornables(productosRetornablesEnCarrito);
      setOpenRetornablesModal(true);
    } else {
      setVentaData(armarVentaData());
      setOpenPagoModal(true);
    }
  };

  const handleConfirmRetornables = (productosSeleccionados) => {
    const productosValidos = productosSeleccionados.filter(
      (p) => p.cantidad > 0
    );
    setProductosRetornables(productosValidos);
    setVentaData(armarVentaData(productosValidos));
    setOpenRetornablesModal(false);
    setOpenPagoModal(true);
  };

  const handleConfirmPayment = async ({
    montoPago,
    metodoPago,
    notas,
    referencia,
  }) => {
    if (!ventaData) return;

    const ventaFinal = {
      ...ventaData,
      id_metodo_pago: metodoPago,
      notas,
      pago_recibido: montoPago,
      ...(metodoPago !== "Efectivo" && { referencia }),
    };

    console.log("Venta Final JSON:", ventaFinal);

    try {
      dispatch(calculateTaxes(taxRate));
      await createVenta(ventaFinal);
      dispatch(clearCart());
      dispatch(
        showNotification({
          message: "Venta creada éxitosamente",
          severity: "success",
        })
      );
      setOpenPagoModal(false);
      // 🔹 LIMPIEZA DE ESTADOS RELACIONADOS A LA VENTA
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
          severity: "success",
        })
      );
    }
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

    const cajaSeleccionada = vendedores?.find((v) => v.rut === rut)?.cajasAsignadas[0];


    /* if (cajaSeleccionada && !isCajaDeHoy(cajaSeleccionada.fecha_apertura)) {
      alert("⚠️ La caja seleccionada no es del día de hoy. Elige otra.");
      return;
    } */

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

  const handleCajaAbierta = () => {
    setCajaAbierta(true);
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

  const handleClose = () => {
    setCajaAbierta(false);
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
      // Usa la caja propia (para rol vendedor)
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
      setCajaAbierta(false);
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

  if (usuario?.rol === "vendedor" && !cajaAbierta) {
    return (
      <AperturaCajaModal
        caja={estado.asignada}
        onCajaAbierta={handleCajaAbierta}
        onClose={handleClose}
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

        {/* 🔹 Botón para refrescar la página */}
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
        onCajaAbierta={handleCajaAbierta}
        onClose={handleClose}
      />
    );
  }

  // Manejo de carga de datos y errores
  if (
    isLoading ||
    loadingProductos ||
    loadingCategorias ||
    loadingClientes ||
    (usuario?.rol !== "administrador" && loadingVendedores)
  ) {
    return <LoaderComponent />;
  }

  if (
    error ||
    errorProductos ||
    errorCateogrias ||
    (usuario?.rol === "administrador" && errorVendedores)
  ) {
    return <Typography>Error al cargar datos.</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h2" mb={2} fontWeight={"600"}>
        Punto de Venta
      </Typography>
      <SelectVendedorModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        vendedores={vendedores || []}
        selectedVendedor={selectedVendedor}
        onSelect={handleSelectVendedor}
      />

      {/* Botón para cerrar caja */}
      {estado.cajaAbierta && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#D32F2F",
              color: "#fff",
              "&:hover": { backgroundColor: "#B71C1C" },
              borderWidth: 0,
              ":focus": {
                outline: "none",
                boxShadow: "none",
              },
              ":active": {
                outline: "none",
                boxShadow: "none",
              },
              fontSize: "1rem",
            }}
            onClick={() => confirmAlert()}
            disabled={cajaCerrando || isClosing}
          >
            {cajaCerrando || isClosing ? "Cerrando..." : "Cerrar Caja"}
          </Button>
        </Box>
      )}
      {estado?.asignada && estado?.cajaAbierta ? (
        <CajaInfo caja={estado.asignada} />
      ) : (
        <Typography variant="subtitle1" color="textSecondary">
          No hay caja abierta actualmente.
        </Typography>
      )}
      <Box mb={3}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setOpenClienteModal(true)}
          sx={{
            backgroundColor: "#007AFF",
            color: "white",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#005BB5" },
            borderWidth: 0,
            ":focus": {
              outline: "none",
              boxShadow: "none",
            },
            ":active": {
              outline: "none",
              boxShadow: "none",
            },
            fontSize: "1rem",
          }}
        >
          {selectedCliente
            ? `Cliente: ${
                clientes?.clientes?.find(
                  (c) => c.id_cliente === selectedCliente
                )?.nombre || "Desconocido"
              }`
            : "Seleccionar Cliente"}
        </Button>
      </Box>

      <SelectClienteModal
        open={openClienteModal}
        onClose={() => setOpenClienteModal(false)}
        clientes={clientes || []}
        selectedCliente={selectedCliente}
        onSelect={setSelectedCliente}
      />
      <Box mb={3}>
        <Typography variant="h6">Tipo de Documento</Typography>
        <TextField
          select
          fullWidth
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
          variant="outlined"
          sx={{ mt: 1 }}
        >
          <MenuItem value="boleta">Boleta</MenuItem>
          <MenuItem value="factura">Factura</MenuItem>
        </TextField>
      </Box>
      <Box mb={3}>
        <Typography variant="h6">Tipo de Entrega</Typography>
        <TextField
          select
          fullWidth
          value={tipoEntrega}
          onChange={(e) => setTipoEntrega(e.target.value)}
          variant="outlined"
          sx={{ mt: 1 }}
        >
          <MenuItem value="retiro_en_sucursal">Retiro en Sucursal</MenuItem>
          <MenuItem value="despacho_a_domicilio">Envío a Domicilio</MenuItem>
        </TextField>
      </Box>

      {tipoEntrega === "despacho_a_domicilio" && (
        <Box mb={3}>
          <Typography variant="h6">Dirección de Entrega</Typography>

          <Box display="flex" alignItems="center" mb={1}>
            <Checkbox
              checked={usarDireccionGuardada}
              onChange={(e) => setUsarDireccionGuardada(e.target.checked)}
            />
            <Typography>
              Usar dirección guardada:{" "}
              <strong>
                {clientes?.clientes?.find(
                  (c) => c.id_cliente === selectedCliente
                )?.direccion || "No registrada"}
              </strong>
            </Typography>
          </Box>

          {!usarDireccionGuardada && (
            <TextField
              fullWidth
              label="Ingrese otra dirección"
              value={direccionEntrega}
              onChange={(e) => setDireccionEntrega(e.target.value)}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      )}
      {/* Categorías */}
      <Box mb={3}>
        <Typography variant="h6" mb={2}>
          Selecciona categoría
        </Typography>
        <Grid container spacing={2}>
          {/* Categoría "Todo" */}
          <Grid item>
            <CategoryBlock
              category="Todo"
              isSelected={category === "all"}
              onClick={() => handleCategoryClick("all")}
            />
          </Grid>
          {/* Categorías dinámicas */}
          {categoriasProductos?.map((categoria) => (
            <Grid item key={categoria.id_categoria}>
              <CategoryBlock
                category={categoria.nombre_categoria}
                isSelected={category === categoria.nombre_categoria}
                onClick={() => handleCategoryClick(categoria.nombre_categoria)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Filtros de búsqueda */}
      <Box mb={3}>
        <TextField
          label="Buscar producto"
          variant="outlined"
          sx={{ fontSize: "1rem" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box display={"flex"} gap={2}>
        <Box width={"100%"} maxHeight={"100%"}>
          {/* Estado de búsqueda */}
          {isSearching && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={3}
              fontSize="1rem"
            >
              <CircularProgress />
              <Typography ml={2} fontSize="1rem">
                Buscando productos...
              </Typography>
            </Box>
          )}
          {/* Productos */}
          {!loadingProductos && productosData?.productos.length > 0 ? (
            <>
              <Grid container spacing={1} mb={3}>
                {productosData?.productos?.map((product) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    key={product.id_producto}
                  >
                    <ProductCard
                      product={{
                        ...product,
                        precio: parseFloat(product.precio || 0),
                      }}
                      onAddToCart={handleAddToCart}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Paginación */}
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={
                    productosData?.paginacion?.totalPages ||
                    Math.ceil(productosData.paginacion.totalItems / pageSize)
                  }
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <Typography>No se encontraron productos.</Typography>
          )}
        </Box>
        <Box width={"75%"} maxWidth={"100%"}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              p: 2,
              backgroundColor: "#fff",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              mb={2}
              textAlign="center"
            >
              🛒 Carrito de Compras
            </Typography>
            <Box mb={1} maxHeight="300px" overflow="auto">
              {cart.map((item) => (
                <ShoppingCartItem
                  key={item.id_producto}
                  item={item}
                  onRemove={handleRemoveFromCart}
                  onQuantityChange={handleQuantityChange}
                  onPriceChange={handlePriceChange}
                />
              ))}
            </Box>
            <Box>
              <TotalsDisplay
                subtotal={subtotal}
                descuento={descuento || 0}
                impuestos={impuestos}
                total={total}
                discount={discount || 0}
                taxRate={taxRate || 0}
                onTaxRateChange={handleTaxRateChange}
                onDiscountChange={handleDiscountChange}
                onProceedToPayment={handleProceedToPayment}
                productosRetornables={productosRetornables}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
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
        onClose={() => setOpenPagoModal(false)}
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
