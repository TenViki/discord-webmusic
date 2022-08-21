import { QueryType, Track } from "discord-player";
import { Router } from "express";
import { player } from "../bot/bot";
import { discordAuthMiddleware } from "../middleware/discord-auth";
import { userHasAdminInGuild } from "../services/discord.service";
import { createQueue } from "../services/music.service";
import { SocketManager } from "../utils/socket-manager";
import playdl from "play-dl";

const router = Router();

router.post("/:guildId/queue", discordAuthMiddleware, async (req, res) => {
  if (!req.auth) return res.status(401).send({ error: "Not authenticated" });

  // Check if user has admin in guild
  try {
    if (!(await userHasAdminInGuild(req.auth, req.params.guildId))) return res.status(401).send({ error: "Not authorized" });

    const { channelId } = req.body;
    const { guildId } = req.params;

    if (!guildId || !channelId) {
      return res.status(400).send({ error: "Missing guildId or channelId" });
    }

    const queue = await createQueue(guildId, channelId, {
      onBeforeCreateStream: async (track, source, _queue) => {
        // only trap youtube source
        // track here would be youtube track
        return (await playdl.stream(track.url, { discordPlayerCompatibility: true })).stream;
        // we must return readable stream or void (returning void means telling discord-player to look for default extractor)
      },
    });
    queue.connect(channelId);
    SocketManager.sendToGuild(guildId, "queue-created");
    return res.status(200).send({ message: "Queue created" });
  } catch (error) {
    return res.status(500).send({ error: "Something went wrong" });
  }
});

router.get("/:guildId/queue", discordAuthMiddleware, async (req, res) => {
  if (!req.auth) return res.status(401).send({ error: "Not authenticated" });

  if (!req.params.guildId) {
    return res.status(400).send({ error: "Missing guildId" });
  }
  const queue = await player.getQueue(req.params.guildId);
  if (!queue) return res.status(200).send({ queue: null });

  return res.status(200).send({ queue: queue.tracks });
});

router.get("/search/", discordAuthMiddleware, async (req, res) => {
  if (!req.auth) return res.status(401).send({ error: "Not authenticated" });

  const query = req.query.query;

  if (!query) {
    return res.status(400).send({ error: "Missing query" });
  }
  const tracks = await player.search(query + "", { requestedBy: req.auth.userId });
  console.log(tracks);
  return res.status(200).send(tracks);
});

router.put("/:guildId/queue", discordAuthMiddleware, async (req, res) => {
  if (!req.auth) return res.status(401).send({ error: "Not authenticated" });

  // Check if user has admin in guild
  try {
    if (!(await userHasAdminInGuild(req.auth, req.params.guildId))) return res.status(401).send({ error: "Not authorized" });

    const { track } = req.body as { track: Track };
    const { guildId } = req.params;

    if (!guildId || !track) {
      return res.status(400).send({ error: "Missing guildId or track" });
    }

    const queue = await player.getQueue(guildId);
    if (!queue) return res.status(404).send({ error: "Queue not created" });

    const trackData = await player.search(track.title, { requestedBy: req.auth.userId }).then((x) => x.tracks[0]);

    console.log("Trackdata:", trackData, track);
    queue.addTrack(trackData);
    queue.play();

    console.log("added", track, "to", guildId);

    SocketManager.sendToGuild(guildId, "queue-updated", { tracks: queue.tracks });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Something went wrong" });
  }
});

export default router;
