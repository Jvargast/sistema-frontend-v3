import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import reducers from "./reducers";
import { apiMiddleware, apiReducers } from "./services";
import { loadPOSSelection, savePOSSelection } from "./posPersistence";

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

const API_REDUCER_PATHS = Object.keys(apiReducers || {});

const savedScope = loadScope();
const savedPOS = loadPOSSelection();

const preloadedState = {
  ...(savedScope ? { scope: savedScope } : {}),
  ...(savedPOS ? { pos: savedPOS } : {}),
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: Object.keys(preloadedState).length
    ? preloadedState
    : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        warnAfter: 64,
        ignoredPaths: API_REDUCER_PATHS,
      },
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
        ignoredPaths: API_REDUCER_PATHS,
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

let lastPOS = null;
store.subscribe(() => {
  const { pos } = store.getState();
  if (pos !== lastPOS) {
    lastPOS = pos;
    savePOSSelection(pos);
  }
});

setupListeners(store.dispatch);

export default store;
