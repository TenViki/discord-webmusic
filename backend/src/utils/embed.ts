import { ColorResolvable, MessageEmbed } from "discord.js";
import { GithubDelivery } from "../types/githubWebhooks";

export const createEmbed = (
  title: string,
  description: string,
  color: ColorResolvable,
  author: GithubDelivery["sender"]
) => {
  return new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setAuthor({
      name: author.login,
      url: author.html_url,
      iconURL: author.avatar_url,
    });
};
