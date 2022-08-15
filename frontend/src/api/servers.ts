import { GuildBasedChannel } from "discord.js";
import { server } from "../config/backend";
import { UserGuilds } from "../types/discord";

export const getGuilds = (token: string) => {
  return server.get<UserGuilds[] & { bot: boolean }>("/discord/guilds", {
    headers: {
      Authorization: token,
    },
  });
};

export const getChannels = (token: string, guildId: string) => {
  return server.get<{
    channels: (GuildBasedChannel & {
      canSendMessages: boolean;
      webhook?: {
        guild: string;
        channel: string;
        _id: string;
      };
    })[];
    guild: UserGuilds;
  }>(`/discord/guilds/${guildId}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const createWebhook = (options: {
  token: string;
  guildId: string;
  channelId: string;
}) => {
  return server.post<{
    guild: string;
    channel: string;
    _id: string;
  }>(
    `/discord/guilds/${options.guildId}/${options.channelId}`,
    {
      guild: options.guildId,
      channel: options.channelId,
    },
    {
      headers: {
        Authorization: options.token,
      },
    }
  );
};
