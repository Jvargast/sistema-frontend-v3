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
  cajaApi.middleware,
  movimientoCajaApi.middleware,
  ventasApi.middleware,
  camionesApi.middleware,
  inventarioCamionApi.middleware,
  pedidosApi.middleware,
  agendaCargaApi.middleware,
  agendaViajesApi.middleware,
  entregasApi.middleware,
  ventasChoferApi.middleware,
  pagosApi.middleware,
  documentoApi.middleware,
  ventasEstadisticasApi.middleware,
  pedidosEstadisticasApi.middleware,
  productosEstadisticasApi.middleware,
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
  [tipoInsumoApi.reducerPath]: tipoInsumoApi.reducer,
  [cajaApi.reducerPath]: cajaApi.reducer,
  [movimientoCajaApi.reducerPath]: movimientoCajaApi.reducer,
  [ventasApi.reducerPath]: ventasApi.reducer,
  [camionesApi.reducerPath]: camionesApi.reducer,
  [inventarioCamionApi.reducerPath]: inventarioCamionApi.reducer,
  [pedidosApi.reducerPath]: pedidosApi.reducer,
  [agendaCargaApi.reducerPath]: agendaCargaApi.reducer,
  [agendaViajesApi.reducerPath]: agendaViajesApi.reducer,
  [entregasApi.reducerPath]: entregasApi.reducer,
  [ventasChoferApi.reducerPath]: ventasChoferApi.reducer,
  [pagosApi.reducerPath]: pagosApi.reducer,
  [documentoApi.reducerPath]: documentoApi.reducer,
  [ventasEstadisticasApi.reducerPath]: ventasEstadisticasApi.reducer,
  [pedidosEstadisticasApi.reducerPath]: pedidosEstadisticasApi.reducer,
  [productosEstadisticasApi.reducerPath]: productosEstadisticasApi.reducer,
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
  cajaApi,
  movimientoCajaApi,
  ventasApi,
  camionesApi,
  inventarioCamionApi,
  pedidosApi,
  agendaCargaApi,
  agendaViajesApi,
  entregasApi,
  ventasChoferApi,
  pagosApi,
  documentoApi,
  pedidosEstadisticasApi,
  ventasEstadisticasApi,
  productosEstadisticasApi,
};

export default apiServices;
