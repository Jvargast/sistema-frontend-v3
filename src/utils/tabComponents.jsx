import DashboardCentral from "../pages/dashboard/DashboardCentral";
import PuntoDeVenta from "../pages/ventas/PuntoDeVenta";
import ListarCuentasPorCobrar from "../pages/facturas";
import ListarPagos from "../pages/pagos";
import CrearCotizacion from "../pages/cotizaciones";
import CrearPedido from "../pages/pedidos/CrearPedido";
import PedidosBoard from "../pages/pedidos/VerPedidos";
import MisPedidos from "../pages/pedidos/MisPedidos";
import Clientes from "../pages/clientes";
import CategoriaManagement from "../pages/categorias";
import Productos from "../pages/productos";
import Insumos from "../pages/insumos";
import TipoInsumoManagement from "../pages/tipoinsumos";
import ListarFormulasProductos from "../pages/formulas";
import PanelProduccion from "../pages/produccion";
import CamionesManagement from "../pages/camiones";
import InspeccionRetornables from "../pages/inventario_camion";
import CreateAgendaCargaForm from "../pages/agenda_carga/CrearCarga";
import PanelViajeChofer from "../pages/viajes/PanelViajesChofer";
import ListarMisVentas from "../pages/ventas_chofer/ListarMisVentas";
import Administration from "../pages/administration";
import UserManagement from "../pages/administration/usuarios";
import PerfilUsuario from "../pages/profile";
import Analisis from "../pages/analisis";
import RoleBasedRoute from "../components/utils/RoleBasedRoute";
import ListaVentas from "../pages/ventas/ListarVentas";
import ListarPedidos from "../pages/pedidos/ListarPedidos";
import ListarCotizaciones from "../pages/cotizaciones/ListarCotizaciones";
import ListarCajas from "../pages/cajas";
import RoleManagement from "../pages/administration/roles/RoleManagement";
import Seguridad from "../pages/administration/seguridad";
import Empresa from "../pages/administration/empresa";
import AdminHistorialViajes from "../pages/viajes/AdminHistorialViajes";
import ListarAgendasCarga from "../pages/agenda_carga/ListarAgendasCarga";
import HistorialProduccion from "../pages/produccion/HistorialProduccion";

