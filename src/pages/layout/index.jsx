import { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import LoaderComponent from "../../components/common/LoaderComponent";
import Sidebar from "../../components/layout/Sidebar";
import { Outlet } from "react-router";
import Navbar from "../../components/layout/Navbar";
import { LayoutContext } from "../../context/LayoutContext";
import Footer from "../../components/common/Footer";

const Layout = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const drawerWidth = 250;

  const { user, rol, isLoading, isError } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  if (isLoading) return <LoaderComponent />;
  if (isError) return <div>Error al cargar los datos del usuario</div>;
  if (!user) return <LoaderComponent />;

  return (
    <LayoutContext.Provider value={{ drawerWidth }}>
      <Box display="flex" height="100%" width="100%">
        <Sidebar
          user={user}
          rol={rol}
          isNonMobile={isDesktop}
          drawerWidth={drawerWidth}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          minHeight="100vh"
        >
          <Navbar
            user={user}
            rol={rol}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Box flexGrow={1} p={2}>
            <Outlet />
          </Box>
          <Footer /> {/* 👈 Aquí va el Footer */}
        </Box>
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout;
