import axios from "axios";
import { PermissionsBitField } from "discord.js";
import { bot } from "../bot/bot";
import { IAuth } from "../models/auth.model";
import { Webhook } from "../models/webhook.model";
import { UserGuilds } from "../types/discord";
import { refreshToken } from "./discordauth.service";

export const getUserGuilds = async (auth: IAuth) => {
  await refreshToken(auth);
  console.log("Here!", auth.discordAccessToken);
  const response = await axios.get<UserGuilds[]>(
    "https://discordapp.com/api/users/@me/guilds",
    {
      headers: {
        Authorization: `Bearer ${auth.discordAccessToken}`,
      },
    }
  );

  return response.data;
};

export const getGuilds = async (
  auth: IAuth
): Promise<(UserGuilds & { bot: boolean })[]> => {
  const userGuilds = await getUserGuilds(auth);

  // Only guilds where user has administrator permissions
  const userGuildsWithAdmin = userGuilds.filter(
    (guild) => (guild.permissions & 0x8) === 0x8
  );

  return userGuildsWithAdmin.map((guild) => ({
    ...guild,
    bot: bot.guilds.cache.has(guild.id),
  }));
};

export const getChannelsInGuild = async (
  auth: IAuth,
  guildId: string,
  userGuilds?: UserGuilds[]
) => {
  if (!userGuilds) userGuilds = await getUserGuilds(auth);
  const adminUserGuilds = userGuilds.filter(
    (guild) => (guild.permissions & 0x8) === 0x8
  );

  if (!adminUserGuilds.find((guild) => guild.id === guildId)) {
    throw new Error(
      "User does not have administrator permissions in this guild"
    );
  }

  const channels = bot.guilds.cache.get(guildId)!.channels.cache;
  const webhooks = await Webhook.find({ guildId });

  return {
    channels: channels.map((channel) => ({
      ...channel,
      canSendMessages: channel
        .permissionsFor(bot.user!)
        ?.has(PermissionsBitField.Flags.SendMessages),
      webhook: webhooks.find((webhook) => webhook.channel === channel.id),
    })),
    guild: adminUserGuilds.find((guild) => guild.id === guildId)!,
  };
};
