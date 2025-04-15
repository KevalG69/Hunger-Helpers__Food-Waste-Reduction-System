import { io } from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:3000", {
  transports: ["websocket"], // force WebSocket transport
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;