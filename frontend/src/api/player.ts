import { server } from "../config/backend";
import { Track } from "../types/player";

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

export const searchTracks = async (query: string, token: string) => {
  return server.get<{
    tracks: Track[];
  }>(`/player/search`, {
    headers: {
      Authorization: token,
    },
    params: {
      query: query,
    },
  });
};

export const addTrack = async (guildId: string, track: Track, token: string) => {
  return server.put(
    `/player/${guildId}/queue`,
    {
      track: track,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};
