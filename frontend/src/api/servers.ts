import { server } from "../config/backend";
import { DiscordChannel, UserGuilds } from "../types/discord";

export const getGuilds = (token: string) => {
  return server.get<UserGuilds[] & { bot: boolean }>("/discord/guilds", {
    headers: {
      Authorization: token,
    },
  });
};

export const getChannels = (token: string, guildId: string) => {
  return server.get<{
    channels: DiscordChannel[];
    guild: UserGuilds;
  }>(`/discord/guilds/${guildId}`, {
    headers: {
      Authorization: token,
    },
  });
};
