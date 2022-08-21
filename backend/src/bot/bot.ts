import { Client, TextChannel, Partials } from "discord.js";
import { GithubEvents } from "../types/githubWebhooks";
import * as fs from "fs/promises";
import { Player } from "discord-player";
import { SocketManager } from "../utils/socket-manager";

export const bot = new Client({
  intents: ["GuildMessages", "Guilds", "GuildVoiceStates"],
  partials: [Partials.User, Partials.Message],
});

export const player = new Player(bot);
player.on("botDisconnect", (queue) => {
  SocketManager.sendToGuild(queue.guild.id, "queue-destroyed");
  SocketManager.sendToGuild(queue.guild.id, "channel-update", null);
});

player.on("channelEmpty", (queue) => {
  SocketManager.sendToGuild(queue.guild.id, "queue-destroyed");
  SocketManager.sendToGuild(queue.guild.id, "channel-update", null);
});

player.on("queueEnd", (queue) => {
  SocketManager.sendToGuild(queue.guild.id, "queue-destroyed");
  SocketManager.sendToGuild(queue.guild.id, "channel-update", null);
});

player.on("trackAdd", (queue) => {
  SocketManager.sendToGuild(queue.guild.id, "queue-update", queue.tracks);
});

player.on("trackStart", (queue) => {
  SocketManager.sendToGuild(queue.guild.id, "queue-update", queue.tracks);
  SocketManager.sendToGuild(queue.guild.id, "track-start", queue.current);
});

export const setup = async () => {
  bot.login(process.env.BOT_TOKEN!);
};

bot.on("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}`);
});
