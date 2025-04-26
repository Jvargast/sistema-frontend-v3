import { useState } from "react";
import PropTypes from "prop-types";
import {
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
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
import { markAllAsRead } from "../../store/reducers/notificacionesSlice";
import NotificationsMenu from "./NotificationMenu";

const rolColors = {
  chofer: "#FFD54F",       // amarillo
  administrador: "#90CAF9", // azul claro
  vendedor: "#A5D6A7",      // verde claro
  default: "#E4DFDF",       // color por defecto
};




const Navbar = ({ user, rol, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  /* const isNonMobile = useMediaQuery("(min-width: 600px)"); */
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  //const isTablet = useMediaQuery("(min-width: 600px) and (max-width: 1023px)");
  //const isMobile = useMediaQuery("(max-width: 599px)");
  const isTabletOrMobile = useMediaQuery("(max-width:1023px)");

  const navbarColor = rolColors[rol?.toLowerCase()] || rolColors.default;

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const [logout] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [openSections, setOpenSections] = useState({});

  // Manejo del logout
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(resetCacheAndLogout());
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Manejo de apertura y cierre del menú
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

  // Obtenemos la lista de notificaciones
  const notificaciones = useSelector((state) => state.notificaciones.items);

  // Estado local para manejar el Menu anclado al ícono
  const [anchorNoti, setAnchorNoti] = useState(null);
  const isNotiOpen = Boolean(anchorNoti);

  const handleOpenNoti = (event) => {
    setAnchorNoti(event.currentTarget);
  };
  const handleCloseNoti = () => {
    setAnchorNoti(null);
  };

  // Ejemplo de acción para marcar leídas al abrir el menú
  const handleOpenNotificationsMenu = (event) => {
    handleOpenNoti(event);
    dispatch(markAllAsRead());
  };
  const handleSelectNotification = (notif) => {
    console.log("Notificación clickeada:", notif);
    // Lógica de navegación o acción
    if (notif.tipo === "pedido_asignado") {
      // Ejemplo: ir a /pedidos
      navigate("/pedidos");
    }
    // Cierra el menú
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
      <Toolbar sx={{ justifyContent: "space-between", background: navbarColor }}>
        {/* LADO IZQUIERDO */}
        {/* Botón para abrir/cerrar Sidebar */}
        {isTabletOrMobile ? (
          <FlexBetween>
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              aria-label="Ver notificaciones"
              onClick={handleOpenNotificationsMenu}
            >
              <Badge
                badgeContent={notificaciones.filter((n) => !n.leida).length}
                color="secondary"
              >
                <NotificationsNoneOutlinedIcon sx={{ fontSize: "25px" }} />
              </Badge>
            </IconButton>

            <IconButton aria-label="Abrir configuración">
              <SettingsOutlined sx={{ fontSize: "25px" }} />
            </IconButton>
          </FlexBetween>
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
                color: theme.palette.mode === "light" ? "#000000" : "#ffffff",
                border: "none",
                outline: "none",
                borderWidth: 0,
                ":focus": {
                  outline: "none",
                  boxShadow: "none",
                },
                ":active": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}
              aria-label="Abrir o cerrar menú lateral"
            >
              <MenuIcon />
            </IconButton>

            <FlexBetween
              backgroundColor={
                theme.palette.mode === "dark" ? "#000000" : "#FFFFFF"
              }
              borderRadius="2rem"
              gap="1rem"
              p="0.1rem 1rem"
              border="1px solid #5c5c5a"
            >
              <InputBase
                placeholder="Buscar..."
                aria-label="Buscar contenido"
              />
              <IconButton>
                <Search />
              </IconButton>
            </FlexBetween>
          </FlexBetween>
        )}

        {/* LADO DERECHO */}
        {!isTabletOrMobile && (
          <FlexBetween gap="1.5rem">
            <IconButton
              aria-label="Ver notificaciones"
              onClick={handleOpenNotificationsMenu}
            >
              <Badge
                badgeContent={
                  // Contamos cuántas no están leídas, si tienes esa info
                  notificaciones.filter((n) => !n.leida).length
                }
                color="secondary"
              >
                <NotificationsNoneOutlinedIcon sx={{ fontSize: "25px" }} />
              </Badge>
            </IconButton>
            {/* Menu de notificaciones */}
            <IconButton aria-label="Abrir configuración">
              <SettingsOutlined sx={{ fontSize: "25px" }} />
            </IconButton>
            <Button onClick={handleClick} sx={{ textTransform: "none" }}>
              <AccountCircleIcon fontSize="large" />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary[100]
                        : theme.palette.secondary[50],
                  }}
                >
                  {user?.nombre || ""}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary[100]
                        : theme.palette.secondary[50],
                  }}
                >
                  {rol || ""}
                </Typography>
              </Box>

              <ArrowDropDownOutlined sx={{ fontSize: "25px" }} />
            </Button>
            <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
              <MenuItem onClick={() => navigate("/miperfil")}>
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>
          </FlexBetween>
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
