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
  const [active, setActive] = useState("");
  const [openSections, setOpenSections] = useState({});
  const permisos = useSelector((state) => state.auth.permisos);
  const [logout] = useLogoutMutation();

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

  const handleNavigate = (path) => {
    navigate(`/${path}`);
    setActive(path);
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

  const initialHomePath = getInitialRoute(rol, permisos); // ejemplo: "/dashboard"
  const initialHomeValue = initialHomePath.replace("/", ""); // "dashboard"

  return (
    <Box component="nav">
      {isSidebarOpen && isNonMobile && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
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
                        : () => handleNavigate(module.path)
                    }
                    sx={{
                      backgroundColor:
                        active === module.path
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
                              onClick={() => handleNavigate(child.path)}
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
              value="pedidos"
              icon={<ShoppingCartOutlined />}
              sx={{
                color:
                  pathname.substring(1) === "pedidos"
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
