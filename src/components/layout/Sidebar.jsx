import { useState } from "react";
import { BottomNavigationAction, BottomNavigation, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, useTheme, Collapse, useMediaQuery, alpha } from "@mui/material";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  ChevronRightOutlined,
  ExpandLess,
  ExpandMore,
  AccountCircle,
  LogoutOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
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
import {
  mainTabPaths,
  routeToTabInfo,
  shouldUseRouterPath,
} from "../../utils/tabsConfig";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const ANDROID_FALLBACK = 16;
const BASE_H = 64;
const ACTION_H = 56;
const NAV_DARK = "#0F172A";

const itemStyles = (t, isActive) => ({
  mx: 1,
  my: 0.5,
  height: 44,
  borderRadius: 10,
  transition: "background-color .15s ease, color .15s ease",
  backgroundColor: isActive
    ? alpha(t.palette.primary.main, 0.1)
    : "transparent",
  color: isActive ? t.palette.text.primary : t.palette.text.secondary,
  "&:hover": {
    backgroundColor:
      t.palette.mode === "light"
        ? alpha(t.palette.primary.main, 0.08)
        : alpha("#fff", 0.06),
  },
  "& .MuiListItemIcon-root": {
    minWidth: 36,
    color: isActive ? t.palette.primary.main : t.palette.text.secondary,
    "& .MuiSvgIcon-root": { fontSize: 22 },
  },
  "& .MuiListItemText-primary": {
    fontSize: 14,
    fontWeight: isActive ? 700 : 600,
    letterSpacing: -0.1,
  },
  ...(isActive
    ? {
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 6,
          top: 8,
          bottom: 8,
          width: 3,
          borderRadius: 3,
          backgroundColor: t.palette.primary.main,
          opacity: 0.9,
        },
      }
    : {}),
});

const navActionSx = (t, isActive, intent = "default") => {
  const activeColor = intent === "danger" ? t.palette.error.main : NAV_DARK;
  const inactiveColor =
    t.palette.mode === "light" ? t.palette.text.secondary : alpha("#fff", 0.68);

  return {
    flex: 1,
    minWidth: 0,
    maxWidth: "none",
    height: ACTION_H,
    px: 0.25,
    pt: 0.75,
    pb: 0.4,
    color: isActive ? activeColor : inactiveColor,
    transition: "color .15s ease, background-color .15s ease",
    "&.MuiBottomNavigationAction-iconOnly": {
      paddingTop: 0,
    },
    "& .MuiBottomNavigationAction-label": {
      fontSize: 11,
      lineHeight: 1.08,
      fontWeight: isActive ? 800 : 650,
      letterSpacing: 0,
      mt: 0.15,
      whiteSpace: "nowrap",
      opacity: 1,
    },
    "&:hover": {
      backgroundColor:
        t.palette.mode === "light" ? alpha(NAV_DARK, 0.04) : alpha("#fff", 0.06),
    },
    "&.Mui-selected": {
      color: activeColor,
    },
    "& .MuiTouchRipple-root": {
      color: isActive ? activeColor : inactiveColor,
      opacity: 0.18,
    },
  };
};

const navIconSx = (t, isActive, intent = "default") => {
  const activeColor = intent === "danger" ? t.palette.error.main : NAV_DARK;
  const inactiveColor =
    t.palette.mode === "light" ? t.palette.text.secondary : alpha("#fff", 0.68);
  const activeBg =
    intent === "danger" ? alpha(t.palette.error.main, 0.1) : alpha(NAV_DARK, 0.09);

  return {
    width: 34,
    height: 30,
    borderRadius: 999,
    display: "inline-grid",
    placeItems: "center",
    mb: 0.25,
    color: isActive ? activeColor : inactiveColor,
    bgcolor: isActive ? activeBg : "transparent",
    transition: "background-color .15s ease, color .15s ease",
    "& .MuiSvgIcon-root": {
      fontSize: 22,
    },
  };
};

