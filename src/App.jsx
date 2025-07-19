import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css"; 
import router from "./routes";
import { themeSettings } from "./theme";
import { useGetAuthenticatedUserQuery } from "./store/services/authApi";
import { logout } from "./store/reducers/authSlice";
import LoaderComponent from "./components/common/LoaderComponent";
import TabsPersister from "./store/TabPersister";

function App() {
  const dispatch = useDispatch();

  const mode = useSelector((state) => state?.global?.mode);
  const rol = useSelector((state) => state?.auth?.rol);

  const theme = createTheme(themeSettings(mode, rol));
  const { isLoading, error } = useGetAuthenticatedUserQuery();

  useEffect(() => {
    if (error) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TabsPersister />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
