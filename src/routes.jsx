import { createHashRouter } from "react-router-dom";
import Login from "./pages/login";
import UnauthorizedPage from "./pages/unauthorized";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Layout from "./pages/layout";
import NotFoundPage from "./pages/notfound";
import RoleBasedRoute from "./components/utils/RoleBasedRoute";
/* import Dashboard from "./pages/dashboard"; */
import PerfilUsuario from "./pages/profile";
import Administration from "./pages/administration";
import RoleManagement from "./pages/administration/roles/RoleManagement";
import EditRole from "./pages/administration/roles/EditRoleManagement";
import Empresa from "./pages/administration/empresa";
import EditarEmpresa from "./pages/administration/empresa/EditEmpresaManagement";
import UserManagement from "./pages/administration/usuarios";
import EditUser from "./pages/administration/usuarios/EditUser";
/* import Seguridad from "./pages/administration/seguridad"; */
import Clientes from "./pages/clientes";
import CrearCliente from "./pages/clientes/CrearCliente";
import VerCliente from "./pages/clientes/VerCliente";
import EditarCliente from "./pages/clientes/EditarCliente";
import CategoriaManagement from "./pages/categorias";
import Productos from "./pages/productos";
import EditarProducto from "./pages/productos/EditarProducto";
import Insumos from "./pages/insumos";
import EditarInsumo from "./pages/insumos/EditarInsumo";
import PuntoDeVenta from "./pages/ventas/PuntoDeVenta";
import ListarCajas from "./pages/cajas";
import TipoInsumoManagement from "./pages/tipoinsumos";
import ListarVentas from "./pages/ventas/ListarVentas";
import Seguridad from "./pages/administration/seguridad";
import VerVenta from "./pages/ventas/VerVenta";
import CrearPedido from "./pages/pedidos/CrearPedido";
import DashboardCentral from "./pages/dashboard/DashboardCentral";
import CamionesManagement from "./pages/camiones";
import PedidosBoard from "./pages/pedidos/VerPedidos";
import ListarPedidos from "./pages/pedidos/ListarPedidos";
import VerPedido from "./pages/pedidos/VerPedido";
import CreateAgendaCargaForm from "./pages/agenda_carga/CrearCarga";
import MisPedidos from "./pages/pedidos/MisPedidos";
import PanelViajeChofer from "./pages/viajes/PanelViajesChofer";
import ListarPagos from "./pages/pagos";
import VerPago from "./pages/pagos/VerPago";
import Analisis from "./pages/analisis";

