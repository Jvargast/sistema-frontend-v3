export const routeToTabInfo = {
  dashboard: { label: "Dashboard", icon: "HomeOutlined" },
  "punto-venta": { label: "Punto de Venta", icon: "ShoppingCartOutlined" },
  "punto-pedido": { label: "Punto Pedido", icon: "ShoppingCartOutlined" },
  "punto-cotizacion": {
    label: "Punto Cotización",
    icon: "RequestQuoteOutlined",
  },
  pagos: { label: "Pagos", icon: "PaymentOutlined" },
  facturas: { label: "Facturas", icon: "ReceiptOutlined" },
  "admin-pedidos": {
    label: "Gestión de Pedidos",
    icon: "ShoppingCartOutlined",
  },

  "admin/ventas": { label: "Ventas", icon: "AttachMoneyOutlined" },
  "admin/pedidos": { label: "Pedidos", icon: "ShoppingCartOutlined" },
  "admin/cotizaciones": { label: "Cotizaciones", icon: "RequestQuoteOutlined" },
  "admin/analisis": { label: "Análisis", icon: "AnalyticsOutlined" },
  "admin/seguridad": { label: "Seguridad", icon: "SecurityOutlined" },
  "admin/cajas": { label: "Cajas", icon: "AccountBalanceOutlined" },
  "admin/viajes": { label: "Admin Viajes", icon: "AdminPanelSettingsOutlined" },
  "admin/agendas": { label: "Agendas", icon: "CalendarTodayOutlined" },
  "admin/usuarios": { label: "Usuarios", icon: "PeopleOutlined" },
  "admin/roles": { label: "Roles", icon: "SecurityOutlined" },
  "admin/empresa": { label: "Empresa", icon: "BusinessOutlined" },
  "admin/gastos": { label: "Gastos", icon: "ReceiptLongOutlined" },
  "admin/proveedores": { label: "Proveedores", icon: "PeopleOutlined" },
  "admin/compras": { label: "Compras", icon: "ShoppingCartOutlined" },
  "admin/ordenes-pago": {
    label: "Órdenes de Pago",
    icon: "RequestQuoteOutlined",
  },
  "admin/ordenes-pago/crear": {
    label: "Nueva Orden de Pago",
    icon: "ReceiptLongOutlined",
  },
  "admin/ordenes-pago/abono": {
    label: "Registrar Abono",
    icon: "PaymentOutlined",
  },

  clientes: { label: "Clientes", icon: "PeopleOutlined" },
  categorias: { label: "Categorías", icon: "CategoryOutlined" },
  "tipo-insumo": { label: "Tipo Insumo", icon: "InventoryOutlined" },
  productos: { label: "Productos", icon: "Inventory2Outlined" },
  produccion: { label: "Producción", icon: "PrecisionManufacturingOutlined" },
  formulas: { label: "Fórmulas", icon: "ScienceOutlined" },
  insumos: { label: "Insumos", icon: "InventoryOutlined" },
  camiones: { label: "Camiones", icon: "LocalShippingOutlined" },
  "inventario-camion": {
    label: "Gestión de Retorno",
    icon: "InventoryOutlined",
  },
  viajes: { label: "Viajes", icon: "TripOriginOutlined" },
  misventas: { label: "Mis Ventas", icon: "PersonOutlined" },
  "ventas-chofer": { label: "Ventas Chofer", icon: "LocalShippingOutlined" },
  "agenda-carga": { label: "Agenda Carga", icon: "EventOutlined" },
  "compras-crear": { label: "Nueva Compra", icon: "ShoppingCartOutlined" },
  "gastos-crear": { label: "Registrar Gasto", icon: "AttachMoneyOutlined" },
  "proveedor-crear": { label: "Nuevo Proveedor", icon: "PeopleOutlined" },
  "categorias-gastos": {
    label: "Categorías Gastos",
    icon: "CategoryOutlined",
  },
  "centros-costo": { label: "Centros de Costo", icon: "MapOutlined" },
  miperfil: { label: "Mi Perfil", icon: "AccountCircleOutlined" },
  admin: { label: "Administración", icon: "AdminPanelSettingsOutlined" },
};

export const mainTabPaths = Object.keys(routeToTabInfo);

export const routerOnlyPaths = [
  "clientes/crear",
  "clientes/ver",
  "clientes/editar",
  "productos/ver",
  "productos/editar",
  "usuarios/editar",
  "roles/editar",
  "empresa/editar",
  "insumos/ver",
  "insumos/editar",
  "ventas/ver",
  "pagos/ver",
  "facturas/ver",
  "pedidos/ver",
  "cotizaciones/ver",
  "formulas/ver",
  "formulas/crear",
  "produccion/ver",
  "agendas/ver",
  "ventas-chofer/ver",
  "produccion/historial",
];

export const shouldUseRouterPath = (path) => {
  const p = (path || "").replace(/^\/+/, "");
  if (routerOnlyPaths.some((pref) => p.startsWith(pref))) return true;
  if (/(^|\/)(ver|editar|crear)(\/|$)/.test(p)) return true;
  const segs = p.split("/").filter(Boolean);
  if (p.startsWith("admin/")) return segs.length > 2;
  return segs.length > 1;
};
