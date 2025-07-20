import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Box, Typography, Card, Grid2 } from "@mui/material";
import {
  HomeOutlined,
  PointOfSaleOutlined,
  PeopleAltOutlined,
  PieChartOutlined,
  AssignmentIndOutlined,
  SecurityOutlined,
  SupervisorAccountOutlined,
} from "@mui/icons-material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import AirportShuttleOutlinedIcon from "@mui/icons-material/AirportShuttleOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined className="text-blue-500" />,
    description: "Administra el estado general",
    path: "/dashboard",
  },
  {
    text: "Ventas",
    icon: <AttachMoneyOutlinedIcon className="text-teal-500" />,
    description: "Gestión de ventas",
    path: "/admin/ventas",
  },
  {
    text: "Pedidos",
    icon: <LocalShippingOutlinedIcon className="text-amber-500" />,
    description: "Gestión de pedidos",
    path: "/admin/pedidos",
  },
  {
    text: "Cotizaciones",
    icon: <ArticleOutlinedIcon className="text-indigo-500" />,
    description: "Gestión de cotizaciones",
    path: "/admin/cotizaciones",
  },
  {
    text: "Ventas Chofer",
    icon: <MonetizationOnOutlinedIcon className="text-zinc-700" />,
    description: "Gestión de ventas chofer",
    path: "/ventas-chofer",
  },
  {
    text: "Almacén",
    icon: <Inventory2OutlinedIcon className="text-pink-500" />,
    description: "Gestión de inventario",
    path: "/productos",
  },
  {
    text: "Proveedores",
    icon: <PeopleAltOutlined className="text-cyan-500" />,
    description: "Gestión de proveedores",
    path: "/admin/proveedores",
  },
  {
    text: "Producción",
    icon: <HistoryEduOutlinedIcon className="text-orange-500" />,
    description: "Historial de producciones",
    path: "/admin/produccion",
  },
  {
    text: "Análisis",
    icon: <PieChartOutlined className="text-sky-500" />,
    description: "Reportes de datos",
    path: "/admin/analisis",
  },
  {
    text: "Seguridad",
    icon: <SecurityOutlined className="text-red-500" />,
    description: "Gestión de seguridad",
    path: "/admin/seguridad",
  },
  {
    text: "Cajas",
    icon: <PointOfSaleOutlined className="text-emerald-500" />,
    description: "Cajas de la sucursal",
    path: "/admin/cajas",
  },
  {
    text: "Viajes",
    icon: <AirportShuttleOutlinedIcon className="text-lime-400" />,
    description: "Gestión de viajes",
    path: "/admin/viajes",
  },
  {
    text: "Agendas",
    icon: <CalendarMonthOutlinedIcon className="text-fuchsia-700" />,
    description: "Gestión de agendas",
    path: "/admin/agendas",
  },
  {
    text: "Usuarios",
    icon: <SupervisorAccountOutlined className="text-purple-500" />,
    description: "Administración de usuarios",
    path: "/admin/usuarios",
  },
  {
    text: "Roles",
    icon: <AssignmentIndOutlined className="text-yellow-500" />,
    description: "Gestión de roles y Permisos",
    path: "/admin/roles",
  },
  {
    text: "Empresa",
    icon: <BusinessIcon className="text-zinc-500" />,
    description: "Gestión de empresa y sucursales",
    path: "/admin/empresa",
  },
];

const Administration = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "gray.50",
        p: 1,
        mb: 4,
      }}
    >
      <Header title="Menú Administrador" subtitle="" />
      <Grid2
        container
        spacing={2}
        justifyContent="center"
        wrap="wrap"
        sx={{
          mt: 2,
          mb: 4,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {navItems.map((item, index) => (
          <Grid2
            key={index}
            xs={6}
            sm={4}
            md={3}
            lg={2}
            display="flex"
            justifyContent="center"
          >
            <Card
              variant="outlined"
              sx={{
                width: 180,
                height: 180,
                borderRadius: 4,
                boxShadow: "0 4px 14px 0 #21305213",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                p: 2,
                transition: "transform .16s, box-shadow .16s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 32px 0 #1a237e24",
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <Box
                sx={{
                  fontSize: 40,
                  mb: 1.2,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {item.icon}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: (theme) => theme.palette.text.primary,
                  textAlign: "center",
                  height: 32, // forzamos el alto para títulos de una o dos líneas
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  width: "100%",
                  mb: 0.5,
                }}
              >
                {item.text}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  fontSize: 13.8,
                  height: 34, 
                  lineHeight: 1.2,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {item.description}
              </Typography>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Administration;