// Configuración de rutas
const router = createHashRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, // Rutas protegidas
    children: [
      {
        path: "/",
        element: <Layout />, // Layout principal
        children: [
          {
            path: "dashboard",
            element: (
              <RoleBasedRoute requiredPermission="ver_dashboard">
                <DashboardCentral />
              </RoleBasedRoute>
            ),
          },
          {
            path: "punto-venta",
            element: (
              <RoleBasedRoute requiredPermission="registrar_ventas">
                <PuntoDeVenta />
              </RoleBasedRoute>
            ),
          },
          {
            path: "ventas",
            element: (
              <RoleBasedRoute requiredPermission="ver_ventas">
                <ListarVentas />
              </RoleBasedRoute>
            ),
          },
          {
            path: "ventas/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="ver_ventas">
                <VerVenta />
              </RoleBasedRoute>
            ),
          },
          {
            //cambiar permiso a crear_pedido
            path: "punto-pedido",
            element: (
              <RoleBasedRoute requiredPermission="ver_pedidos">
                <CrearPedido />
              </RoleBasedRoute>
            ),
          },
          {
            path: "admin-pedidos",
            element: (
              <RoleBasedRoute requiredPermission="ver_pedidos">
                <PedidosBoard />
              </RoleBasedRoute>
            ),
          },
          {
            path: "mis-pedidos",
            element: (
              <RoleBasedRoute requiredPermission="ver_rutas">
                <MisPedidos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "pedidos",
            element: (
              <RoleBasedRoute requiredPermission="ver_pedidos">
                <ListarPedidos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "pedidos/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="ver_pedidos">
                <VerPedido />
              </RoleBasedRoute>
            ),
          },
          {
            path: "pagos",
            element: (
              <RoleBasedRoute requiredPermission="ver_pagos">
                <ListarPagos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "pagos/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="ver_pagos">
                <VerPago />
              </RoleBasedRoute>
            ),
          },
          /*            { path: "facturas", element: <Facturas /> },
          { path: "facturas/editar/:id", element: <EditarFactura /> },
          { path: "pagos", element: <Pagos /> },
          { path: "pagos/editar/:id", element: <EditarPago /> },
          { path: "cotizaciones", element: <Cotizaciones /> },
          {
            path: "cotizaciones/editar/:id",
            element: <EditarCotizacion />,
          },
          { path: "pedidos", element: <Pedidos /> },
          { path: "pedidos/editar/:id", element: <EditarPedido /> },
          ,
          { path: "ventas/editar/:id", element: <EditarVenta /> }, */
          {
            path: "clientes",
            element: (
              <RoleBasedRoute requiredPermission="ver_clientes">
                <Clientes />
              </RoleBasedRoute>
            ),
          },
          {
            path: "clientes/crear",
            element: (
              <RoleBasedRoute requiredPermission="crear_cliente">
                <CrearCliente />{" "}
              </RoleBasedRoute>
            ),
          },
          {
            path: "clientes/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="ver_cliente">
                <VerCliente />
              </RoleBasedRoute>
            ),
          },
          {
            path: "clientes/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="editar_cliente">
                <EditarCliente />
              </RoleBasedRoute>
            ),
          },
          {
            path: "categorias",
            element: (
              <RoleBasedRoute requiredPermission="ver_categorias">
                <CategoriaManagement />
              </RoleBasedRoute>
            ),
          },
          {
            //cambiar permiso ver_tipo_insumo
            path: "tipo-insumo",
            element: (
              <RoleBasedRoute requiredPermission="ver_categorias">
                <TipoInsumoManagement />
              </RoleBasedRoute>
            ),
          },
          {
            path: "productos",
            element: (
              <RoleBasedRoute requiredPermission="ver_productos">
                <Productos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "productos/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="editar_producto">
                <EditarProducto />
              </RoleBasedRoute>
            ),
          },
          {
            path: "insumos",
            element: (
              <RoleBasedRoute requiredPermission="ver_insumos">
                <Insumos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "insumos/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="ver_insumo">
                <EditarInsumo />
              </RoleBasedRoute>
            ),
          },
          {
            //cambiar permiso ver_camiones
            path: "camiones",
            element: (
              <RoleBasedRoute requiredPermission="ver_insumo">
                <CamionesManagement />
              </RoleBasedRoute>
            ),
          },

          /*,
          
          
          { path: "insumos/editar/:id", element: <EditarInsumo /> },
          {
            path: "entregas-completadas",
            element: <EntregasCompletadas />,
          },
          {
            path: "ventas-chofer",
            element: <VentasChofer />,
          },
          { path: "entregas", element: <EntregasManagement /> },
          
          
          { path: "agendas/editar/:id", element: <AgendaDetail /> },*/
          /* {
            path: "agendas",
            element: (
              <RoleBasedRoute requiredPermission="ver_agenda_carga">
                < />
              </RoleBasedRoute>
            ),
          }, */
          {
            path: "viajes",
            element: (
              <RoleBasedRoute requiredPermission="ver_agenda_carga">
                <PanelViajeChofer />
              </RoleBasedRoute>
            ),
          },
          {
            path: "agenda-carga",
            element: (
              <RoleBasedRoute requiredPermission="ver_agenda_carga">
                <CreateAgendaCargaForm />
              </RoleBasedRoute>
            ),
          },
          {
            path: "usuarios",
            element: (
              <RoleBasedRoute requiredPermission="ver_usuarios">
                <UserManagement />
              </RoleBasedRoute>
            ),
          },
          {
            path: "usuarios/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="editar_usuarios">
                <EditUser />{" "}
              </RoleBasedRoute>
            ),
          },
          {
            path: "miperfil",
            element: (
              <RoleBasedRoute requiredPermission="iniciar_sesion">
                <PerfilUsuario />
              </RoleBasedRoute>
            ),
          },
          {
            path: "admin",
            element: (
              <RoleBasedRoute requiredPermission="ver_administrador">
                <Administration />
              </RoleBasedRoute>
            ),
          },
          {
            path: "cajas",
            //cambiar permiso ver_cajas
            element: (
              <RoleBasedRoute requiredPermission="ver_roles">
                <ListarCajas />
              </RoleBasedRoute>
            ),
          },
          {
            path: "roles",
            element: (
              <RoleBasedRoute requiredPermission="ver_roles">
                <RoleManagement />
              </RoleBasedRoute>
            ),
          },
          {
            path: "roles/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="editar_roles">
                <EditRole />
              </RoleBasedRoute>
            ),
          },
          {
            path: "seguridad",
            element: (
              <RoleBasedRoute requiredPermission="configurar_parametros_del_sistema">
                <Seguridad />{" "}
              </RoleBasedRoute>
            ),
          },
          {
            path: "empresa",
            element: (
              <RoleBasedRoute requiredPermission="ver_empresa">
                <Empresa />
              </RoleBasedRoute>
            ),
          },
          {
            path: "empresa/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="editar_empresa">
                <EditarEmpresa />
              </RoleBasedRoute>
            ),
          },
          {
            path: "analisis",
            element: (
              <RoleBasedRoute requiredPermission="editar_empresa">
                <Analisis />{" "}
              </RoleBasedRoute>
            ),
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
]);
export default router;