const Sidebar = ({
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
  const [openSections, setOpenSections] = useState({});
  const permisos = useSelector((state) => state.auth.permisos);
  const [logout] = useLogoutMutation();
  const currentPath = pathname.replace(/^\//, "");

  const { openTabs } = useSelector((state) => state.tabs);
  const getActiveModule = () =>
    modulesData.find((m) => currentPath.startsWith(m.path))?.path || null;
  const activeModulePath = getActiveModule();
  const active = pathname.substring(1);

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

  const canUseTab = (keyOrPath) =>
    isDesktop &&
    mainTabPaths.includes(keyOrPath) &&
    !shouldUseRouterPath(keyOrPath);

  const handleNavigation = (item) => {
    const raw = item.path.startsWith("/") ? item.path.slice(1) : item.path;
    const key = getTabKey(raw);
    const path = key;

    if (!isDesktop) {
      navigate("/" + raw);
      return;
    }

    if (canUseTab(key)) {
      const tabInfo = routeToTabInfo[key] || {
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
        dispatch(setActiveTab(key));
      }
      navigate("/" + path);
    } else {
      navigate("/" + raw);
    }
  };

  const initialHomePath = getInitialRoute(rol, permisos);
  const initialHomeValue = initialHomePath.replace("/", "");
  const currentBottomPath = pathname.substring(1);
  const navIcon = (icon, isActive, intent = "default") => (
    <Box component="span" sx={(t) => navIconSx(t, isActive, intent)}>
      {icon}
    </Box>
  );

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
              borderRight: `1px solid ${
                theme.palette.roles?.border || "rgba(2,6,23,0.06)"
              }`,
              boxShadow: "0 8px 24px rgba(2,6,23,0.06)",
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
                  {/* <Typography
                    variant="caption"
                    sx={{
                      mx: 2,
                      mt: 1.5,
                      mb: 0.5,
                      color: theme.palette.text.disabled,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                    }}
                  >
                    {module.group || "GENERAL"}
                  </Typography> */}
                  <ListItemButton
                    onClick={
                      module.children
                        ? () => handleToggleSection(module.name)
                        : () => handleNavigation(module)
                    }
                    sx={(t) => itemStyles(t, activeModulePath === module.path)}
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
                              sx={(t) => ({
                                ...itemStyles(t, active === child.path),
                                pl: 5,
                              })}
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
          <Box
            sx={{
              mt: 1.25,
              px: 3,
              pb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", letterSpacing: 0.2 }}
            >
              Versión {import.meta.env.VITE_APP_VERSION || "v0.0.0"}
            </Typography>
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
            } else if (newValue !== "logout") {
              navigate(`/${newValue}`);
            }
          }}
          showLabels
          sx={(t) => ({
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            boxSizing: "border-box",
            alignItems: "flex-start",
            backgroundColor:
              t.palette.mode === "light"
                ? "rgba(255,255,255,0.96)"
                : "rgba(15,23,42,0.96)",
            backdropFilter: "saturate(180%) blur(14px)",
            borderTop: `1px solid ${
              t.palette.roles?.border || "rgba(2,6,23,0.08)"
            }`,
            boxShadow:
              t.palette.mode === "light"
                ? "0 -10px 28px rgba(15,23,42,0.1)"
                : "0 -10px 28px rgba(0,0,0,0.35)",
            height: `calc(${BASE_H}px + max(env(safe-area-inset-bottom, 0px), ${ANDROID_FALLBACK}px))`,
            px: 0.75,
            pt: 0.5,
            paddingBottom: `max(env(safe-area-inset-bottom, 0px), ${ANDROID_FALLBACK}px)`,
            WebkitTransform: "translateZ(0)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: alpha(NAV_DARK, t.palette.mode === "light" ? 0.16 : 0.34),
            },
            "& .MuiBottomNavigationAction-root": {
              borderRadius: 1,
            },
          })}
        >
          <BottomNavigationAction
            label="Inicio"
            value={initialHomeValue}
            icon={navIcon(
              <HomeOutlined />,
              currentBottomPath === initialHomeValue
            )}
            sx={(t) =>
              navActionSx(t, currentBottomPath === initialHomeValue)
            }
          />
          {rol === "chofer" && (
            <BottomNavigationAction
              label="Ventas"
              value="misventas"
              icon={navIcon(
                <ShoppingCartOutlined />,
                currentBottomPath === "misventas"
              )}
              sx={(t) => navActionSx(t, currentBottomPath === "misventas")}
            />
          )}

          {rol !== "chofer" && rol !== "vendedor" && (
            <BottomNavigationAction
              label="Pedidos"
              value="punto-pedido"
              icon={navIcon(
                <ShoppingCartOutlined />,
                currentBottomPath === "punto-pedido"
              )}
              sx={(t) =>
                navActionSx(t, currentBottomPath === "punto-pedido")
              }
            />
          )}
          <BottomNavigationAction
            label="Perfil"
            value="miperfil"
            icon={navIcon(<AccountCircle />, currentBottomPath === "miperfil")}
            sx={(t) => navActionSx(t, currentBottomPath === "miperfil")}
          />
          <BottomNavigationAction
            label="Salir"
            value="logout"
            icon={navIcon(<LogoutOutlined />, false, "danger")}
            onClick={handleLogout}
            sx={(t) => navActionSx(t, false, "danger")}
          />
        </BottomNavigation>
      )}
    </Box>
  );
};

Sidebar.propTypes = {
  drawerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  rol: PropTypes.string,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  isNonMobile: PropTypes.bool.isRequired,
};

export default Sidebar;
