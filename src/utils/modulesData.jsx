import { AdminPanelSettingsOutlined, CategoryOutlined, ChecklistOutlined, Groups2Outlined, HomeOutlined, MapOutlined, PieChartOutlined, PointOfSaleOutlined, ReceiptLongOutlined, ShoppingCartOutlined, TrendingUpOutlined, WarehouseOutlined } from "@mui/icons-material";
import EventIcon from "@mui/icons-material/Event";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';

export const modulesData = [
  {
    name: "Dashboard",
    icon: <HomeOutlined />,
    path: "dashboard",
    permission: "ver_dashboard",
    children: null, 
  },
  {
    name: "Modulo Ventas",
    icon: null, 
    permission: "ver_ventas",
    children: [
      {
        text: "Facturas",
        icon: <ReceiptLongOutlined />,
        path: "facturas",
        permission: "ver_facturas",
      },
      {
        text: "Pagos",
        icon: <PaymentOutlinedIcon />,
        path: "pagos",
        permission: "ver_pagos",
      },
      {
        text: "Cotizaciones",
        icon: <RequestQuoteOutlinedIcon />,
        path: "cotizaciones",
        permission: "ver_cotizaciones",
      },
      {
        text: "Pedidos",
        icon: <ShoppingCartOutlined />,
        path: "punto-pedido",
        permission: "ver_pedidos",
      },
      {
        text: "POS",
        icon: <PointOfSaleOutlined />,
        path: "punto-venta",
        permission: "ver_ventas",
      },
      {
        text: "Clientes",
        icon: <Groups2Outlined />,
        path: "clientes",
        permission: "ver_clientes",
      },
    ],
  },
  {
    name: "Modulo Inventario",
    permission: "ver_productos",
    children: [
      {
        text: "Productos",
        icon: <Inventory2OutlinedIcon />,
        path: "productos",
        permission: "ver_productos",
      },
      {
        text: "Insumos",
        icon: <WarehouseOutlined />,
        path: "insumos",
        permission: "ver_insumos",
      },
      {
        text: "Categorias",
        icon: <CategoryOutlined />,
        path: "categorias",
        permission: "ver_categorias",
      },
      {
        text: "Tipos de Insumos",
        icon: <ConstructionOutlinedIcon />,
        path: "tipo-insumo",
        permission: "ver_categorias",
      },
    ],
  },
  {
    name: "Modulo Entregas",
    permission: "ver_entregas",
    children: [
      {
        text: "Gestión de Pedidos",
        icon: <ChecklistOutlined />,
        path: "admin-pedidos",
        permission: "ver_pedidos",
      },
      {
        text: "Gestión Camiones",
        icon: <LocalShippingOutlinedIcon />,
        path: "camiones",
        permission: "ver_camiones",
      },
      {
        text: "Inventario Camión",
        icon: <Inventory2OutlinedIcon />,
        path: "inventario-camion",
        permission: "ver_inventario_camion",
      },
      {
        text: "Agenda Carga",
        icon: <EventIcon />,
        path: "agenda-carga",
        permission: "ver_agenda_carga",
      },
      {
        text: "Agenda Viajes",
        icon: <MapOutlined />,
        path: "viajes",
        permission: "ver_agenda_carga",
      },
      {
        text: "Mis Pedidos",
        icon: <AssignmentOutlinedIcon />, 
        path: "mis-pedidos",
        permission: "ver_rutas",
      },
    ],
  },
  {
    name: "Modulo Analytics",
    permission: "ver_estadisticas",
    children: [
      {
        text: "Estadisticas",
        icon: <PieChartOutlined />,
        path: "estadisticas",
        permission: "ver_estadisticas",
      },
    ],
  },
  {
    name: "Gestion",
    permission: "ver_admin",
    children: [
      {
        text: "Admin",
        icon: <AdminPanelSettingsOutlined />,
        path: "admin",
        permission: "ver_admin",
      },
      {
        text: "Rendimiento",
        icon: <TrendingUpOutlined />,
        path: "rendimiento",
        permission: "ver_rendimiento",
      },
    ],
  },
];
