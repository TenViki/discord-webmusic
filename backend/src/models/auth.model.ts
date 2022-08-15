import { Schema, model, Document } from "mongoose";

export interface IAuth extends Document {
  discordRefreshToken: string;
  discordAccessToken: string;
  userId: string;
  tokenExpires: Date;
}

const authSchema = new Schema<IAuth>({
  discordRefreshToken: String,
  discordAccessToken: String,
  userId: String,
  tokenExpires: Date,
});

export const Auth = model("Auth", authSchema);
