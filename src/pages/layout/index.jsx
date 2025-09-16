import { useState, useEffect, useRef } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router";
import LoaderComponent from "../../components/common/LoaderComponent";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { LayoutContext } from "../../context/LayoutContext";
import Footer from "../../components/common/Footer";
import DynamicTabsBar from "../../components/layout/DynamicTabsBar";
import WelcomePage from "../../components/common/WelcomePage";

import {
  shouldUseRouterPath,
} from "../../utils/tabsConfig";

const Layout = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const drawerWidth = 250;
  const navigate = useNavigate();

  const layoutContainerRef = useRef();
  const [resizeCount, setResizeCount] = useState(0);

  const { openTabs, activeTab } = useSelector((state) => state.tabs);
  const { user, rol, isLoading, isError } = useSelector((state) => state.auth);

  const { pathname } = useLocation();
  const currentPath = pathname.replace(/^\//, "");

  const justClosedLastTabRef = useRef(false);
  const prevTabsLenRef = useRef(openTabs.length);
  const isRouterOnly = shouldUseRouterPath(currentPath);

  useEffect(() => {
    if (prevTabsLenRef.current === 1 && openTabs.length === 0) {
      justClosedLastTabRef.current = true;
    }
    prevTabsLenRef.current = openTabs.length;
  }, [openTabs.length]);

  useEffect(() => {
    if (!layoutContainerRef.current) return;
    const observer = new ResizeObserver(() => setResizeCount((p) => p + 1));
    observer.observe(layoutContainerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    if (isRouterOnly) return; 
    if (openTabs.length === 0 && pathname !== "/" && pathname !== "/#") {
      navigate("/");
    }
  }, [isDesktop, isRouterOnly, openTabs.length, pathname, navigate]);

  useEffect(() => {
    if (
      isDesktop &&
      openTabs.length === 0 &&
      pathname !== "/" &&
      pathname !== "/#"
    ) {
      navigate("/");
    }
  }, [isDesktop, openTabs.length, pathname, navigate]);

  useEffect(() => {
    if (pathname === "/" || openTabs.length > 0) {
      justClosedLastTabRef.current = false;
    }
  }, [pathname, openTabs.length]);

  const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
  const isWelcome =
    isDesktop &&
    openTabs.length === 0 &&
    (cleanPath === "" || cleanPath === "#");

  if (isLoading) return <LoaderComponent />;
  if (isError) return <div>Error al cargar los datos del usuario</div>;
  if (!user) return <LoaderComponent />;

  return (
    <LayoutContext.Provider value={{ drawerWidth, isSidebarOpen, resizeCount }}>
      <Box
        display="flex"
        flexDirection="row"
        height="100dvh"
        width="100%"
        ref={layoutContainerRef}
        sx={{ overflow: "hidden" }}
      >
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
          minWidth={0}
          overflow="hidden"
        >
          <Navbar
            user={user}
            rol={rol}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          {isDesktop && openTabs.length > 0 && (
            <DynamicTabsBar isDesktop={isDesktop} />
          )}

          <Box
            flexGrow={1}
            minWidth={0}
            sx={{
              overflowY: "auto",
              pb: {
                xs: "calc(56px + env(safe-area-inset-bottom, 0px))",
                md: 0,
              },
            }}
          >
            {isDesktop ? (
              isWelcome || !activeTab ? (
                <WelcomePage />
              ) : (
                <Outlet />
              )
            ) : (
              <Outlet />
            )}
          </Box>

          <Footer />
        </Box>
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout;
