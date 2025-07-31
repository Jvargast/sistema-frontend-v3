import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n.js";
import "leaflet/dist/leaflet.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import Notification from "./components/utils/Notification.jsx";
import NotificationListener from "./components/utils/NotificationListener.jsx";
import { LoadScript } from "@react-google-maps/api";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_API_GOOGLE_MAPS}
        libraries={["places", "marker"]}
        language="es"
        region="CL"
      >
        <Notification />
        <NotificationListener />
        <App />
      </LoadScript>
    </Provider>
  </StrictMode>
);
