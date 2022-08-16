import mongoose from "mongoose";
import dotenv from "dotenv";

import { createServer } from "http";

import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";

import { setupRoutes } from "./routes/router";
import cors from "cors";
import { setup } from "./bot/bot";
import axios from "axios";
import { Player } from "discord-player";
import { Server } from "socket.io";
import { validateToken } from "./middleware/discord-auth";
import { SocketManager } from "./utils/socket-manager";

dotenv.config();

console.log("BetterGithub app is starting...");

if (!process.env.MONGO_URL) throw new Error("Env MONGO_URL is not defined");
mongoose.connect(process.env.MONGO_URL).catch((error) => {
  console.error(error);
  process.exit(1);
});
console.log("Connected to MongoDB");

const app = express();
app.use(express.json());

// Use cors
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// Import and setup routes
setupRoutes(app);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (axios.isAxiosError(err)) {
    console.log("HTTP ERROR: " + err.response?.status, err?.response?.data);
  } else {
    console.log(err);
  }
  res.status(500).send("Something broke!");
});

// Start listening
const port = process.env.PORT || 3000;

const httpServer = createServer(app);

httpServer.listen(port, () => {
  console.log(`BetterGithub app is listening on port ${port}`);
});

// Setup bot
setup();

export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected " + socket.id);

  socket.on("auth", async (token: string) => {
    const user = await validateToken(token);

    if (user) {
      socket.emit("auth-success", user);
      SocketManager.registerSocket(socket, user);
    }
  });
});
