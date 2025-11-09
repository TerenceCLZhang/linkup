import express, { Request, Response } from "express";
import morgan from "morgan";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import bodyParser from "body-parser";
import { app, server } from "./config/socket.js";
import chatRoutes from "./routes/chatRoutes.js";
import path from "path";

const __dirname = path.resolve();

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // ~1.6 req/s
    standardHeaders: true,
    legacyHeaders: false,
    message:
      "Too many requests sent from this IP. Please wait a few seconds and try again.",
  })
);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

if (ENV.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendBuildPath));

  app.get("/*", (_req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

server.listen(ENV.PORT, () => {
  console.log(`Server is listening on port ${ENV.PORT}`);
});
