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
import InspeccionRetornables from "./pages/inventario_camion";
import WelcomePage from "./components/common/WelcomePage";

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
          { path: "", element: <WelcomePage /> },
          {
            path: "dashboard",
            element: (
              <RoleBasedRoute requiredPermission="vistas.dashboard.ver" />
            ),
            children: [{ path: "", element: <DashboardCentral /> }],
          },
          // puntos
          {
            path: "punto-venta",
            element: (
              <RoleBasedRoute requiredPermission="vistas.puntoventa.ver" />
            ),
            children: [{ path: "", element: <PuntoDeVenta /> }],
          },
          {
            path: "punto-cotizacion",
            element: (
              <RoleBasedRoute requiredPermission="vistas.puntocotizacion.ver" />
            ),
            children: [{ path: "", element: <CrearCotizacion /> }],
          },
          {
            path: "punto-pedido",
            element: (
              <RoleBasedRoute requiredPermission="vistas.puntopedido.ver" />
            ),
            children: [{ path: "", element: <CrearPedido /> }],
          },
          // Gestión pedidos
          {
            path: "admin-pedidos",
            element: (
              <RoleBasedRoute requiredPermission="vistas.adminpedidos.ver" />
            ),
            children: [{ path: "", element: <PedidosBoard /> }],
          },
          // mis-pedidos
          {
            path: "mis-pedidos",
            element: (
              <RoleBasedRoute requiredPermission="vistas.mispedidos.ver" />
            ),
            children: [
              {
                path: "",
                element: <MisPedidos />,
              },
            ],
          },
          // pagos
          {
            path: "pagos",
            element: <RoleBasedRoute requiredPermission="vistas.pagos.ver" />,
            children: [
              {
                path: "",
                element: <ListarPagos />,
              },
              {
                path: "ver/:id",
                element: <VerPago />,
              },
            ],
          },
          // facturas
          {
            path: "facturas",
            element: (
              <RoleBasedRoute requiredPermission="vistas.facturas.ver" />
            ),
            children: [
              {
                path: "",
                element: <ListarCuentasPorCobrar />,
              },
              {
                path: "ver/:id",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.facturas.ver" />
                ),
                children: [
                  {
                    path: "",
                    element: <VerCuentaPorCobrar />,
                  },
                ],
              },
            ],
          },
          // clientes
          {
            path: "clientes",
            element: (
              <RoleBasedRoute requiredPermission="vistas.clientes.ver" />
            ),
            children: [
              {
                path: "",
                element: <Clientes />,
              },
              {
                path: "crear",
                element: (
                  <RoleBasedRoute requiredPermission="ventas.cliente.crear" />
                ),
                children: [{ path: "", element: <CrearCliente /> }],
              },
              {
                path: "ver/:id",
                element: <VerCliente />,
              },
              {
                path: "editar/:id",
                element: (
                  <RoleBasedRoute requiredPermission="ventas.cliente.editar" />
                ),
                children: [{ path: "", element: <EditarCliente /> }],
              },
            ],
          },
          // categorias
          {
            path: "categorias",
            element: (
              <RoleBasedRoute requiredPermission="vistas.categorias.ver" />
            ),
            children: [{ path: "", element: <CategoriaManagement /> }],
          },
          // tipo-insumo
          {
            path: "tipo-insumo",
            element: (
              <RoleBasedRoute requiredPermission="vistas.tipoinsumos.ver" />
            ),
            children: [
              {
                path: "",
                element: <TipoInsumoManagement />,
              },
            ],
          },
          // productos
          {
            path: "productos",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver" />
            ),
            children: [
              {
                path: "",
                element: <Productos />,
              },
              {
                path: "ver/:id",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.productos.ver" />
                ),
                children: [
                  {
                    path: "",
                    element: <VerProducto />,
                  },
                ],
              },
              {
                path: "editar/:id",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.productos.ver" />
                ),
                children: [
                  {
                    path: "",
                    element: <EditarProducto />,
                  },
                ],
              },
            ],
          },
          // produccion
          {
            path: "produccion",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver" />
            ),
            children: [{ path: "", element: <PanelProduccion /> }],
          },
          // formulas
          {
            path: "formulas",
            element: (
              <RoleBasedRoute requiredPermission="vistas.productos.ver" />
            ),
            children: [
              {
                path: "",
                element: <ListarFormulasProductos />,
              },
              {
                path: "ver/:id",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.productos.ver" />
                ),
                children: [{ path: "", element: <VerFormula /> }],
              },
              {
                path: "crear",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.productos.ver" />
                ),
                children: [{ path: "", element: <CrearFormula /> }],
              },
            ],
          },
          // insumos
          {
            path: "insumos",
            element: <RoleBasedRoute requiredPermission="vistas.insumos.ver" />,
            children: [
              {
                path: "",
                element: <Insumos />,
              },
              {
                path: "ver/:id",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.insumos.ver" />
                ),
                children: [{ path: "", element: <VerInsumo /> }],
              },
              {
                path: "editar/:id",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.insumos.ver" />
                ),
                children: [{ path: "", element: <EditarInsumo /> }],
              },
            ],
          },
          // camiones
          {
            path: "camiones",
            element: (
              <RoleBasedRoute requiredPermission="vistas.camiones.ver" />
            ),
            children: [{ path: "", element: <CamionesManagement /> }],
          },
          // inventario-camion
          {
            path: "inventario-camion",
            element: (
              <RoleBasedRoute requiredPermission="vistas.camiones.ver" />
            ),
            children: [
              {
                path: "",
                element: <InspeccionRetornables />,
              },
            ],
          },
          // viajes
          {
            path: "viajes",
            element: <RoleBasedRoute requiredPermission="vistas.viajes.ver" />,
            children: [
              {
                path: "",
                element: <PanelViajeChofer />,
              },
            ],
          },
          // misventas
          {
            path: "misventas",
            element: <RoleBasedRoute requiredPermission="vistas.viajes.ver" />,
            children: [
              {
                path: "",
                element: <ListarMisVentas />,
              },
            ],
          },
          // ventas-chofer
          {
            path: "ventas-chofer",
            element: <RoleBasedRoute requiredPermission="vistas.ventas.ver" />,
            children: [
              {
                path: "",
                element: <ListarVentasChofer />,
              },
              {
                path: "ver/:id",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.ventas.ver" />
                ),
                children: [
                  {
                    path: "",
                    element: <VerVentaChofer />,
                  },
                ],
              },
            ],
          },
          // agenda-carga
          {
            path: "agenda-carga",
            element: (
              <RoleBasedRoute requiredPermission="vistas.agendaCarga.crear" />
            ),
            children: [
              {
                path: "",
                element: <CreateAgendaCargaForm />,
              },
            ],
          },

          // perfil
          {
            path: "miperfil",
            element: <RoleBasedRoute requiredPermission="vistas.perfil.ver" />,
            children: [{ path: "", element: <PerfilUsuario /> }],
          },
          // admin
          {
            path: "admin",
            element: <RoleBasedRoute requiredPermission="vistas.admin.ver" />,
            children: [
              {
                path: "",
                element: <Administration />,
              },
              {
                path: "cajas",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.cajas.ver" />
                ),
                children: [{ path: "", element: <ListarCajas /> }],
              },
              {
                path: "roles",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.roles.ver" />
                ),
                children: [
                  { path: "", element: <RoleManagement /> },
                  {
                    path: "editar/:id",
                    element: <EditRole />,
                  },
                ],
              },
              {
                path: "seguridad",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.seguridad.ver" />
                ),
                children: [{ path: "", element: <Seguridad /> }],
              },
              {
                path: "empresa",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.empresas.ver" />
                ),
                children: [
                  { path: "", element: <Empresa /> },
                  {
                    path: "editar/:id",
                    element: <EditarEmpresa />,
                  },
                ],
              },
              {
                path: "analisis",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.analisis.ver" />
                ),
                children: [{ path: "", element: <Analisis /> }],
              },
              {
                path: "ventas",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.ventas.ver" />
                ),
                children: [
                  { path: "", element: <ListarVentas /> },
                  {
                    path: "ver/:id",
                    element: <VerVenta />,
                  },
                ],
              },
              {
                path: "cotizaciones",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.cotizaciones.ver" />
                ),
                children: [
                  { path: "", element: <ListarCotizaciones /> },
                  {
                    path: "ver/:id",
                    element: <PreviewCotizacion />,
                  },
                ],
              },
              {
                path: "pedidos",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.pedidos.ver" />
                ),
                children: [
                  { path: "", element: <ListarPedidos /> },
                  {
                    path: "ver/:id",
                    element: <VerPedido />,
                  },
                ],
              },
              {
                path: "usuarios",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.usuarios.ver" />
                ),
                children: [
                  { path: "", element: <UserManagement /> },
                  {
                    path: "editar/:id",
                    element: <EditUser />,
                  },
                ],
              },
              {
                path: "viajes",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.admin.ver" />
                ),
                children: [{ path: "", element: <AdminHistorialViajes /> }],
              },
              {
                path: "agendas",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.agendaCarga.ver" />
                ),
                children: [
                  { path: "", element: <ListarAgendasCarga /> },
                  {
                    path: "ver/:id",
                    element: <VerAgendaCarga />,
                  },
                ],
              },
              {
                path: "produccion",
                element: (
                  <RoleBasedRoute requiredPermission="vistas.productos.ver" />
                ),
                children: [
                  { path: "", element: <HistorialProduccion /> },
                  {
                    path: "ver/:id",
                    element: <VerProduccion />,
                  },
                ],
              },
            ],
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