export const tabComponents = {
  // Dashboard
  dashboard: (
    <RoleBasedRoute requiredPermission="vistas.dashboard.ver">
      <DashboardCentral />
    </RoleBasedRoute>
  ),
  // facturas
  facturas: (
    <RoleBasedRoute requiredPermission="vistas.facturas.ver">
      <ListarCuentasPorCobrar />
    </RoleBasedRoute>
  ),
  // pagos
  pagos: (
    <RoleBasedRoute requiredPermission="vistas.pagos.ver">
      <ListarPagos />
    </RoleBasedRoute>
  ),
  // puntos
  "punto-cotizacion": (
    <RoleBasedRoute requiredPermission="vistas.puntocotizacion.ver">
      <CrearCotizacion />
    </RoleBasedRoute>
  ),
  "punto-pedido": (
    <RoleBasedRoute requiredPermission="vistas.pedidos.ver">
      <CrearPedido />
    </RoleBasedRoute>
  ),
  "punto-venta": (
    <RoleBasedRoute requiredPermission="vistas.puntoventa.ver">
      <PuntoDeVenta />
    </RoleBasedRoute>
  ),
  // clientes
  clientes: (
    <RoleBasedRoute requiredPermission="vistas.clientes.ver">
      <Clientes />
    </RoleBasedRoute>
  ),
  // Inventario
  productos: (
    <RoleBasedRoute requiredPermission="vistas.productos.ver">
      <Productos />
    </RoleBasedRoute>
  ),
  insumos: (
    <RoleBasedRoute requiredPermission="vistas.insumos.ver">
      <Insumos />
    </RoleBasedRoute>
  ),
  categorias: (
    <RoleBasedRoute requiredPermission="vistas.categorias.ver">
      <CategoriaManagement />
    </RoleBasedRoute>
  ),
  "tipo-insumo": (
    <RoleBasedRoute requiredPermission="vistas.tipoinsumos.ver">
      <TipoInsumoManagement />
    </RoleBasedRoute>
  ),
  formulas: (
    <RoleBasedRoute requiredPermission="vistas.productos.ver">
      <ListarFormulasProductos />
    </RoleBasedRoute>
  ),
  produccion: (
    <RoleBasedRoute requiredPermission="vistas.productos.ver">
      <PanelProduccion />
    </RoleBasedRoute>
  ),
  // Entregas
  "admin-pedidos": (
    <RoleBasedRoute requiredPermission="vistas.adminpedidos.ver">
      <PedidosBoard />
    </RoleBasedRoute>
  ),
  camiones: (
    <RoleBasedRoute requiredPermission="vistas.camiones.ver">
      <CamionesManagement />
    </RoleBasedRoute>
  ),
  "inventario-camion": (
    <RoleBasedRoute requiredPermission="vistas.camiones.ver">
      <InspeccionRetornables />
    </RoleBasedRoute>
  ),
  "agenda-carga": (
    <RoleBasedRoute requiredPermission="vistas.agendaCarga.crear">
      <CreateAgendaCargaForm />
    </RoleBasedRoute>
  ),
  viajes: (
    <RoleBasedRoute requiredPermission="vistas.viajes.ver">
      <PanelViajeChofer />
    </RoleBasedRoute>
  ),
  "mis-pedidos": (
    <RoleBasedRoute requiredPermission="vistas.mispedidos.ver">
      <MisPedidos />
    </RoleBasedRoute>
  ),
  misventas: (
    <RoleBasedRoute requiredPermission="vistas.mispedidos.ver">
      <ListarMisVentas />
    </RoleBasedRoute>
  ),
  // Gestión/Admin
  admin: (
    <RoleBasedRoute requiredPermission="vistas.admin.ver">
      <Administration />
    </RoleBasedRoute>
  ),
  "admin/usuarios": (
    <RoleBasedRoute requiredPermission="vistas.usuarios.ver">
      <UserManagement />
    </RoleBasedRoute>
  ),
  "admin/ventas": (
    <RoleBasedRoute requiredPermission="vistas.ventas.ver">
      <ListaVentas />
    </RoleBasedRoute>
  ),
  "admin/pedidos": (
    <RoleBasedRoute requiredPermission="vistas.pedidos.ver">
      <ListarPedidos />
    </RoleBasedRoute>
  ),
  "admin/cotizaciones": (
    <RoleBasedRoute requiredPermission="vistas.cotizaciones.ver">
      <ListarCotizaciones />
    </RoleBasedRoute>
  ),
  "admin/cajas": (
    <RoleBasedRoute requiredPermission="vistas.cajas.ver">
      <ListarCajas />
    </RoleBasedRoute>
  ),
  "admin/roles": (
    <RoleBasedRoute requiredPermission="vistas.roles.ver">
      <RoleManagement />
    </RoleBasedRoute>
  ),
  "admin/seguridad": (
    <RoleBasedRoute requiredPermission="vistas.seguridad.ver">
      <Seguridad />
    </RoleBasedRoute>
  ),
  "admin/empresa": (
    <RoleBasedRoute requiredPermission="vistas.empresas.ver">
      <Empresa />
    </RoleBasedRoute>
  ),
  "admin/analisis": (
    <RoleBasedRoute requiredPermission="vistas.analisis.ver">
      <Analisis />
    </RoleBasedRoute>
  ),
  "admin/viajes": (
    <RoleBasedRoute requiredPermission="vistas.admin.ver">
      <AdminHistorialViajes />
    </RoleBasedRoute>
  ),
  "admin/agendas": (
    <RoleBasedRoute requiredPermission="vistas.agendaCarga.ver">
      <ListarAgendasCarga />
    </RoleBasedRoute>
  ),
  "admin/produccion": (
    <RoleBasedRoute requiredPermission="vistas.productos.ver">
      <HistorialProduccion />
    </RoleBasedRoute>
  ), 
  // Perfil y otros módulos extra
  miperfil: (
    <RoleBasedRoute requiredPermission="vistas.perfil.ver">
      <PerfilUsuario />
    </RoleBasedRoute>
  ),
};
