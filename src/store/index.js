import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import reducers from "./reducers";
import { apiMiddleware, apiReducers } from "./services";

const SCOPE_KEY = "app_scope";

function loadScope() {
  try {
    const raw = localStorage.getItem(SCOPE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveScope(scope) {
  try {
    localStorage.setItem(SCOPE_KEY, JSON.stringify(scope));
  } catch {
    // Intentionally ignore write errors
  }
}

const rootReducer = combineReducers({
  ...reducers,
  ...apiReducers,
});

const savedScope = loadScope();
const preloadedState = savedScope ? { scope: savedScope } : undefined;

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
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

store.subscribe(() => {
  const { scope } = store.getState();
  if (scope) {
    saveScope({
      activeSucursalId: scope.activeSucursalId,
      mode: scope.mode,
    });
  }
});

setupListeners(store.dispatch);

export default store;
