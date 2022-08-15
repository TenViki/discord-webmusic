import { Client, TextChannel } from "discord.js";
import { GithubEvents } from "../types/githubWebhooks";
import * as fs from "fs/promises";
import { Webhook } from "../models/webhook.model";

export const bot = new Client({
  intents: ["GUILDS"],
  partials: ["USER"],
});

const events = new Map<keyof GithubEvents, any>();

export const setup = async () => {
  bot.login(process.env.BOT_TOKEN!);
  const events = await fs.readdir(`./src/bot/events`);
  for (const event of events) {
    if (event.endsWith(".event.ts")) {
      const eventName = event.replace(".ts", "");
      await import(`./events/${eventName}`);
    }
  }
};

bot.on("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}`);
});

export const registerEvent = <K extends keyof GithubEvents>(
  event: K,
  handler: (event: GithubEvents[K], bot: Client, channel: TextChannel) => void
) => {
  events.set(event, handler);
  console.log("Registered event: " + event);
};

export const handleEvent = async (
  event: GithubEvents[keyof GithubEvents],
  webhookId: string
) => {
  const webhook = await Webhook.findOne({ _id: webhookId });
  if (!webhook) {
    console.log("Webhook not found");
    return;
  }

  const channel = bot.channels.cache.get(webhook.channel) as TextChannel;

  if (!channel) {
    console.log("Channel not found");
    return;
  }

  const handler = events.get(event.event_type);
  if (!handler) {
    console.log("Handler not found");
    return;
  }

  await handler(event, bot, channel);
};
