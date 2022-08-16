import { Router } from "express";
import { player } from "../bot/bot";
import { discordAuthMiddleware } from "../middleware/discord-auth";
import { userHasAdminInGuild } from "../services/discord.service";
import { createQueue } from "../services/music.service";
import { SocketManager } from "../utils/socket-manager";

const router = Router();

router.post("/:guildId/queue", discordAuthMiddleware, async (req, res) => {
  if (!req.auth) return res.status(401).send({ error: "Not authenticated" });

  // Check if user has admin in guild
  try {
    if (!(await userHasAdminInGuild(req.auth, req.params.guildId)))
      return res.status(401).send({ error: "Not authorized" });

    const { channelId } = req.body;
    const { guildId } = req.params;

    if (!guildId || !channelId) {
      return res.status(400).send({ error: "Missing guildId or channelId" });
    }

    const queue = await createQueue(guildId, channelId);
    queue.connect(channelId);
    SocketManager.sendToGuild(guildId, "queue-created");
    res.status(200).send({ message: "Queue created" });
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.get("/:guildId/queue", discordAuthMiddleware, async (req, res) => {
  if (!req.auth) return res.status(401).send({ error: "Not authenticated" });

  if (!req.params.guildId) {
    return res.status(400).send({ error: "Missing guildId" });
  }
  const queue = await player.getQueue(req.params.guildId);
  if (!queue) return res.status(200).send({ queue: undefined });

  return res.status(200).send({ queue: queue.tracks });
});

export default router;
