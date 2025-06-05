import { createContext, useContext } from "react";

export const LayoutContext = createContext({ drawerWidth: 250, isSidebarOpen: true });

export const useLayout = () => useContext(LayoutContext);
