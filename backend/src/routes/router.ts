import express from "express";
import authRouter from "./auth.router";
import router from "./discord.router";

export const setupRoutes = (app: express.Application) => {
  app.use("/auth", authRouter);
  app.use("/discord", router);
};
