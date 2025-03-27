import authReducer from "./authSlice";
import globalReducer from "./globalSlice";
import cartReducer from "./cartSlice";
import notificacionReducer from "./notificacionSlice";
import notificacionesReducer from "./notificacionesSlice";
import agendaViajeReducer from "./agendaViajesSlice";

const reducers = {
  global: globalReducer,
  auth: authReducer,
  notificacion: notificacionReducer,
  cart: cartReducer,
  notificaciones: notificacionesReducer,
  agenda: agendaViajeReducer
};

export default reducers;
