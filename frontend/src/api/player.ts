import { server } from "../config/backend";

export const createQueue = async (guildId: string, channelId: string, token: string) => {
  return server.post(
    `/player/${guildId}/queue`,
    {
      channelId: channelId,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const getQueue = async (guildId: string, token: string) => {
  return server.get(`/player/${guildId}/queue`, {
    headers: {
      Authorization: token,
    },
  });
};
