import { io } from "socket.io-client";

// Ajusta la URL a tu backend, p. ej. localhost:9000
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";
export const socket = io(SOCKET_URL, {
  withCredentials: true, // si necesitas cookies, credenciales
  transports: ["websocket"], // opcional
});
