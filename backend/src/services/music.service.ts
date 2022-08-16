import { User } from "discord.js";
import { player } from "../bot/bot";
import { IAuth } from "../models/auth.model";

export const searchMusic = (q: string, auth: IAuth) => {
  return player.search(q, { requestedBy: auth.userId });
};

export const createQueue = async (guildId: string, channelId: string) => {};
