import { server } from "../config/backend";
import { DiscordUser } from "../types/auth";

export const sendCode = async (code: string) => {
  return server.post<{ token: string } & DiscordUser>("/auth", { code });
};

export const getUser = async (token: string) => {
  return server.get<DiscordUser>("/auth", {
    headers: {
      Authorization: token,
    },
  });
};
