import { Client, TextChannel, Partials } from "discord.js";
import { GithubEvents } from "../types/githubWebhooks";
import * as fs from "fs/promises";
import { Player } from "discord-player";

export const bot = new Client({
  intents: ["GuildMessages", "Guilds", "GuildVoiceStates"],
  partials: [Partials.User, Partials.Message],
});

export const player = new Player(bot);

const events = new Map<keyof GithubEvents, any>();

export const setup = async () => {
  bot.login(process.env.BOT_TOKEN!);
};

bot.on("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}`);
});
