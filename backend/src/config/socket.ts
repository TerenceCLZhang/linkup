import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

// Stores online users {userId: socketId}
const userSocketMap = new Map();

export const getSocketId = (userId: string) => {
  return userSocketMap.get(userId);
};

io.on("connection", (socket) => {
  console.log("A user has connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap.set(userId, socket.id);
  }

  // Send an event to all connected clients
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log("A user has disconnected", socket.id);

    userSocketMap.delete(userId);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server };
