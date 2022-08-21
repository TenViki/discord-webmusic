import { PlayerOptions } from "discord-player";
import { User } from "discord.js";
import { player } from "../bot/bot";
import { IAuth } from "../models/auth.model";

export const searchMusic = (q: string, auth: IAuth) => {
  return player.search(q, { requestedBy: auth.userId });
};

export const createQueue = async (guildId: string, channelId: string, options?: PlayerOptions) => {
  return player.createQueue(guildId, {
    metadata: {
      channelId: channelId,
      guildId: guildId,
    },
    ...options,
  });
};
