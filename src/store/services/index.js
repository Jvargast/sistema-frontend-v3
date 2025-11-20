import { authApi } from "./authApi";
import { usuariosApi } from "./usuariosApi";
import { clientesApi } from "./clientesApi";
import { rolesApi } from "./rolesApi";
import { permisosApi } from "./permisosRolesApi";
import { empresaApi } from "./empresaApi";
import { auditLogsApi } from "./auditLogsApi";
import { logVentasApi } from "./logVentasApi";
import { categoriaApi } from "./categoriaApi";
import { productoApi } from "./productoApi";
import { estadoProductoApi } from "./estadoProductoApi";
import { insumoApi } from "./insumoApi";
import { tipoInsumoApi } from "./tipoInsumoApi";
import { cajaApi } from "./cajaApi";
import { ventasApi } from "./ventasApi";
import { movimientoCajaApi } from "./movimientoCajaApi";
import { camionesApi } from "./camionesApi";
import { inventarioCamionApi } from "./inventarioCamionApi";
import { pedidosApi } from "./pedidosApi";
import { agendaCargaApi } from "./agendaCargaApi";
import { agendaViajesApi } from "./agendaViajesApi";
import { entregasApi } from "./entregasApi";
import { ventasChoferApi } from "./ventasChoferApi";
import { pagosApi } from "./pagosApi";
import { documentoApi } from "./documentoApi";
import { pedidosEstadisticasApi } from "./pedidosEstadisticasApi";
import { ventasEstadisticasApi } from "./ventasEstadisticasApi";
import { productosEstadisticasApi } from "./productosEstadisticasApi";
import { cotizacionesApi } from "./cotizacionesApi";
import { cuentasPorCobrarApi } from "./cuentasPorCobrarApi";
import { busquedaApi } from "./busquedaApi";
import { formulaProductoApi } from "./FormulaProductoApi";
import { produccionApi } from "./produccionApi";
import { productoRetornableApi } from "./productoRetornableApi";
import { inventarioApi } from "./inventarioApi";
import { proveedorApi } from "./proveedorApi";
import { compraApi } from "./compraApi";
import { centroCostoApi } from "./centroCostoApi";
import { ordenPagoApi } from "./ordenPagoApi";
import { categoriaGastoApi } from "./categoriaGastoApi";
import { gastoApi } from "./gastoApi";
import { preferencesApi } from "./preferencesApi";
import { reportesAnalisisApi } from "./reportesAnalisisApi";

export const apiMiddleware = [
  authApi.middleware,
  usuariosApi.middleware,
  clientesApi.middleware,
  rolesApi.middleware,
  permisosApi.middleware,
  empresaApi.middleware,
  auditLogsApi.middleware,
  logVentasApi.middleware,
  categoriaApi.middleware,
  productoApi.middleware,
  insumoApi.middleware,
  tipoInsumoApi.middleware,
  estadoProductoApi.middleware,
  formulaProductoApi.middleware,
  cajaApi.middleware,
  movimientoCajaApi.middleware,
  ventasApi.middleware,
  cotizacionesApi.middleware,
  camionesApi.middleware,
  inventarioCamionApi.middleware,
  pedidosApi.middleware,
  agendaCargaApi.middleware,
  agendaViajesApi.middleware,
  entregasApi.middleware,
  ventasChoferApi.middleware,
  pagosApi.middleware,
  documentoApi.middleware,
  cuentasPorCobrarApi.middleware,
  ventasEstadisticasApi.middleware,
  pedidosEstadisticasApi.middleware,
  productosEstadisticasApi.middleware,
  busquedaApi.middleware,
  produccionApi.middleware,
  productoRetornableApi.middleware,
  inventarioApi.middleware,
  proveedorApi.middleware,
  compraApi.middleware,
  centroCostoApi.middleware,
  ordenPagoApi.middleware,
  categoriaGastoApi.middleware,
  gastoApi.middleware,
  preferencesApi.middleware,
  reportesAnalisisApi.middleware
];

