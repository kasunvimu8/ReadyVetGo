import { Server, Socket } from "socket.io";
import ChatSocket from "./src/sockets/chatSocket";
import { authenticateSocket } from "./src/sockets/authentification";
import { updateTheOnlineStatus, setAllProfilesOffline } from "@controllers/profile.controller";
import http from "http";

export let io: Server;

// Initialize Socket.IO
export const initializeSocketIO = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true
    }
  });

  // Set all profiles offline at the server start then allow socket connections
  initializeProfiles().then(() =>
    io.on("connection", async (socket: Socket) => {
      try {
        socket.data.authorized_user = await authenticateSocket(socket); // add authenticated user to the socket
        ChatSocket(socket, io);

        void updateTheOnlineStatus(socket.data.authorized_user.id, true);
        socket.on("disconnect", () => {
          updateTheOnlineStatus(socket.data.authorized_user.id, false);
        });
      } catch (error) {
        socket.disconnect();
      }
    })
  );
};

// Set all profiles offline at the server start
export const initializeProfiles = async () => {
  await setAllProfilesOffline();
};
