import express from "express";
import { discordAuthMiddleware } from "../middleware/discord-auth";
import { Webhook } from "../models/webhook.model";
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

router.post(
  "/guilds/:guildId/:channelId",
  discordAuthMiddleware,
  async (req, res) => {
    if (!req.auth) return res.status(401).send({ error: "Not authenticated" });

    const userGuilds = await discordService.getUserGuilds(req.auth);
    const adminUserGuilds = userGuilds.filter(
      (guild) => (guild.permissions & 0x8) === 0x8
    );

    if (!adminUserGuilds.find((guild) => guild.id === req.params.guildId)) {
      return res.status(403).send({
        error: "User does not have administrator permissions in this guild",
      });
    }

    const guild = await discordService.getChannelsInGuild(
      req.auth,
      req.params.guildId,
      userGuilds
    );

    const channel = guild.channels.find(
      (channel) => channel.id === req.params.channelId
    );

    if (!channel) {
      return res.status(404).send({ error: "Channel not found" });
    }

    if (!channel.canSendMessages) {
      return res.status(403).send({
        error: "User does not have permission to send messages in this channel",
      });
    }

    await Webhook.deleteMany({ channel: channel.id });

    // Create webhook
    const webhook = await Webhook.create({
      channel: channel.id,
      guild: guild.guild.id,
    });

    res.send({ ...webhook.toObject() });
  }
);

export default router;
