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
import CrearCotizacion from "./pages/cotizaciones";
import PreviewCotizacion from "./pages/cotizaciones/PreviewCotizacion";
import ListarCotizaciones from "./pages/cotizaciones/ListarCotizaciones";
import AdminHistorialViajes from "./pages/viajes/AdminHistorialViajes";
import ListarCuentasPorCobrar from "./pages/facturas";
import VerCuentaPorCobrar from "./pages/facturas/VerCuentaPorCobrar";
import ListarAgendasCarga from "./pages/agenda_carga/ListarAgendasCarga";
import VerAgendaCarga from "./pages/agenda_carga/VerAgendaCarga";
import ListarMisVentas from "./pages/ventas_chofer/ListarMisVentas";
import VerVentaChofer from "./pages/ventas_chofer/VerVentaChofer";
import ListarVentasChofer from "./pages/ventas_chofer/ListarVentasChofer";
import VerProducto from "./pages/productos/VerProducto";
import PanelProduccion from "./pages/produccion";
import ListarFormulasProductos from "./pages/formulas";
import CrearFormula from "./pages/formulas/CrearFormula";
import VerFormula from "./pages/formulas/VerFormula";
import HistorialProduccion from "./pages/produccion/HistorialProduccion";
import VerProduccion from "./pages/produccion/VerProduccion";
import VerInsumo from "./pages/insumos/VerInsumo";

