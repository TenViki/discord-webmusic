import axios from "axios";
import { PermissionsBitField } from "discord.js";
import { bot } from "../bot/bot";
import { IAuth } from "../models/auth.model";
import { UserGuilds } from "../types/discord";
import { refreshToken } from "./discordauth.service";

const userGuildsCache = new Map<string, UserGuilds[]>();

export const getUserGuilds = async (auth: IAuth) => {
  await refreshToken(auth);
  const userGuilds = userGuildsCache.get(auth.userId);
  if (userGuilds) return userGuilds;

  try {
    const response = await axios.get<UserGuilds[]>("https://discordapp.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${auth.discordAccessToken}`,
      },
    });

    userGuildsCache.set(auth.userId, response.data);

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getGuilds = async (auth: IAuth): Promise<(UserGuilds & { bot: boolean })[]> => {
  const userGuilds = await getUserGuilds(auth);

  // Only guilds where user has administrator permissions
  const userGuildsWithAdmin = userGuilds.filter((guild) => (guild.permissions & 0x8) === 0x8);

  return userGuildsWithAdmin.map((guild) => ({
    ...guild,
    bot: bot.guilds.cache.has(guild.id),
  }));
};

const adminCache = new Map<string, boolean>();

export const userHasAdminInGuild = async (auth: IAuth, guild: string) => {
  if (adminCache.has(auth.userId + "-" + guild)) return adminCache.get(auth.userId + "-" + guild);

  const userGuilds = await getGuilds(auth);

  const userGuild = userGuilds.some((g) => g.id === guild);
  adminCache.set(auth.userId + "-" + guild, userGuild);

  return userGuilds.some((g) => g.id === guild);
};

setInterval(() => {
  adminCache.clear();
  userGuildsCache.clear();
}, 1000 * 15);

export const getChannelsInGuild = async (auth: IAuth, guildId: string, userGuilds?: UserGuilds[]) => {
  if (!(await userHasAdminInGuild(auth, guildId))) return;

  const channels = bot.guilds.cache.get(guildId)!.channels.cache;

  return {
    channels: channels.map((channel) => ({
      ...channel,
      canSendMessages: channel.permissionsFor(bot.user!)?.has(PermissionsBitField.Flags.SendMessages),
    })),
    guild: bot.guilds.cache.get(guildId),
  };
};
