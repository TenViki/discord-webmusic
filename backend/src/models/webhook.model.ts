import { Document, model, Schema } from "mongoose";

export interface IWebhook extends Document {
  guild: string;
  channel: string;
}

const webhookSchema = new Schema<IWebhook>({
  guild: String,
  channel: String,
});

export const Webhook = model("Webhook", webhookSchema);
