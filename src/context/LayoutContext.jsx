import { createContext, useContext } from "react";

export const LayoutContext = createContext({ drawerWidth: 250 });

export const useLayout = () => useContext(LayoutContext);
