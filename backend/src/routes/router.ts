import express from "express";
import authRouter from "./auth.router";
import router from "./discord.router";
import webhookRouter from "./webhook.router";

export const setupRoutes = (app: express.Application) => {
  app.use("/auth", authRouter);
  app.use("/discord", router);
  app.use("/webhooks", webhookRouter);
};