// Configuración de rutas
const router = createHashRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "dashboard",
            element: (
              <RoleBasedRoute requiredPermission="vistas.dashboard.ver">
                <DashboardCentral />
              </RoleBasedRoute>
            ),
          },
          {
            path: "punto-venta",
            element: (
              <RoleBasedRoute requiredPermission="vistas.puntoventa.ver">
                <PuntoDeVenta />
              </RoleBasedRoute>
            ),
          },
          {
            path: "ventas",
            element: (
              <RoleBasedRoute requiredPermission="vistas.ventas.ver">
                <ListarVentas />
              </RoleBasedRoute>
            ),
          },
          {
            path: "ventas/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.ventas.ver">
                <VerVenta />
              </RoleBasedRoute>
            ),
          },
          {
            path: "punto-cotizacion",
            element: (
              <RoleBasedRoute requiredPermission="vistas.puntocotizacion.ver">
                <CrearCotizacion />
              </RoleBasedRoute>
            ),
          },
          {
            path: "cotizaciones",
            element: (
              <RoleBasedRoute requiredPermission="vistas.cotizaciones.ver">
                <ListarCotizaciones />
              </RoleBasedRoute>
            ),
          },
          {
            path: "cotizaciones/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.cotizaciones.ver">
                <PreviewCotizacion />
              </RoleBasedRoute>
            ),
          },
          {
            path: "punto-pedido",
            element: (
              <RoleBasedRoute requiredPermission="vistas.puntopedido.ver">
                <CrearPedido />
              </RoleBasedRoute>
            ),
          },
          {
            path: "admin-pedidos",
            element: (
              <RoleBasedRoute requiredPermission="vistas.adminpedidos.ver">
                <PedidosBoard />
              </RoleBasedRoute>
            ),
          },
          {
            path: "mis-pedidos",
            element: (
              <RoleBasedRoute requiredPermission="vistas.mispedidos.ver">
                <MisPedidos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "pedidos",
            element: (
              <RoleBasedRoute requiredPermission="vistas.pedidos.ver">
                <ListarPedidos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "pedidos/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.pedidos.ver">
                <VerPedido />
              </RoleBasedRoute>
            ),
          },
          {
            path: "pagos",
            element: (
              <RoleBasedRoute requiredPermission="vistas.pagos.ver">
                <ListarPagos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "pagos/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.pagos.ver">
                <VerPago />
              </RoleBasedRoute>
            ),
          },
          {
            path: "facturas",
            element: (
              <RoleBasedRoute requiredPermission="vistas.facturas.ver">
                <ListarCuentasPorCobrar />
              </RoleBasedRoute>
            ),
          },

          {
            path: "facturas/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.facturas.ver">
                <VerCuentaPorCobrar />
              </RoleBasedRoute>
            ),
          },
          {
            path: "clientes",
            element: (
              <RoleBasedRoute requiredPermission="vistas.clientes.ver">
                <Clientes />
              </RoleBasedRoute>
            ),
          },
          {
            path: "clientes/crear",
            element: (
              <RoleBasedRoute requiredPermission="vistas.clientes.ver">
                <CrearCliente />{" "}
              </RoleBasedRoute>
            ),
          },
          {
            path: "clientes/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="ventas.cliente.ver">
                <VerCliente />
              </RoleBasedRoute>
            ),
          },
          {
            path: "clientes/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="ventas.cliente.editar">
                <EditarCliente />
              </RoleBasedRoute>
            ),
          },
          {
            path: "categorias",
            element: (
              <RoleBasedRoute requiredPermission="vistas.categorias.ver">
                <CategoriaManagement />
              </RoleBasedRoute>
            ),
          },
          {
            path: "tipo-insumo",
            element: (
              <RoleBasedRoute requiredPermission="vistas.tipoinsumos.ver">
                <TipoInsumoManagement />
              </RoleBasedRoute>
            ),
          },
          {
            path: "productos",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver">
                <Productos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "productos/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver">
                <VerProducto />
              </RoleBasedRoute>
            ),
          },
          {
            path: "productos/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver">
                <EditarProducto />
              </RoleBasedRoute>
            ),
          },
          {
            path: "produccion",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver">
                <PanelProduccion />
              </RoleBasedRoute>
            ),
          },
          {
            path: "produccion/historial",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver">
                <HistorialProduccion />
              </RoleBasedRoute>
            ),
          },
          {
            path: "produccion/historial/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver">
                <VerProduccion />
              </RoleBasedRoute>
            ),
          },
          {
            path: "formulas",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver">
                <ListarFormulasProductos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "formulas/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver">
                <VerFormula />
              </RoleBasedRoute>
            ),
          },
          {
            path: "formulas/nuevo",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver">
                <CrearFormula />
              </RoleBasedRoute>
            ),
          },
          {
            path: "insumos",
            element: (
              <RoleBasedRoute requiredPermission="vistas.insumos.ver">
                <Insumos />
              </RoleBasedRoute>
            ),
          },
          {
            path: "insumos/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.insumos.ver">
                <VerInsumo />
              </RoleBasedRoute>
            ),
          },
          {
            path: "insumos/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.insumos.ver">
                <EditarInsumo />
              </RoleBasedRoute>
            ),
          },
          {
            path: "camiones",
            element: (
              <RoleBasedRoute requiredPermission="vistas.camiones.ver">
                <CamionesManagement />
              </RoleBasedRoute>
            ),
          },
          {
            path: "viajes",
            element: (
              <RoleBasedRoute requiredPermission="vistas.viajes.ver">
                <PanelViajeChofer />
              </RoleBasedRoute>
            ),
          },
          {
            path: "misventas",
            element: (
              <RoleBasedRoute requiredPermission="vistas.viajes.ver">
                <ListarMisVentas />
              </RoleBasedRoute>
            ),
          },
          {
            path: "ventas-chofer",
            element: (
              <RoleBasedRoute requiredPermission="vistas.ventas.ver">
                <ListarVentasChofer />
              </RoleBasedRoute>
            ),
          },
          {
            path: "ventas-chofer/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.ventas.ver">
                <VerVentaChofer />
              </RoleBasedRoute>
            ),
          },
          {
            path: "admin-viajes",
            element: (
              <RoleBasedRoute requiredPermission="vistas.admin.ver">
                <AdminHistorialViajes />
              </RoleBasedRoute>
            ),
          },
          {
            path: "agenda-carga",
            element: (
              <RoleBasedRoute requiredPermission="vistas.agendaCarga.crear">
                <CreateAgendaCargaForm />
              </RoleBasedRoute>
            ),
          },
          {
            path: "agendas",
            element: (
              <RoleBasedRoute requiredPermission="vistas.agendaCarga.ver">
                <ListarAgendasCarga />
              </RoleBasedRoute>
            ),
          },
          {
            path: "agendas/ver/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.agendaCarga.ver">
                <VerAgendaCarga />
              </RoleBasedRoute>
            ),
          },
          {
            path: "usuarios",
            element: (
              <RoleBasedRoute requiredPermission="vistas.usuarios.ver">
                <UserManagement />
              </RoleBasedRoute>
            ),
          },
          {
            path: "usuarios/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="auth.usuarios.crear">
                <EditUser />{" "}
              </RoleBasedRoute>
            ),
          },
          {
            path: "miperfil",
            element: (
              <RoleBasedRoute requiredPermission="vistas.perfil.ver">
                <PerfilUsuario />
              </RoleBasedRoute>
            ),
          },
          {
            path: "admin",
            element: (
              <RoleBasedRoute requiredPermission="vistas.admin.ver">
                <Administration />
              </RoleBasedRoute>
            ),
          },
          {
            path: "cajas",
            element: (
              <RoleBasedRoute requiredPermission="vistas.cajas.ver">
                <ListarCajas />
              </RoleBasedRoute>
            ),
          },
          {
            path: "roles",
            element: (
              <RoleBasedRoute requiredPermission="vistas.roles.ver">
                <RoleManagement />
              </RoleBasedRoute>
            ),
          },
          {
            path: "roles/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.roles.ver">
                <EditRole />
              </RoleBasedRoute>
            ),
          },
          {
            path: "seguridad",
            element: (
              <RoleBasedRoute requiredPermission="vistas.seguridad.ver">
                <Seguridad />{" "}
              </RoleBasedRoute>
            ),
          },
          {
            path: "empresa",
            element: (
              <RoleBasedRoute requiredPermission="vistas.empresas.ver">
                <Empresa />
              </RoleBasedRoute>
            ),
          },
          {
            path: "empresa/editar/:id",
            element: (
              <RoleBasedRoute requiredPermission="vistas.empresas.ver">
                <EditarEmpresa />
              </RoleBasedRoute>
            ),
          },
          {
            path: "analisis",
            element: (
              <RoleBasedRoute requiredPermission="vistas.analisis.ver">
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
