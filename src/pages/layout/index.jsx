import { useState, useEffect, useRef } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router";
import LoaderComponent from "../../components/common/LoaderComponent";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { LayoutContext } from "../../context/LayoutContext";
import Footer from "../../components/common/Footer";
import DynamicTabsBar from "../../components/layout/DynamicTabsBar";
import WelcomePage from "../../components/common/WelcomePage";
import { openTab } from "../../store/reducers/tabSlice";
import { getTabKey } from "../../utils/tabUtil";

const Layout = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const drawerWidth = 250;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const layoutContainerRef = useRef();
  const [resizeCount, setResizeCount] = useState(0);

  const { openTabs, activeTab } = useSelector((state) => state.tabs);
  const { user, rol, isLoading, isError } = useSelector((state) => state.auth);

  const { pathname } = useLocation();
  const currentPath = pathname.replace(/^\//, "");

  const tabKey = getTabKey(currentPath);

  const routerOnlyPaths = [
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

  const routeToTabInfo = {
    dashboard: { label: "Dashboard", icon: "HomeOutlined" },
    "punto-venta": { label: "Punto de Venta", icon: "ShoppingCartOutlined" },
    "punto-pedido": { label: "Punto Pedido", icon: "ShoppingCartOutlined" },
    "punto-cotizacion": {
      label: "Punto Cotización",
      icon: "RequestQuoteOutlined",
    },
    "admin-pedidos": {
      label: "Admin Pedidos",
      icon: "AdminPanelSettingsOutlined",
    },
    "mis-pedidos": { label: "Mis Pedidos", icon: "PersonOutlined" },
    pagos: { label: "Pagos", icon: "PaymentOutlined" },
    facturas: { label: "Facturas", icon: "ReceiptOutlined" },
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

    miperfil: { label: "Mi Perfil", icon: "AccountCircleOutlined" },
    admin: { label: "Administración", icon: "AdminPanelSettingsOutlined" },
    "agenda-carga": { label: "Agenda Carga", icon: "EventOutlined" },
    "admin/agendas": { label: "Agendas", icon: "CalendarTodayOutlined" },
    "admin/usuarios": { label: "Usuarios", icon: "PeopleOutlined" },
    "admin/cajas": { label: "Cajas", icon: "AccountBalanceOutlined" },
    "admin/roles": { label: "Roles", icon: "SecurityOutlined" },
    "admin/seguridad": { label: "Seguridad", icon: "SecurityOutlined" },
    "admin/empresa": { label: "Empresa", icon: "BusinessOutlined" },
    "admin/analisis": { label: "Análisis", icon: "AnalyticsOutlined" },
    "admin/ventas": { label: "Ventas", icon: "AttachMoneyOutlined" },
    "admin/cotizaciones": {
      label: "Cotizaciones",
      icon: "RequestQuoteOutlined",
    },
    "admin/pedidos": { label: "Pedidos", icon: "ShoppingCartOutlined" },
    "admin/produccion": { label: "Producción", icon: "ShoppingCartOutlined" },
    "admin/viajes": {
      label: "Admin Viajes",
      icon: "AdminPanelSettingsOutlined",
    },
  };

  const mainTabPaths = [
    "dashboard",
    "punto-venta",
    "punto-cotizacion",
    "punto-pedido",
    "admin-pedidos",
    "mis-pedidos",
    "pagos",
    "facturas",
    "clientes",
    "categorias",
    "tipo-insumo",
    "productos",
    "produccion",
    "formulas",
    "insumos",
    "camiones",
    "inventario-camion",
    "viajes",
    "misventas",
    "miperfil",
    "ventas-chofer",
    "agenda-carga",
    "admin",
    "admin/agendas",
    "admin/usuarios",
    "admin/viajes",
    "admin/cajas",
    "admin/roles",
    "admin/seguridad",
    "admin/empresa",
    "admin/analisis",
    "admin/produccion",
    "admin/ventas",
    "admin/cotizaciones",
    "admin/pedidos",
  ];

  const shouldUseRouter =
    routerOnlyPaths.some((path) => currentPath.startsWith(path)) ||
    /\/ver\/\d+/.test(currentPath) ||
    /\/editar\/\d+/.test(currentPath) ||
    /\/crear/.test(currentPath) ||
    currentPath.split("/").length > (tabKey.includes("/") ? 2 : 1);

  useEffect(() => {
    if (!layoutContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      setResizeCount((prev) => prev + 1);
    });
    observer.observe(layoutContainerRef.current);
    return () => observer.disconnect();
  }, []);

   useEffect(() => {
   if (!isDesktop) return;
   const active = openTabs.find((t) => t.key === activeTab);
   if (active) {
     const desired = "/" + active.path;
     if (pathname !== desired) {
       navigate(desired, { replace: true });
     }
   } else {
     //
   }
 }, [isDesktop, activeTab, openTabs, pathname, navigate]);

  useEffect(() => {
    if (
      isDesktop &&
      tabKey &&
      mainTabPaths.includes(tabKey) &&
      !shouldUseRouter &&
      pathname !== "/" &&
      openTabs.length === 0
    ) {
      const tabInfo = routeToTabInfo[tabKey];
      if (tabInfo) {
        dispatch(
          openTab({
            key: tabKey,
            label: tabInfo.label,
            icon: tabInfo.icon,
            path: tabKey,
          })
        );
      }
    }
    // eslint-disable-next-line
  }, [isDesktop, tabKey, shouldUseRouter, openTabs.length, dispatch, pathname]);

  useEffect(() => {
    if (
      isDesktop &&
      openTabs.length === 0 &&
      pathname !== "/" &&
      pathname !== "/#"
    ) {
      navigate("/");
    }
  }, [isDesktop, openTabs.length, pathname, navigate]);

  const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
  const isWelcome =
    isDesktop &&
    openTabs.length === 0 &&
    (cleanPath === "" || cleanPath === "#");

  if (isLoading) return <LoaderComponent />;
  if (isError) return <div>Error al cargar los datos del usuario</div>;
  if (!user) return <LoaderComponent />;

  /*   console.log(
    "openTabs",
    openTabs.length,
    "pathname",
    pathname,
    "isWelcome",
    isWelcome
  ); */

  return (
    <LayoutContext.Provider value={{ drawerWidth, isSidebarOpen, resizeCount }}>
      <Box
        display="flex"
        flexDirection="row"
        height="100dvh"
        width="100%"
        ref={layoutContainerRef}
        sx={{ overflow: "hidden" }}
      >
        <Sidebar
          user={user}
          rol={rol}
          isNonMobile={isDesktop}
          drawerWidth={drawerWidth}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          minWidth={0}
          overflow="hidden"
        >
          <Navbar
            user={user}
            rol={rol}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          {isDesktop && openTabs.length > 0 && (
            <DynamicTabsBar isDesktop={isDesktop} />
          )}

          <Box
            flexGrow={1}
            minWidth={0}
            sx={{
              overflowY: "auto",
              pb: {
                xs: "calc(56px + env(safe-area-inset-bottom, 0px))",
                md: 0,
              },
            }}
          >
            {isDesktop ? (
              isWelcome || !activeTab ? (
                <WelcomePage />
              ) : (
                <Outlet />
              )
            ) : (
              <Outlet />
            )}
          </Box>

          <Footer />
        </Box>
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout;
