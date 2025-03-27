import { io } from "socket.io-client";

// Ajusta la URL a tu backend, p. ej. localhost:9000
export const socket = io("http://192.168.1.121:8080", {
  withCredentials: true, // si necesitas cookies, credenciales
  // transports: ["websocket"], // opcional
});
