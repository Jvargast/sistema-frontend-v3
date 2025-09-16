import {
  AdminPanelSettingsOutlined,
  CategoryOutlined,
  ChecklistOutlined,
  Groups2Outlined,
  HomeOutlined,
  MapOutlined,
  /* PieChartOutlined, */ PointOfSaleOutlined,
  ReceiptLongOutlined,
  ShoppingCartOutlined,
  /* TrendingUpOutlined, */ WarehouseOutlined,
} from "@mui/icons-material";
import EventIcon from "@mui/icons-material/Event";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import BuildIcon from "@mui/icons-material/Build";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
export const modulesData = [
  {
    name: "Dashboard",
    icon: <HomeOutlined />,
    path: "dashboard",
    permission: "vistas.dashboard.ver",
    children: null,
  },
  {
    name: "Modulo Ventas",
    icon: null,
    permission: "vistas.puntoventa.ver",
    children: [
      {
        text: "Facturas",
        icon: <ReceiptLongOutlined />,
        path: "facturas",
        permission: "vistas.facturas.ver",
      },
      {
        text: "Pagos",
        icon: <PaymentOutlinedIcon />,
        path: "pagos",
        permission: "vistas.pagos.ver",
      },
      {
        text: "Cotizaciones",
        icon: <RequestQuoteOutlinedIcon />,
        path: "punto-cotizacion",
        permission: "vistas.puntocotizacion.ver",
      },
      {
        text: "Pedidos",
        icon: <ShoppingCartOutlined />,
        path: "punto-pedido",
        permission: "vistas.pedidos.ver",
      },
      {
        text: "POS",
        icon: <PointOfSaleOutlined />,
        path: "punto-venta",
        permission: "vistas.puntoventa.ver",
      },
      {
        text: "Clientes",
        icon: <Groups2Outlined />,
        path: "clientes",
        permission: "vistas.clientes.ver",
      },
    ],
  },
  {
    name: "Modulo Inventario",
    permission: "vistas.productos.ver",
    children: [
      {
        text: "Productos",
        icon: <Inventory2OutlinedIcon />,
        path: "productos",
        permission: "vistas.productos.ver",
      },
      {
        text: "Insumos",
        icon: <WarehouseOutlined />,
        path: "insumos",
        permission: "vistas.insumos.ver",
      },
      {
        text: "Categorias",
        icon: <CategoryOutlined />,
        path: "categorias",
        permission: "vistas.categorias.ver",
      },
      {
        text: "Tipos de Insumos",
        icon: <ConstructionOutlinedIcon />,
        path: "tipo-insumo",
        permission: "vistas.tipoinsumos.ver",
      },
      {
        text: "Fórmulas",
        icon: <BuildIcon />,
        path: "formulas",
        permission: "vistas.productos.ver",
      },
      {
        text: "Producción",
        icon: <ProductionQuantityLimitsOutlinedIcon />,
        path: "produccion",
        permission: "vistas.productos.ver",
      },
    ],
  },
  {
    name: "Modulo Entregas",
    permission: "vistas.entregas.ver",
    children: [
      {
        text: "Gestión de Pedidos",
        icon: <ChecklistOutlined />,
        path: "admin-pedidos",
        permission: "vistas.adminpedidos.ver",
      },
      {
        text: "Gestión Camiones",
        icon: <LocalShippingOutlinedIcon />,
        path: "camiones",
        permission: "vistas.camiones.ver",
      },
      {
        text: "Gestión de Retorno",
        icon: <Inventory2OutlinedIcon />,
        path: "inventario-camion",
        permission: "vistas.camiones.ver",
      },
      {
        text: "Agenda Carga",
        icon: <EventIcon />,
        path: "agenda-carga",
        permission: "vistas.agendaCarga.crear",
      },
      {
        text: "Agenda Viajes",
        icon: <MapOutlined />,
        path: "viajes",
        permission: "vistas.viajes.ver",
      },
      {
        text: "Mis Pedidos",
        icon: <AssignmentOutlinedIcon />,
        path: "mis-pedidos",
        permission: "vistas.mispedidos.ver",
      },
      {
        text: "Mis Ventas",
        icon: <AttachMoneyOutlinedIcon />,
        path: "misventas",
        permission: "vistas.mispedidos.ver",
      },
    ],
  },
  /* {
    name: "Modulo Analytics",
    permission: "vistas.analisis.ver",
    children: [
      {
        text: "Estadisticas",
        icon: <PieChartOutlined />,
        path: "estadisticas",
        permission: "vistas.analisis.ver",
      },
    ],
  }, */
  {
    name: "Modulo Compras",
    permission: "vistas.admin.ver",
    children: [
      {
        text: "Nueva Compra",
        icon: <ShoppingCartOutlined />,
        path: "compras-crear",
        permission: "vistas.admin.ver" /* recomendado: vistas.compras.crear */,
      },
      {
        text: "Registrar Gasto",
        icon: <AttachMoneyOutlinedIcon />,
        path: "gastos-crear",
        permission: "vistas.admin.ver" /* recomendado: vistas.gastos.crear */,
      },
      {
        text: "Nuevo Proveedor",
        icon: <Groups2Outlined />,
        path: "proveedor-crear",
        permission:
          "vistas.admin.ver" /* recomendado: vistas.proveedores.crear */,
      },
      {
        text: "Categorías de Gastos",
        icon: <CategoryOutlined />,
        path: "categorias-gastos",
        permission:
          "vistas.admin.ver" /* recomendado: vistas.categoriasgasto.crear */,
      },
      {
        text: "Centros de Costo",
        icon: <MapOutlined />,
        path: "centros-costo",
        permission:
          "vistas.admin.ver" /* recomendado: vistas.centrocosto.crear */,
      },
    ],
  },
  {
    name: "Módulo Gestion",
    permission: "vistas.admin.ver",
    children: [
      {
        text: "Admin",
        icon: <AdminPanelSettingsOutlined />,
        path: "admin",
        permission: "vistas.admin.ver",
      },
      /* {
        text: "Rendimiento",
        icon: <TrendingUpOutlined />,
        path: "rendimiento",
        permission: "vistas.admin.ver",
      }, */
    ],
  },
];
