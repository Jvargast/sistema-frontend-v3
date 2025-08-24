import { useState, useEffect } from "react";
import {
  BottomNavigationAction,
  BottomNavigation,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Collapse,
  useMediaQuery,
} from "@mui/material";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  ChevronRightOutlined,
  ExpandLess,
  ExpandMore,
  AccountCircle,
  LogoutOutlined,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import FlexBetween from "./FlexBetween";
import logoImage from "../../assets/images/logo_aguas_valentino2.png";
import { modulesData } from "../../utils/modulesData";
import { resetCacheAndLogout } from "../../store/reducers/authSlice";
import { useLogoutMutation } from "../../store/services/authApi";
import { getInitialRoute } from "../../utils/navigationUtils";
import {
  maximizeTab,
  openTab,
  setActiveTab,
} from "../../store/reducers/tabSlice";
import { getTabKey } from "../../utils/tabUtil";

const Sidebar = ({
  user,
  rol,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [active, setActive] = useState("");
  const [openSections, setOpenSections] = useState({});
  const permisos = useSelector((state) => state.auth.permisos);
  const [logout] = useLogoutMutation();
  const currentPath = pathname.replace(/^\//, "");

  const { openTabs } = useSelector((state) => state.tabs);

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
    "formulas/nuevo",
    "produccion/historial/ver",
    "agendas/ver",
    "ventas-chofer/ver",
    "produccion/historial",
  ];
  const tabEnabledPaths = [
    "dashboard",
    "punto-venta",
    "ventas",
    "punto-cotizacion",
    "cotizaciones",
    "punto-pedido",
    "admin-pedidos",
    "mis-pedidos",
    "pedidos",
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
    "ventas-chofer",
    "admin-viajes",
    "agenda-carga",
    "agendas",
    "usuarios",
    "miperfil",
    "admin",
    "cajas",
    "roles",
    "seguridad",
    "empresa",
    "analisis",
  ];
  const routeToTabInfo = {
    dashboard: { label: "Dashboard", icon: "HomeOutlined" },
    "punto-venta": { label: "Punto de Venta", icon: "ShoppingCartOutlined" },
    ventas: { label: "Ventas", icon: "AttachMoneyOutlined" },
    "punto-cotizacion": {
      label: "Punto Cotización",
      icon: "RequestQuoteOutlined",
    },
    cotizaciones: { label: "Cotizaciones", icon: "RequestQuoteOutlined" },
    "punto-pedido": { label: "Punto Pedido", icon: "ShoppingCartOutlined" },
    "admin-pedidos": {
      label: "Admin Pedidos",
      icon: "AdminPanelSettingsOutlined",
    },
    "mis-pedidos": { label: "Mis Pedidos", icon: "PersonOutlined" },
    pedidos: { label: "Pedidos", icon: "ShoppingCartOutlined" },
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
    "admin-viajes": {
      label: "Admin Viajes",
      icon: "AdminPanelSettingsOutlined",
    },
    "agenda-carga": { label: "Agenda Carga", icon: "EventOutlined" },
    agendas: { label: "Agendas", icon: "CalendarTodayOutlined" },
    usuarios: { label: "Usuarios", icon: "PeopleOutlined" },
    miperfil: { label: "Mi Perfil", icon: "AccountCircleOutlined" },
    admin: { label: "Administración", icon: "AdminPanelSettingsOutlined" },
    cajas: { label: "Cajas", icon: "AccountBalanceOutlined" },
    roles: { label: "Roles", icon: "SecurityOutlined" },
    seguridad: { label: "Seguridad", icon: "SecurityOutlined" },
    empresa: { label: "Empresa", icon: "BusinessOutlined" },
    analisis: { label: "Análisis", icon: "AnalyticsOutlined" },
  };

  const getActiveModule = () =>
    modulesData.find((m) => currentPath.startsWith(m.path))?.path || null;
  const activeModulePath = getActiveModule();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const hasPermission = (permission) => permisos.includes(permission);

  const handleToggleSection = (moduleName) => {
    setOpenSections((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(resetCacheAndLogout());
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const shouldUseRouter = (path) => {
    return routerOnlyPaths.some(
      (routerPath) =>
        path.startsWith(routerPath) ||
        path.includes("/ver/") ||
        path.includes("/editar/") ||
        path.includes("/crear")
    );
  };

  const canUseTab = (path) => {
    return (
      isDesktop && tabEnabledPaths.includes(path) && !shouldUseRouter(path)
    );
  };

  const handleNavigation = (item) => {
    const path = item.path;
    const key = getTabKey(path);

    if (!isDesktop) {
      navigate(`/${path}`);
      setActive(path);
      return;
    }

    if (canUseTab(key)) {
      const tabInfo = routeToTabInfo[path] || {
        label: item.text || item.name,
        icon: item.icon?.type?.displayName || null,
      };
      const existingTab = openTabs.find((tab) => tab.key === key);

      if (existingTab) {
        if (existingTab.minimized) {
          dispatch(maximizeTab(key));
        }
        dispatch(setActiveTab(key));
      } else {
        dispatch(
          openTab({
            key,
            label: tabInfo.label,
            icon: tabInfo.icon,
            path,
          })
        );
      }
      navigate(`/${path}`);
    } else {
      navigate(`/${path}`);
    }
  };

  const initialHomePath = getInitialRoute(rol, permisos);
  const initialHomeValue = initialHomePath.replace("/", "");

  return (
    <Box component="nav">
      {isSidebarOpen && isNonMobile && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant={isDesktop ? "persistent" : "temporary"}
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.paper,
              width: drawerWidth,
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            },
          }}
        >
          {/* Logo */}
          <Box m="1.5rem 2rem 2rem 3rem" display="flex" alignItems="center">
            <Box
              component="img"
              src={logoImage}
              alt="logo"
              height="56.59px"
              width="100px"
            />
          </Box>
          <Divider />

          {/* Modules List */}
          <List>
            {modulesData
              .filter(
                (module) =>
                  !module.permission || hasPermission(module.permission)
              )
              .map((module) => (
                <Box key={module.name}>
                  {/* Parent Module */}
                  <ListItemButton
                    onClick={
                      module.children
                        ? () => handleToggleSection(module.name)
                        : () => handleNavigation(module)
                    }
                    sx={{
                      backgroundColor:
                        activeModulePath === module.path
                          ? theme.palette.action.selected
                          : "transparent",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    {module.icon && <ListItemIcon>{module.icon}</ListItemIcon>}
                    <ListItemText primary={module.name} />
                    {module.children ? (
                      openSections[module.name] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : (
                      active === module.path && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )
                    )}
                  </ListItemButton>

                  {/* Children (Submodules) */}
                  {module.children && (
                    <Collapse
                      in={!!openSections[module.name]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {module.children
                          .filter((child) => hasPermission(child.permission))
                          .map((child) => (
                            <ListItemButton
                              key={child.path}
                              onClick={() => handleNavigation(child)}
                              sx={{
                                pl: 4,
                                backgroundColor:
                                  active === child.path
                                    ? theme.palette.action.selected
                                    : "transparent",
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              {child.icon && (
                                <ListItemIcon>{child.icon}</ListItemIcon>
                              )}
                              <ListItemText primary={child.text} />
                              {active === child.path && (
                                <ChevronRightOutlined sx={{ ml: "auto" }} />
                              )}
                            </ListItemButton>
                          ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              ))}
          </List>

          {/* Footer */}
          <Box bottom="2rem">
            <Divider />
            <FlexBetween m="1.5rem 2rem 0 3rem" gap="1rem">
              <Box>
                <AccountCircleIcon fontSize="large" />
              </Box>
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.text.primary }}
                >
                  {user?.nombre || ""}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {rol || ""}
                </Typography>
              </Box>
              <SettingsOutlined sx={{ fontSize: "25px" }} />
            </FlexBetween>
          </Box>
        </Drawer>
      )}

      {/* Bottom Navigation for Mobile */}
      {!isNonMobile && (
        <BottomNavigation
          value={pathname.substring(1)}
          onChange={(event, newValue) => {
            if (newValue === initialHomeValue) {
              navigate(initialHomePath);
              setActive(newValue);
            } else if (newValue !== "logout") {
              navigate(`/${newValue}`);
              setActive(newValue);
            }
          }}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#2C2C2C",
            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.2)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            zIndex: 999,
            pb: "env(safe-area-inset-bottom, 20px)",
            height: "56px",
          }}
        >
          <BottomNavigationAction
            label="Home"
            value={initialHomeValue}
            icon={<HomeOutlined />}
            sx={{
              color:
                pathname.substring(1) === initialHomeValue
                  ? "#FFFFFF"
                  : "rgba(255, 255, 255, 0.6)",
              "& .MuiSvgIcon-root": {
                fontSize: "1.8rem",
              },
            }}
          />
          {rol === "chofer" && (
            <BottomNavigationAction
              label="Mis Ventas"
              value="misventas"
              icon={<ShoppingCartOutlined />}
              sx={{
                color:
                  pathname.substring(1) === "misventas"
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.6)",
                "& .MuiSvgIcon-root": {
                  fontSize: "1.8rem",
                },
              }}
            />
          )}

          {rol !== "chofer" && rol !== "vendedor" && (
            <BottomNavigationAction
              label="Pedidos"
              value="punto-pedido"
              icon={<ShoppingCartOutlined />}
              sx={{
                color:
                  pathname.substring(1) === "punto-pedido"
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.6)",
                "& .MuiSvgIcon-root": {
                  fontSize: "1.8rem",
                },
              }}
            />
          )}
          <BottomNavigationAction
            label="Perfil"
            value="miperfil"
            icon={<AccountCircle />}
            sx={{
              color:
                pathname.substring(1) === "miperfil"
                  ? "#FFFFFF"
                  : "rgba(255, 255, 255, 0.6)",
              "& .MuiSvgIcon-root": {
                fontSize: "1.8rem",
              },
            }}
          />
          <BottomNavigationAction
            label="Cerrar Sesión"
            value="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            sx={{
              color:
                pathname.substring(1) === "logout"
                  ? "#FFFFFF"
                  : "rgba(255, 255, 255, 0.6)",
              "& .MuiSvgIcon-root": {
                fontSize: "1.8rem",
              },
            }}
          />
        </BottomNavigation>
      )}
    </Box>
  );
};

Sidebar.propTypes = {
  user: PropTypes.object,
  drawerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  rol: PropTypes.string,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  isNonMobile: PropTypes.bool.isRequired,
};

export default Sidebar;