export const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [usuariosApi.reducerPath]: usuariosApi.reducer,
  [clientesApi.reducerPath]: clientesApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [permisosApi.reducerPath]: permisosApi.reducer,
  [empresaApi.reducerPath]: empresaApi.reducer,
  [auditLogsApi.reducerPath]: auditLogsApi.reducer,
  [logVentasApi.reducerPath]: logVentasApi.reducer,
  [categoriaApi.reducerPath]: categoriaApi.reducer,
  [productoApi.reducerPath]: productoApi.reducer,
  [insumoApi.reducerPath]: insumoApi.reducer,
  [estadoProductoApi.reducerPath]: estadoProductoApi.reducer,
  [formulaProductoApi.reducerPath]: formulaProductoApi.reducer,
  [tipoInsumoApi.reducerPath]: tipoInsumoApi.reducer,
  [cajaApi.reducerPath]: cajaApi.reducer,
  [movimientoCajaApi.reducerPath]: movimientoCajaApi.reducer,
  [ventasApi.reducerPath]: ventasApi.reducer,
  [cotizacionesApi.reducerPath]: cotizacionesApi.reducer,
  [camionesApi.reducerPath]: camionesApi.reducer,
  [inventarioCamionApi.reducerPath]: inventarioCamionApi.reducer,
  [pedidosApi.reducerPath]: pedidosApi.reducer,
  [agendaCargaApi.reducerPath]: agendaCargaApi.reducer,
  [agendaViajesApi.reducerPath]: agendaViajesApi.reducer,
  [entregasApi.reducerPath]: entregasApi.reducer,
  [ventasChoferApi.reducerPath]: ventasChoferApi.reducer,
  [pagosApi.reducerPath]: pagosApi.reducer,
  [documentoApi.reducerPath]: documentoApi.reducer,
  [cuentasPorCobrarApi.reducerPath]: cuentasPorCobrarApi.reducer,
  [ventasEstadisticasApi.reducerPath]: ventasEstadisticasApi.reducer,
  [pedidosEstadisticasApi.reducerPath]: pedidosEstadisticasApi.reducer,
  [productosEstadisticasApi.reducerPath]: productosEstadisticasApi.reducer,
  [busquedaApi.reducerPath]: busquedaApi.reducer,
  [produccionApi.reducerPath]: produccionApi.reducer,
  [productoRetornableApi.reducerPath]: productoRetornableApi.reducer,
  [inventarioApi.reducerPath]: inventarioApi.reducer,
  [proveedorApi.reducerPath]: proveedorApi.reducer,
  [compraApi.reducerPath]: compraApi.reducer,
  [centroCostoApi.reducerPath]: centroCostoApi.reducer,
  [ordenPagoApi.reducerPath]: ordenPagoApi.reducer,
  [categoriaGastoApi.reducerPath]: categoriaGastoApi.reducer,
  [gastoApi.reducerPath]: gastoApi.reducer,
  [preferencesApi.reducerPath]: preferencesApi.reducer,
  [reportesAnalisisApi.reducerPath]: reportesAnalisisApi.reducer
};

const apiServices = {
  authApi,
  usuariosApi,
  clientesApi,
  rolesApi,
  permisosApi,
  empresaApi,
  auditLogsApi,
  logVentasApi,
  categoriaApi,
  productoApi,
  insumoApi,
  estadoProductoApi,
  tipoInsumoApi,
  formulaProductoApi,
  cajaApi,
  movimientoCajaApi,
  ventasApi,
  cotizacionesApi,
  camionesApi,
  inventarioCamionApi,
  pedidosApi,
  agendaCargaApi,
  agendaViajesApi,
  entregasApi,
  ventasChoferApi,
  pagosApi,
  documentoApi,
  cuentasPorCobrarApi,
  pedidosEstadisticasApi,
  ventasEstadisticasApi,
  productosEstadisticasApi,
  busquedaApi,
  produccionApi,
  productoRetornableApi,
  inventarioApi,
  proveedorApi,
  compraApi,
  centroCostoApi,
  ordenPagoApi,
  categoriaGastoApi,
  gastoApi,
  preferencesApi,
  reportesAnalisisApi
};

export default apiServices;
