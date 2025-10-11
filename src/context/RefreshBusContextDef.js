import { createContext, useContext } from "react";

export const RefreshBusContext = createContext(null);

export function useRefreshBus() {
  const ctx = useContext(RefreshBusContext);
  if (!ctx) throw new Error("useRefreshBus must be used inside provider");
  return ctx;
}
