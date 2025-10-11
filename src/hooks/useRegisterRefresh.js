import { useEffect } from "react";
import { useRefreshBus } from "../context/RefreshBusContextDef";

export function useRegisterRefresh(key, fn, deps = []) {
  const { register } = useRefreshBus();
  useEffect(() => {
    const unregister = register(key, fn);
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, key, ...deps]);
}
