import { NextFunction, Request, Response } from "express";
import * as discordAuthService from "../services/discordauth.service";
import jwt from "jsonwebtoken";
import { DiscordUser } from "../types/auth";
import { IAuth, Auth } from "../models/auth.model";

// Global types for uwser in request
declare global {
  namespace Express {
    interface Request {
      auth?: IAuth;
    }
  }
}

export const validateToken = async (token: string) => {
  let sessionId: string;
  try {
    sessionId = (
      jwt.verify(token, process.env.JWT_SECRET!) as {
        sessionId: string;
      }
    ).sessionId;
  } catch (error) {
    return null;
  }

  const auth = await Auth.findOne({ _id: sessionId });
  if (!auth) return null;

  return auth;
};

export const discordAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Got request!");
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ error: "Invalid token" });

  let sessionId: string;

  try {
    sessionId = (
      jwt.verify(token, process.env.JWT_SECRET!) as {
        sessionId: string;
      }
    ).sessionId;
  } catch (error) {
    return res.status(401).send({ error: "Invalid token" });
  }

  const auth = await Auth.findOne({
    _id: sessionId,
  });

  if (!auth) {
    return res.status(401).send({ error: "Invalid token" });
  }

  req.auth = auth;
  next();
};
