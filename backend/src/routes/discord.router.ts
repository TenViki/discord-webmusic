import express from "express";
import { discordAuthMiddleware } from "../middleware/discord-auth";
import * as discordService from "../services/discord.service";

const router = express.Router();

router.get("/guilds", discordAuthMiddleware, async (req, res) => {
  if (!req.auth) return res.status(401).send({ error: "Not authenticated" });
  const guilds = await discordService.getGuilds(req.auth);
  res.send(guilds);
});

router.get("/guilds/:guildId", discordAuthMiddleware, async (req, res) => {
  if (!req.auth) return res.status(401).send({ error: "Not authenticated" });
  const guild = await discordService.getChannelsInGuild(
    req.auth,
    req.params.guildId
  );
  res.send(guild);
});

export default router;
