import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Box, Typography, CardContent, Card, Grid2 } from "@mui/material";
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
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

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
    path: "/ventas",
  },
  {
    text: "Pedidos",
    icon: <LocalShippingOutlinedIcon className="text-amber-500" />,
    description: "Gestión de pedidos",
    path: "/pedidos",
  },
  {
    text: "Cotizaciones",
    icon: <ArticleOutlinedIcon className="text-indigo-500" />,
    description: "Gestión de cotizaciones",
    path: "/cotizaciones",
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
    description: "Gestión de productos e insumos",
    path: "/productos",
  },
  {
    text: "Proveedores y Mensajes",
    icon: <PeopleAltOutlined className="text-cyan-500" />,
    description: "Gestión de proveedores y comunicación interna",
    path: "/proveedores-mensajes",
  },
  {
    text: "Análisis",
    icon: <PieChartOutlined className="text-sky-500" />,
    description: "Reporte diario, mensual y desglose de datos",
    path: "/analisis",
  },
  {
    text: "Seguridad",
    icon: <SecurityOutlined className="text-red-500" />,
    description: "Gestión de seguridad del sistema",
    path: "/seguridad",
  },
  {
    text: "Gestión de Cajas",
    icon: <PointOfSaleOutlined className="text-emerald-500" />,
    description: "Cajas de la sucursal",
    path: "/cajas",
  },
  {
    text: "Viajes",
    icon: <AirportShuttleOutlinedIcon className="text-lime-400" />,
    description: "Gestión de viajes",
    path: "/admin-viajes",
  },
  {
    text: "Carga de Agendas",
    icon: <CalendarMonthOutlinedIcon className="text-fuchsia-700" />,
    description: "Gestión de viajes",
    path: "/agendas",
  },
  {
    text: "Usuarios",
    icon: <SupervisorAccountOutlined className="text-purple-500" />,
    description: "Administración de usuarios",
    path: "/usuarios",
  },
  {
    text: "Roles",
    icon: <AssignmentIndOutlined className="text-yellow-500" />,
    description: "Gestión de roles y Permisos",
    path: "/roles",
  },
  {
    text: "Empresa",
    icon: <BusinessIcon className="text-zinc-500" />,
    description: "Gestión de empresa y sucursales",
    path: "/empresa",
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
        p:1,
        mb: 4
      }}
    >
      <Header title="Menú Administrador" subtitle=""/>
      <Grid2 container spacing={2} justifyContent="center" wrap="wrap" mt={2} >
        {navItems.map((item, index) => (
          <Grid2
            key={index}
            xs={12}
            sm={6}
            md={4}
            lg={2.4}
            className="flex justify-center"
          >
            <Card
              variant="outlined"
              className="w-[12rem] h-[12rem] flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer bg-white"
              onClick={() => navigate(item.path)}
            >
              <Box className="text-5xl mb-2 hover:text-gray-700">
                {item.icon}
              </Box>
              <CardContent className="text-center">
                <Typography
                  variant="h6"
                  component="div"
                  className="font-bold text-gray-800"
                >
                  {item.text}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Administration;
