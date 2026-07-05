import Menu from "../common/CompatMenu";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Menu as MenuIcon,
  ArrowDropDownOutlined,
  ExpandLess,
  ExpandMore,
  AccountCircleOutlined,
  CloseRounded,
  LogoutOutlined } from
"@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { AppBar, Button, IconButton, Toolbar, MenuItem, useTheme, useMediaQuery, Drawer, Divider, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Collapse, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../store/services/authApi";
import { resetCacheAndLogout } from "../../store/reducers/authSlice";
import FlexBetween from "./FlexBetween";
import { modulesData } from "../../utils/modulesData";
import {
  markAllAsRead,
  removeNotificacionById } from
"../../store/reducers/notificacionesSlice";
import NotificationsMenu from "./NotificationMenu";
import SearchBar from "./SearchBar";
import ConfigMenu from "./ConfigMenu";
import { setMode } from "../../store/reducers/globalSlice";
import { useTranslation } from "react-i18next";
import { isColorLight } from "../../utils/colorUtil";
import useTabNavigation from "../../utils/useTabNavigation";
import ScopeSwitcher from "./ScopeSwitcher";
import { alpha } from "@mui/material/styles";
import Box from "../common/CompatBox";
import Typography from "../common/CompatTypography";

const rolColors = {
  chofer: "#FFE082",
  administrador: "#81D4FA",
  vendedor: "#A5D6A7",
  supervisor: "#FFCCBC",
  default: "#ECEFF1"
};

const parseNotificationData = (datos) => {
  if (!datos) return {};
  if (typeof datos === "string") {
    try {
      return JSON.parse(datos);
    } catch {
      return {};
    }
  }
  return typeof datos === "object" ? datos : {};
};

const getPedidoIdFromNotification = (notif) => {
  const datos = parseNotificationData(notif?.datos_adicionales);
  const idDesdeMensaje = String(notif?.mensaje || "").match(
    /pedido\s*#?\s*(\d+)/i
  )?.[1];

  return (
    datos?.id_pedido ??
    datos?.pedido_id ??
    datos?.idPedido ??
    datos?.pedidoId ??
    datos?.pedido?.id_pedido ??
    datos?.pedido?.id ??
    datos?.entrega?.id_pedido ??
    datos?.entrega?.pedido_id ??
    notif?.id_pedido ??
    notif?.pedido_id ??
    notif?.idPedido ??
    notif?.pedidoId ??
    notif?.pedido?.id_pedido ??
    notif?.pedido?.id ??
    notif?.entrega?.id_pedido ??
    idDesdeMensaje
  );
};

const getAgendaViajeIdFromNotification = (notif) => {
  const datos = parseNotificationData(notif?.datos_adicionales);
  return (
    datos?.id_agenda_viaje ??
    datos?.agenda_viaje_id ??
    datos?.idAgendaViaje ??
    datos?.agendaViajeId ??
    datos?.agenda?.id_agenda_viaje ??
    datos?.agenda?.id ??
    datos?.viaje?.id_agenda_viaje ??
    datos?.viaje?.id ??
    notif?.id_agenda_viaje ??
    notif?.agenda_viaje_id ??
    notif?.idAgendaViaje ??
    notif?.agendaViajeId ??
    notif?.agenda?.id_agenda_viaje ??
    notif?.agenda?.id ??
    notif?.viaje?.id_agenda_viaje
  );
};

