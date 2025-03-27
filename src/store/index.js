import { combineReducers, configureStore } from "@reduxjs/toolkit";
/* import { apiReducers, apiMiddleware } from "../services/api-backend"; */
import { setupListeners } from "@reduxjs/toolkit/query";
import reducers from "./reducers";
import { apiMiddleware, apiReducers } from "./services";


const rootReducer = combineReducers({
  ...reducers,
  ...apiReducers,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(apiMiddleware),
  devTools: true,
});

// Configurar reintentos automáticos para RTK Query
setupListeners(store.dispatch);

export default store;
