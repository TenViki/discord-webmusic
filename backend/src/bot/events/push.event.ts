import { Channel, Client } from "discord.js";
import { EventHandler } from "../../types/github";
import { GithubDelivery_Push } from "../../types/githubWebhooks";
import { createEmbed } from "../../utils/embed";
import { formatFileName } from "../../utils/emote";
import { registerEvent } from "../bot";

registerEvent("push", (event, bot, channel) => {
  const embed = createEmbed(
    `${event.repository.name} - ${event.ref.split("/").pop()} (${
      event.commits.length
    } new commit${event.commits.length > 1 ? "s" : ""})`,
    event.commits
      .map(
        (commit) => `**[${commit.message}](${commit.url}) - ${
          commit.author.name
        }**
${commit.added
  .map(
    (file) =>
      `<:empty:997136327952834661><:add:996894889214226492>${formatFileName(
        file
      )}\n`
  )
  .join("")}${commit.modified
          .map(
            (file) =>
              `<:empty:997136327952834661><:modify:996894888127901727>${formatFileName(
                file
              )}\n`
          )
          .join("")}${commit.removed
          .map(
            (file) =>
              `<:empty:997136327952834661><:delete:996894886848630855>${formatFileName(
                file
              )}\n`
          )
          .join("")}`
      )
      .join("\n"),
    "#dba90a",
    event.sender
  );

  channel.send({ embeds: [embed] });
});
