import { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import LoaderComponent from "../../components/common/LoaderComponent";
import Sidebar from "../../components/layout/Sidebar";
import { Outlet } from "react-router";
import Navbar from "../../components/layout/Navbar";
import { LayoutContext } from "../../context/LayoutContext";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isNonMobile);
  const drawerWidth = 250;

  const { user, rol, isLoading, isError } = useSelector((state) => state.auth);

  // Actualizar estado de la barra lateral según el ancho de pantalla
  useEffect(() => {
    setIsSidebarOpen(isNonMobile);
  }, [isNonMobile]);

  // Manejo de estados de carga y error
  if (isLoading) return <LoaderComponent />;
  if (isError) return <div>Error al cargar los datos del usuario</div>;

  // Validación para asegurarse de que el usuario está disponible
  if (!user) {
    return <LoaderComponent />;
  }

  return (
    <LayoutContext.Provider value={{ drawerWidth }}>
      <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
        <Sidebar
          user={user}
          rol={rol}
          isNonMobile={isNonMobile}
          drawerWidth={drawerWidth}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Box flexGrow={1}>
          <Navbar
            user={user}
            rol={rol}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Box p={2}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout;
