import { WorkflowJob } from "../../models/workflow_jobs";
import { createEmbed } from "../../utils/embed";
import { registerEvent } from "../bot";

const getEmote = (status: string) => {
  switch (status) {
    case "in_progress":
      return "<:empty:997136327952834661>";
    case "success":
      return "<:checkmark:997162703330226177>";
    case "skipped":
      return "<:unknown:997162700603928687>";
    case "failure":
      return "<:x_:997162701753159731>";
    default:
      return "<:empty:997136327952834661>";
  }
};

registerEvent("workflow_job", async (event, bot, channel) => {
  const embed = createEmbed(
    `${event.repository.name} - Workflow job `,
    "",
    "#7f8c8d",
    event.sender
  );

  if (event.action === "queued") {
    embed.setDescription("**:clock1: Job has been queued**");

    const message = await channel.send({ embeds: [embed] });

    await WorkflowJob.create({
      messageId: message.id,
      guild: channel.guild.id,
      channel: channel.id,
      runId: event.workflow_job.run_id,
    });
  }

  if (event.action === "in_progress") {
    embed
      .setDescription(`**<a:loading:997139958924062880> Job is running!**`)
      .setColor("#dba90a");

    const workflow = await WorkflowJob.findOne({
      runId: event.workflow_job.run_id,
    });
    if (!workflow) return await channel.send({ embeds: [embed] });
    const message = await channel.messages.fetch(workflow.messageId);
    await message.edit({ embeds: [embed] });
  }

  if (event.action === "completed") {
    embed
      .setDescription(
        `**${
          event.workflow_job.conclusion === "success"
            ? "Job successfuly finished!"
            : "Job failed."
        }**\n\n${event.workflow_job.steps
          .map(
            (step) =>
              `${getEmote(
                step.status === "completed" ? step.conclusion : step.status
              )} ${step.name}`
          )
          .join("\n")}`
      )
      .setColor(
        event.workflow_job.conclusion === "success" ? "#2ecc71" : "#e74c3c"
      );

    const workflow = await WorkflowJob.findOne({
      runId: event.workflow_job.run_id,
    });
    await WorkflowJob.deleteOne({
      runId: event.workflow_job.run_id,
    });

    if (!workflow) return await channel.send({ embeds: [embed] });
    const message = await channel.messages.fetch(workflow.messageId);
    await message.edit({ embeds: [embed] });
  }
});
