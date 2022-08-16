import { Router } from "express";
import { discordAuthMiddleware } from "../middleware/discord-auth";
import { createQueue } from "../services/music.service";

const router = Router();

router.post("/:guildId/queue", discordAuthMiddleware, async (req, res) => {
  if (!req.auth) return res.status(401).send({ error: "Not authenticated" });
  const { channelId } = req.body;
  const { guildId } = req.params;

  if (!guildId || !channelId) {
    return res.status(400).send({ error: "Missing guildId or channelId" });
  }

  const queue = await createQueue(guildId, channelId);
  queue.connect(channelId);
  res.status(200).send({ message: "Queue created" });
});

export default router;
