import { useRef } from "react";
import PropTypes from "prop-types";
import { RefreshBusContext } from "./RefreshBusContextDef";

export function RefreshBusProvider({ children }) {
  const mapRef = useRef(new Map());

  const register = (key, fn) => {
    if (!mapRef.current.has(key)) mapRef.current.set(key, new Set());
    mapRef.current.get(key).add(fn);
    return () => {
      const set = mapRef.current.get(key);
      if (!set) return;
      set.delete(fn);
      if (set.size === 0) mapRef.current.delete(key);
    };
  };

  // corre TODOS los handlers de esa key
  const run = async (key) => {
    const set = mapRef.current.get(key);
    if (!set || set.size === 0) return false;
    const fns = Array.from(set);
    try {
      await Promise.all(
        fns.map(async (fn) => {
          try {
            const r = await fn();
            return r;
          } catch {
            return true;
          }
        })
      );
      return true;
    } catch {
      return true;
    }
  };

  const value = { register, run };
  return (
    <RefreshBusContext.Provider value={value}>
      {children}
    </RefreshBusContext.Provider>
  );
}

RefreshBusProvider.propTypes = {
  children: PropTypes.any,
};
