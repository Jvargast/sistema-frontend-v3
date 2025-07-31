import { useState } from "react";
import PropTypes from "prop-types";
import {
  Menu as MenuIcon,
  ArrowDropDownOutlined,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Collapse,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../store/services/authApi";
import { resetCacheAndLogout } from "../../store/reducers/authSlice";
import FlexBetween from "./FlexBetween";
import { modulesData } from "../../utils/modulesData";
import {
  markAllAsRead,
  removeNotificacionById,
} from "../../store/reducers/notificacionesSlice";
import NotificationsMenu from "./NotificationMenu";
import SearchBar from "./SearchBar";
import ConfigMenu from "./ConfigMenu";
import { setMode } from "../../store/reducers/globalSlice";
import { useTranslation } from "react-i18next";
import { isColorLight } from "../../utils/colorUtil";
import useTabNavigation from "../../utils/useTabNavigation";

const rolColors = {
  chofer: "#FFE082",
  administrador: "#81D4FA",
  vendedor: "#A5D6A7",
  supervisor: "#FFCCBC",
  default: "#ECEFF1",
};

const Navbar = ({ user, rol, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTabletOrMobile = useMediaQuery("(max-width:1023px)");
  const { i18n } = useTranslation();
  const navbarColor = rolColors[rol?.toLowerCase()] || rolColors.default;
  const iconNavbarColor = isColorLight(navbarColor) ? "#2c3e50" : "#fff";

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const [logout] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [openSections, setOpenSections] = useState({});

  const openTabAndNavigate = useTabNavigation();
  const tabInfo = {
    label: "Mi Perfil",
    icon: "AccountCircleOutlined",
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(resetCacheAndLogout());
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const permisos = useSelector((state) => state.auth.permisos);

  const hasPermission = (permission) => permisos.includes(permission);

  const handleToggleSection = (moduleName) => {
    setOpenSections((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const notificaciones = useSelector((state) => state.notificaciones.items);

  const [anchorNoti, setAnchorNoti] = useState(null);
  const isNotiOpen = Boolean(anchorNoti);

  const handleOpenNoti = (event) => {
    setAnchorNoti(event.currentTarget);
  };
  const handleCloseNoti = () => {
    setAnchorNoti(null);
  };

  const handleOpenNotificationsMenu = (event) => {
    handleOpenNoti(event);
    dispatch(markAllAsRead());
  };
  const handleSelectNotification = (notif) => {
    console.log("🔔 Notificación clickeada:", notif);

    switch (notif.tipo) {
      case "pedido_asignado":
        navigate("/mis-pedidos");
        break;
      case "pedido_confirmado":
        navigate("/admin/pedidos");
        break;
      case "pedido_revertido":
        if (user?.rol === "administrador") {
          navigate("/admin/pedidos");
        } else {
          navigate("/mis-pedidos");
        }
        break;
      case "entrega_realizada":
        navigate("/entregas");
        break;
      case "viaje_finalizado":
        if (notif?.datos_adicionales?.id_agenda_viaje) {
          navigate(`/admin/viajes/ver/${notif.datos_adicionales.id_agenda_viaje}`);
        } else {
          navigate("/admin/viajes");
        }
        break;

      default:
        console.warn("🔔 Tipo de notificación no manejado:", notif.tipo);
        break;
    }

    dispatch(removeNotificacionById(notif.id_notificacion || notif.id));

    handleCloseNoti();
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", background: navbarColor }}
      >
        {isTabletOrMobile ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menú"
                sx={{
                  color: iconNavbarColor,
                  "&:hover": {
                    backgroundColor: "rgba(44,62,80,0.07)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton
                aria-label="Ver notificaciones"
                onClick={handleOpenNotificationsMenu}
                sx={{
                  color: iconNavbarColor,
                  "&:hover": {
                    backgroundColor: "rgba(44,62,80,0.07)",
                  },
                }}
              >
                <Badge
                  badgeContent={notificaciones.filter((n) => !n.leida).length}
                  color="secondary"
                >
                  <NotificationsNoneOutlinedIcon sx={{ fontSize: 25 }} />
                </Badge>
              </IconButton>
              <ConfigMenu
                iconColor={iconNavbarColor}
                onToggleTheme={() => dispatch(setMode())}
                onChangeLanguage={(lang) => {
                  i18n.changeLanguage(lang);
                  localStorage.setItem("language", lang);
                }}
                currentLang={i18n.language}
              />
            </Box>
          </Box>
        ) : (
          <FlexBetween>
            <IconButton
              onClick={() => {
                if (isDesktop) {
                  setIsSidebarOpen((prev) => !prev);
                } else {
                  setMobileMenuOpen(true);
                }
              }}
              sx={{
                display: isDesktop ? "block" : "none",
                border: "none",
                outline: "none",
                transition: "background 0.2s",
                bgcolor: "transparent",
                color: iconNavbarColor,
                "&:hover": {
                  backgroundColor: "rgba(44,62,80,0.07)",
                },
                borderWidth: 0,
                ":focus": {
                  outline: "none",
                  boxShadow: "none",
                },
                ":active": {
                  outline: "none",
                  boxShadow: "none",
                },
                "&:focus": {
                  outline: "none !important",
                  boxShadow: "none !important",
                },
                "&:focus-visible": {
                  outline: "none !important",
                  boxShadow: "none !important",
                },
                "&:active": {
                  outline: "none !important",
                  boxShadow: "none !important",
                },
              }}
              aria-label="Abrir o cerrar menú lateral"
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, maxWidth: "600px" }}>
              <SearchBar
                onResultSelect={(item) => {
                  console.log("Seleccionaste:", item);
                }}
              />
            </Box>
          </FlexBetween>
        )}

        {!isTabletOrMobile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <IconButton
              aria-label="Ver notificaciones"
              onClick={handleOpenNotificationsMenu}
              sx={{
                color: iconNavbarColor,
                "&:hover": {
                  backgroundColor: "rgba(44,62,80,0.07)",
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                  "&:active": {
                    outline: "none",
                    boxShadow: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                    boxShadow: "none",
                  },
                },
              }}
            >
              <Badge
                badgeContent={notificaciones.filter((n) => !n.leida).length}
                color="secondary"
              >
                <NotificationsNoneOutlinedIcon sx={{ fontSize: "25px" }} />
              </Badge>
            </IconButton>

            <ConfigMenu
              iconColor={iconNavbarColor}
              onToggleTheme={() => {
                dispatch(setMode());
              }}
              onChangeLanguage={(lang) => {
                i18n.changeLanguage(lang);
                localStorage.setItem("language", lang);
              }}
              currentLang={i18n.language}
            />

            <Button
              onClick={handleClick}
              sx={{
                textTransform: "none",
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "#f5f5f5"
                    : theme.palette.background.paper,
                borderRadius: "999px",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? "#e0e0e0"
                      : theme.palette.background.default,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: "#3F51B5",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  lineHeight: 1.1,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: 100,
                }}
              >
                <Typography
                  fontWeight="bold"
                  fontSize="0.7rem"
                  color={theme.palette.text.primary}
                  sx={{ lineHeight: 1.2 }}
                  noWrap
                >
                  {user?.nombre || ""}
                </Typography>
                <Typography
                  fontSize="0.65rem"
                  color={theme.palette.text.secondary}
                  sx={{ lineHeight: 1.2 }}
                  noWrap
                >
                  {rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : ""}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ fontSize: "25px", color: theme.palette.text.primary }}
              />
            </Button>

            <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
              <MenuItem
                onClick={() => {
                  handleClose();
                  openTabAndNavigate("miperfil", tabInfo); // 👈
                }}
              >
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>
          </Box>
        )}
        <NotificationsMenu
          anchorEl={anchorNoti}
          open={isNotiOpen}
          onClose={handleCloseNoti}
          notifications={notificaciones}
          onSelectNotification={handleSelectNotification}
        />
      </Toolbar>
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          ".MuiDrawer-paper": {
            width: 280,
            backgroundColor: "#1E1E1E",
            color: "white",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          },
        }}
      >
        <Box p={2} textAlign="center">
          <Typography variant="h5" fontWeight="bold">
            Menú
          </Typography>
          <Divider />
          <List>
            {modulesData
              .slice(1)
              .filter(
                (module) =>
                  !module.permission || hasPermission(module.permission)
              )
              .map((module) => (
                <Box key={module.name}>
                  <ListItemButton
                    onClick={
                      module.children
                        ? () => handleToggleSection(module.name)
                        : () => navigate(module.path)
                    }
                  >
                    {module.icon && <ListItemIcon>{module.icon}</ListItemIcon>}
                    <ListItemText
                      primary={module.name}
                      sx={{ color: "white" }}
                    />
                    {module.children &&
                      (openSections[module.name] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      ))}
                  </ListItemButton>
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
                              onClick={() => navigate(child.path)}
                              sx={{ pl: 4 }}
                            >
                              {child.icon && (
                                <ListItemIcon sx={{ color: "white" }}>
                                  {child.icon}
                                </ListItemIcon>
                              )}
                              <ListItemText primary={child.text} />
                            </ListItemButton>
                          ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              ))}
          </List>
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Divider sx={{ backgroundColor: "#555" }} />
            <Avatar
              sx={{
                bgcolor: "#3F51B5",
                width: 48,
                height: 48,
                margin: "10px auto",
              }}
            >
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Typography variant="body2" textAlign="center">
              {user?.nombre || "Usuario"}
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
};
Navbar.propTypes = {
  user: PropTypes.object,
  rol: PropTypes.string,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
};

export default Navbar;
