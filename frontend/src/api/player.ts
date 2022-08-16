import { server } from "../config/backend";

export const createQueue = async (
  guildId: string,
  channelId: string,
  token: string
) => {
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
