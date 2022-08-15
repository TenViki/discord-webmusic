import mongoose from "mongoose";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";

import { setupRoutes } from "./routes/router";
import cors from "cors";
import { setup } from "./bot/bot";

dotenv.config();

const main = async () => {
  console.log("BetterGithub app is starting...");

  if (!process.env.MONGO_URL) throw new Error("Env MONGO_URL is not defined");
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");

  const app = express();
  app.use(express.json());

  // Use cors
  app.use(
    cors({
      origin: ["http://localhost:3000"],
    })
  );

  // Import and setup routes
  setupRoutes(app);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send("Something broke!");
  });

  // Start listening
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`BetterGithub app is listening on port ${port}`);
  });

  // Setup bot
  setup();
};

main();