const Navbar = ({ user, rol, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTabletOrMobile = useMediaQuery("(max-width:1023px)");
  const { i18n } = useTranslation();
  const roleName = (
  typeof rol === "string" ? rol : rol?.nombre || "").
  toLowerCase();
  const isAdmin = roleName === "administrador";
  const navbarColor = rolColors[roleName] || rolColors.default;
  const iconNavbarColor = isColorLight(navbarColor) ? "#2c3e50" : "#fff";
  const isDarkMode = theme.palette.mode === "dark";
  const drawerTokens = {
    paperBg: isDarkMode
      ? "linear-gradient(180deg, #020617 0%, #0F172A 100%)"
      : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
    paperColor: isDarkMode ? "#fff" : "#0F172A",
    border: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.1)",
    shadow: isDarkMode
      ? "18px 0 44px rgba(2,6,23,0.38)"
      : "18px 0 38px rgba(15,23,42,0.14)",
    headerBg: isDarkMode
      ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)"
      : "linear-gradient(135deg, rgba(15,23,42,0.035) 0%, rgba(15,23,42,0.01) 100%)",
    headerBorder: isDarkMode
      ? "rgba(255,255,255,0.08)"
      : "rgba(15,23,42,0.08)",
    avatarBg: isDarkMode ? "rgba(255,255,255,0.14)" : "#0F172A",
    avatarColor: "#fff",
    avatarShadow: isDarkMode
      ? "inset 0 0 0 1px rgba(255,255,255,0.18)"
      : "inset 0 0 0 1px rgba(15,23,42,0.1)",
    subtleText: isDarkMode ? "rgba(255,255,255,0.72)" : alpha("#0F172A", 0.62),
    closeBg: isDarkMode ? "rgba(255,255,255,0.1)" : alpha("#0F172A", 0.06),
    closeBgHover: isDarkMode ? "rgba(255,255,255,0.18)" : alpha("#0F172A", 0.1),
    closeColor: isDarkMode ? "#fff" : "#0F172A",
    itemColor: isDarkMode ? "rgba(255,255,255,0.92)" : "#0F172A",
    iconColor: isDarkMode ? "rgba(255,255,255,0.82)" : alpha("#0F172A", 0.68),
    childIconColor: isDarkMode ? "rgba(255,255,255,0.62)" : alpha("#0F172A", 0.5),
    itemHoverBg: isDarkMode ? "rgba(255,255,255,0.08)" : alpha("#0F172A", 0.06),
    itemFocusBg: isDarkMode ? "rgba(255,255,255,0.1)" : alpha("#0F172A", 0.08),
    itemFocusOutline: isDarkMode
      ? "rgba(255,255,255,0.2)"
      : alpha("#0F172A", 0.18),
    footerBg: isDarkMode ? "rgba(2,6,23,0.18)" : alpha("#0F172A", 0.03)
  };

  const iconBtnSx = (t) => ({
    color: iconNavbarColor,
    padding: 0.75,
    borderRadius: 10,
    transition: "background-color .15s ease, transform .15s ease",
    "&:hover": {
      backgroundColor:
      t.palette.mode === "light" ? alpha("#000", 0.06) : alpha("#fff", 0.08)
    },
    "& .MuiSvgIcon-root": { fontSize: 24 }
  });

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const [logout] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [openSections, setOpenSections] = useState({});

  const openTabAndNavigate = useTabNavigation();
  const tabInfo = {
    label: "Mi Perfil",
    icon: "AccountCircleOutlined"
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
      [moduleName]: !prev[moduleName]
    }));
  };
  const handleMobileNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  const getVisibleChildren = (module) =>
    (module.children || []).filter(
      (child) => !child.permission || hasPermission(child.permission)
    );
  const drawerItemSx = (depth = 0) => ({
    ml: depth ? 0.75 : 0,
    mr: 1,
    my: 0.25,
    pr: 1.25,
    pl: depth ? 2.25 : 2,
    minHeight: depth ? 42 : 48,
    borderRadius: "0 10px 10px 0",
    color: drawerTokens.itemColor,
    alignItems: "center",
    "&:hover": {
      bgcolor: drawerTokens.itemHoverBg
    },
    "&.Mui-focusVisible": {
      bgcolor: drawerTokens.itemFocusBg,
      outline: `2px solid ${drawerTokens.itemFocusOutline}`,
      outlineOffset: 2
    },
    "& .MuiListItemIcon-root": {
      minWidth: 36,
      color: depth ? drawerTokens.childIconColor : drawerTokens.iconColor
    },
    "& .MuiSvgIcon-root": {
      fontSize: depth ? 20 : 22
    },
    "& .MuiListItemText-primary": {
      fontSize: depth ? 13.5 : 14,
      fontWeight: depth ? 650 : 800,
      lineHeight: 1.25
    }
  });
  const formattedRoleName = roleName ?
  roleName.charAt(0).toUpperCase() + roleName.slice(1) :
  "";

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
      case "pedido_entregado":
      case "entrega_registrada": {
        const idPedido = getPedidoIdFromNotification(notif);
        const idAgendaViaje = getAgendaViajeIdFromNotification(notif);

        if (idPedido) {
          navigate(`/admin-pedidos/ver/${idPedido}`, {
            state: { from: "/admin-pedidos" }
          });
        } else if (idAgendaViaje) {
          navigate(`/admin/viajes/ver/${idAgendaViaje}`);
        } else {
          navigate("/admin-pedidos");
        }
        break;
      }
      case "viaje_finalizado": {
        const idAgendaViaje = getAgendaViajeIdFromNotification(notif);
        if (idAgendaViaje) {
          navigate(`/admin/viajes/ver/${idAgendaViaje}`);
        } else {
          navigate("/admin/viajes");
        }
        break;
      }

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
        boxShadow: "none"
      }}>

      <Toolbar
        sx={(t) => ({
          justifyContent: "space-between",
          minHeight: 64,
          px: { xs: 1.5, md: 2 },
          background: navbarColor,
          borderBottom: `1px solid ${
          t.palette.roles?.border || "rgba(2,6,23,0.08)"}`,

          boxShadow: "0 4px 18px rgba(2,6,23,0.06)",
          backdropFilter: "saturate(1.2) blur(6px)"
        })}>

        {isTabletOrMobile ?
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between"
          }}>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
              sx={(t) => iconBtnSx(t)}>

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
                  backgroundColor: "rgba(44,62,80,0.07)"
                }
              }}>

                <Badge
                badgeContent={notificaciones.filter((n) => !n.leida).length}
                color="secondary"
                sx={{
                  "& .MuiBadge-badge": {
                    minWidth: 18,
                    height: 18,
                    fontSize: 10,
                    fontWeight: 700,
                    boxShadow: "0 0 0 2px rgba(255,255,255,0.8)"
                  }
                }}>

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
              currentLang={i18n.language} />

            </Box>
          </Box> :

        <FlexBetween>
            <IconButton
            onClick={() => {
              if (isDesktop) {
                setIsSidebarOpen((prev) => !prev);
              } else {
                setMobileMenuOpen(true);
              }
            }}
            sx={(t) => ({
              display: isDesktop ? "block" : "none",
              ...iconBtnSx(t)
            })}
            aria-label="Abrir o cerrar menú lateral">

              <MenuIcon />
            </IconButton>
            {isAdmin && (
              <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 2 }}>
                <SearchBar
                onResultSelect={(item) => {
                  console.log("Seleccionaste:", item);
                }} />

              </Box>
            )}
          </FlexBetween>
        }

        {!isTabletOrMobile &&
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "1.5rem"
          }}>

            {isAdmin && <ScopeSwitcher />}
            <IconButton
            aria-label="Ver notificaciones"
            onClick={handleOpenNotificationsMenu}
            sx={{
              color: iconNavbarColor,
              "&:hover": {
                backgroundColor: "rgba(44,62,80,0.07)",
                "&:focus": {
                  outline: "none",
                  boxShadow: "none"
                },
                "&:active": {
                  outline: "none",
                  boxShadow: "none"
                },
                "&:focus-visible": {
                  outline: "none",
                  boxShadow: "none"
                }
              }
            }}>

              <Badge
              badgeContent={notificaciones.filter((n) => !n.leida).length}
              color="secondary"
              sx={{
                "& .MuiBadge-badge": {
                  minWidth: 18,
                  height: 18,
                  fontSize: 10,
                  fontWeight: 700,
                  boxShadow: "0 0 0 2px rgba(255,255,255,0.8)"
                }
              }}>

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
            currentLang={i18n.language} />


            <Button
            onClick={handleClick}
            sx={(t) => ({
              textTransform: "none",
              backgroundColor: "transparent",
              borderRadius: 1,
              border: 0,
              minWidth: 0,
              px: 1,
              py: 0.75,
              display: "flex",
              alignItems: "center",
              gap: 1,
              boxShadow: "none",
              "&:hover": {
                backgroundColor:
                t.palette.mode === "light" ?
                alpha("#000", 0.07) :
                alpha("#fff", 0.12)
              },
              "&:focus, &:focus-visible": {
                outline: "none",
                boxShadow: `0 0 0 2px ${alpha(t.palette.primary.main, 0.28)}`
              }
            })}>

              <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "#3F51B5",
                fontSize: "0.85rem",
                fontWeight: 800,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)"
              }}>

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
                maxWidth: 100
              }}>

                <Typography
                fontWeight={700}
                fontSize="0.78rem"
                color={theme.palette.text.primary}
                sx={{ lineHeight: 1.2 }}
                noWrap>

                  {user?.nombre || ""}
                </Typography>
                <Typography
                fontSize="0.65rem"
                color={theme.palette.text.secondary}
                sx={{ lineHeight: 1.2 }}
                noWrap>

                  {rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : ""}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
              sx={{ fontSize: "25px", color: theme.palette.text.primary }} />

            </Button>

            <Menu
            anchorEl={anchorEl}
            open={isOpen}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: (t) => ({
                  mt: 1,
                  minWidth: 238,
                  borderRadius: 1,
                  border: 0,
                  bgcolor: "background.paper",
                  boxShadow:
                    t.palette.mode === "light"
                      ? "0 14px 34px rgba(15, 23, 42, 0.16)"
                      : "0 14px 34px rgba(0, 0, 0, 0.38)",
                  overflow: "visible",
                  "& .MuiList-root": {
                    p: 0.75
                  },
                  "& .MuiMenuItem-root": {
                    minHeight: 42,
                    borderRadius: 1,
                    px: 1.25,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "text.primary",
                    "&:hover": {
                      bgcolor:
                        t.palette.mode === "light"
                          ? alpha(t.palette.primary.main, 0.08)
                          : alpha(t.palette.primary.light, 0.14)
                    }
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 34,
                    color: "text.secondary"
                  }
                })
              }
            }}>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 1.25,
                  py: 1.25,
                  mb: 0.5
                }}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "#3F51B5",
                    fontSize: "0.95rem",
                    fontWeight: 800
                  }}
                >
                  {user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={800} fontSize="0.9rem" noWrap>
                    {user?.nombre || "Usuario"}
                  </Typography>
                  <Typography
                    fontSize="0.75rem"
                    color="text.secondary"
                    noWrap
                  >
                    {rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : ""}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 0.5 }} />
              <MenuItem
              onClick={() => {
                handleClose();
                openTabAndNavigate("miperfil", tabInfo);
              }}>

                <ListItemIcon>
                  <AccountCircleOutlined fontSize="small" />
                </ListItemIcon>
                Mi Perfil
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={(t) => ({
                  color: `${t.palette.error.main} !important`,
                  "& .MuiListItemIcon-root": {
                    color: `${t.palette.error.main} !important`
                  },
                  "&:hover": {
                    bgcolor: `${alpha(t.palette.error.main, 0.08)} !important`
                  }
                })}
              >
                <ListItemIcon>
                  <LogoutOutlined fontSize="small" />
                </ListItemIcon>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        }
        <NotificationsMenu
          anchorEl={anchorNoti}
          open={isNotiOpen}
          onClose={handleCloseNoti}
          notifications={notificaciones}
          onSelectNotification={handleSelectNotification} />

      </Toolbar>
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          ".MuiDrawer-paper": {
            width: { xs: "min(88vw, 336px)", sm: 340 },
            background: drawerTokens.paperBg,
            color: drawerTokens.paperColor,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${drawerTokens.border}`,
            boxShadow: drawerTokens.shadow,
            borderRadius: "0 16px 16px 0",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" }
          }
        }}>

        <Box
          sx={{
            px: 2,
            pt: "calc(env(safe-area-inset-top, 0px) + 16px)",
            pb: 1.5,
            background: drawerTokens.headerBg,
            borderBottom: `1px solid ${drawerTokens.headerBorder}`
          }}>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5
            }}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: drawerTokens.avatarBg,
                  color: drawerTokens.avatarColor,
                  fontWeight: 900,
                  boxShadow: drawerTokens.avatarShadow
                }}>

                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" fontWeight={900} lineHeight={1.05} noWrap>
                  Menú
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: drawerTokens.subtleText, fontWeight: 700 }}
                  noWrap>

                  {user?.nombre || "Usuario"}
                  {formattedRoleName ? ` · ${formattedRoleName}` : ""}
                </Typography>
              </Box>
            </Box>

            <IconButton
              aria-label="Cerrar menú"
              onClick={() => setMobileMenuOpen(false)}
              size="small"
              sx={{
                width: 38,
                height: 38,
                color: drawerTokens.closeColor,
                bgcolor: drawerTokens.closeBg,
                "&:hover": { bgcolor: drawerTokens.closeBgHover }
              }}>

              <CloseRounded fontSize="small" />
            </IconButton>
          </Box>

          {isAdmin &&
          <Box
            sx={{
              mt: 1.5,
              p: 0,
              borderRadius: 0,
              bgcolor: "transparent"
            }}>

              <ScopeSwitcher />
            </Box>
          }
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            py: 1.25,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" }
          }}>

          <List disablePadding>
            {modulesData
            .slice(1)
            .filter(
              (module) =>
              !module.permission || hasPermission(module.permission)
            )
            .map((module) => {
              const visibleChildren = getVisibleChildren(module);
              const hasChildren = Boolean(module.children && visibleChildren.length);

              if (module.children && !visibleChildren.length) return null;

              return (
                <Box key={module.name} sx={{ mb: 0.25 }}>
                  <ListItemButton
                    onClick={
                    hasChildren ?
                    () => handleToggleSection(module.name) :
                    () => handleMobileNavigate(module.path)
                    }
                    aria-expanded={hasChildren ? Boolean(openSections[module.name]) : undefined}
                    sx={drawerItemSx()}>

                    <ListItemIcon>
                      {module.icon || <Box sx={{ width: 22, height: 22 }} />}
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={
                      <Typography component="span" noWrap sx={{ display: "block" }}>
                          {module.name}
                        </Typography>
                      } />

                    {hasChildren && (
                openSections[module.name] ?
                <ExpandLess /> :

                <ExpandMore />)
                }
                  </ListItemButton>
                  {module.children &&
              <Collapse
                in={!!openSections[module.name]}
                timeout="auto"
                unmountOnExit>

                      <List component="div" disablePadding sx={{ pb: 0.5 }}>
                        {visibleChildren.map((child) =>
                        <ListItemButton
                          key={child.path}
                          onClick={() => handleMobileNavigate(child.path)}
                          sx={drawerItemSx(1)}>

                            <ListItemIcon>
                              {child.icon || <Box sx={{ width: 20, height: 20 }} />}
                            </ListItemIcon>
                            <ListItemText
                              disableTypography
                              primary={
                              <Typography component="span" noWrap sx={{ display: "block" }}>
                                  {child.text}
                                </Typography>
                              } />
                            </ListItemButton>
                        )}
                      </List>
                    </Collapse>
              }
                </Box>
              );
            })}
          </List>
        </Box>

        <Box
          sx={{
            flex: "0 0 auto",
            height: "max(env(safe-area-inset-bottom, 0px), 12px)",
            borderTop: `1px solid ${drawerTokens.headerBorder}`,
            bgcolor: drawerTokens.footerBg
          }} />
      </Drawer>
    </AppBar>);

};
Navbar.propTypes = {
  user: PropTypes.object,
  rol: PropTypes.string,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired
};

export default Navbar;
