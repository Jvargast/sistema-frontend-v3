import { createContext, useContext } from "react";

export const LayoutContext = createContext({
  drawerWidth: 250,
  isSidebarOpen: true,
  resizeCount: 0,
});

export const useLayout = () => useContext(LayoutContext);
