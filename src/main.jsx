import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n.js"
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import Notification from "./components/utils/Notification.jsx";
import NotificationListener from "./components/utils/NotificationListener.jsx";


const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${
  import.meta.env.VITE_API_GOOGLE_MAPS
}&libraries=places&v=weekly&loading=async`;
script.async = true;
script.defer = true;
document.head.appendChild(script);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Notification />
      <NotificationListener />
      <App />
    </Provider>
  </StrictMode>
);
