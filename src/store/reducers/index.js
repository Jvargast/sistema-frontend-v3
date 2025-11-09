import authReducer from "./authSlice";
import globalReducer from "./globalSlice";
import cartReducer from "./cartSlice";
import notificacionReducer from "./notificacionSlice";
import notificacionesReducer from "./notificacionesSlice";
import agendaViajeReducer from "./agendaViajesSlice";
import tabReducer from "./tabSlice";
import sucursalReducer from "./sucursalSlice";
import scopeReducer from "./scopeSlice"; 
import posReducer from "./posSlice";

const reducers = {
  global: globalReducer,
  auth: authReducer,
  notificacion: notificacionReducer,
  cart: cartReducer,
  notificaciones: notificacionesReducer,
  agenda: agendaViajeReducer,
  tabs: tabReducer,
  sucursal: sucursalReducer,
  scope: scopeReducer,
  pos: posReducer,
};

export default reducers;
