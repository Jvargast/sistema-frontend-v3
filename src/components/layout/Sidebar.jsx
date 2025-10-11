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
  alpha,
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
import {
  mainTabPaths,
  routeToTabInfo,
  shouldUseRouterPath,
} from "../../utils/tabsConfig";

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

const navActionSx = (t, isActive) => ({
  flex: 1,
  color: isActive ? t.palette.primary.main : t.palette.text.secondary,
  transition: "color .15s ease, transform .15s ease",
  "& .MuiSvgIcon-root": {
    fontSize: 24,
    transform: isActive ? "translateY(-1px)" : "none",
  },
  "& .MuiBottomNavigationAction-label": {
    fontSize: 11.5,
    fontWeight: isActive ? 700 : 600,
    letterSpacing: 0.1,
    marginTop: 2,
  },
  "&:hover": {
    backgroundColor:
      t.palette.mode === "light"
        ? alpha(t.palette.primary.main, 0.06)
        : alpha("#fff", 0.06),
  },
  "& .MuiTouchRipple-root": {
    color: isActive ? t.palette.primary.main : t.palette.text.secondary,
    opacity: 0.18,
  },
});

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
      setActive(path);
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
          <Box bottom="2rem">
            <Divider />
            <FlexBetween m="1.5rem 2rem 0 3rem" gap="1rem">
              <Box>
                <AccountCircleIcon fontSize="large" />
              </Box>
              <Box textAlign="left">
                <Typography
                  fontWeight={700}
                  fontSize="0.92rem"
                  sx={{ color: theme.palette.text.primary }}
                >
                  {user?.nombre || ""}
                </Typography>
                <Typography
                  fontSize="0.78rem"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {rol || ""}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{ fontSize: 22, color: theme.palette.text.secondary }}
              />
            </FlexBetween>
          </Box>
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
              setActive(newValue);
            } else if (newValue !== "logout") {
              navigate(`/${newValue}`);
              setActive(newValue);
            }
          }}
          showLabels
          sx={(t) => ({
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            backgroundColor:
              t.palette.mode === "light"
                ? t.palette.background.paper
                : t.palette.background.default,
            borderTop: `1px solid ${
              t.palette.roles?.border || "rgba(2,6,23,0.08)"
            }`,
            boxShadow: "0 -4px 18px rgba(2,6,23,0.08)",
            height: 68,
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)",
            WebkitTransform: "translateZ(0)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
              opacity: 0.25,
            },
          })}
        >
          <BottomNavigationAction
            label="Home"
            value={initialHomeValue}
            icon={<HomeOutlined />}
            sx={(t) =>
              navActionSx(t, pathname.substring(1) === initialHomeValue)
            }
          />
          {rol === "chofer" && (
            <BottomNavigationAction
              label="Mis Ventas"
              value="misventas"
              icon={<ShoppingCartOutlined />}
              sx={(t) => navActionSx(t, pathname.substring(1) === "misventas")}
            />
          )}

          {rol !== "chofer" && rol !== "vendedor" && (
            <BottomNavigationAction
              label="Pedidos"
              value="punto-pedido"
              icon={<ShoppingCartOutlined />}
              sx={(t) =>
                navActionSx(t, pathname.substring(1) === "punto-pedido")
              }
            />
          )}
          <BottomNavigationAction
            label="Perfil"
            value="miperfil"
            icon={<AccountCircle />}
            sx={(t) => navActionSx(t, pathname.substring(1) === "miperfil")}
          />
          <BottomNavigationAction
            label="Cerrar Sesión"
            value="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            sx={(t) => navActionSx(t, pathname.substring(1) === "logout")}
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
