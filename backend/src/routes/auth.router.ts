import axios from "axios";
import express from "express";
import { discordAuthMiddleware } from "../middleware/discord-auth";
import * as discordAuthService from "../services/discordauth.service";
import { DiscordUser } from "../types/auth";
// Create router
const authRouter = express.Router();

authRouter.get("/", discordAuthMiddleware, async (req, res) => {
  const user = await discordAuthService.getDiscordUser(req.auth!);
  res.send(user);
});

authRouter.post("/", async (req, res) => {
  if (!req.body.code) {
    return res.status(400).send({ error: "Missing code" });
  }

  let data: DiscordUser & { token: string };

  try {
    data = await discordAuthService.getDiscordAuth(req.body.code);
  } catch (error) {
    return res.status(401).send({ error: "Invalid code" });
  }

  res.send(data);
});

export default authRouter;
