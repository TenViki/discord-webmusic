import axios from "axios";
import url from "url";
import jwt from "jsonwebtoken";
import { Auth, IAuth } from "../models/auth.model";
import { DiscordUser } from "../types/auth";
import { HydratedDocument } from "mongoose";

export const getDiscordAuth = async (code: string) => {
  const response = await axios.post<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }>(
    "https://discordapp.com/api/oauth2/token",
    new url.URLSearchParams({
      client_id: process.env.DISCORD_APP_ID!,
      client_secret: process.env.DISCORD_APP_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      scope: "identify",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  // Get discord data with fake auth object
  const data = await getDiscordUser(
    new Auth({
      discordAccessToken: response.data.access_token,
      discordRefreshToken: response.data.refresh_token,
      userId: "nothing",
      tokenExpires: new Date(),
    }),
    false
  );

  await Auth.deleteMany({
    userId: data.id,
  });

  const auth = await Auth.create({
    discordRefreshToken: response.data.refresh_token,
    discordAccessToken: response.data.access_token,
    userId: data.id,
    tokenExpires: new Date(Date.now() + response.data.expires_in * 1000),
  });

  const token = await createToken(auth._id.toString());

  return { token, ...data };
};

export const createToken = async (sessionId: string) => {
  // Create a JWT token for user
  const token = jwt.sign({ sessionId }, process.env.JWT_SECRET!);
  return token;
};

export const refreshToken = async (auth: IAuth) => {
  if (auth.tokenExpires && auth.tokenExpires.getTime() >= Date.now()) {
    return auth.discordAccessToken;
  }

  console.log("Refreshing token");

  const response = await axios.post<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }>(
    "https://discordapp.com/api/oauth2/token",
    new url.URLSearchParams({
      client_id: process.env.DISCORD_APP_ID!,
      client_secret: process.env.DISCORD_APP_SECRET!,
      grant_type: "refresh_token",
      refresh_token: auth.discordRefreshToken,
      scope: "identify",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log("Token refreshed", response.data.access_token);

  auth.discordAccessToken = response.data.access_token;
  auth.discordRefreshToken = response.data.refresh_token;
  auth.tokenExpires = new Date(Date.now() + response.data.expires_in * 1000);
  await auth.save();
};

export const getDiscordUser = async (
  auth: IAuth,
  refresh?: boolean
): Promise<DiscordUser> => {
  if (refresh === undefined || refresh) await refreshToken(auth);

  console.log("Using access token: ", auth.discordAccessToken);

  const response = await axios.get<DiscordUser>(
    "https://discordapp.com/api/users/@me",
    {
      headers: {
        Authorization: `Bearer ${auth.discordAccessToken}`,
      },
    }
  );

  return response.data;
};
