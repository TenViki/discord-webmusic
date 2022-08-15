import { model, Schema } from "mongoose";

export interface IWorkflowJob extends Document {
  guild: string;
  channel: string;
  messageId: string;
  runId: number;
}

const workflowJobSchema = new Schema<IWorkflowJob>({
  guild: String,
  channel: String,
  messageId: String,
  runId: Number,
});

export const WorkflowJob = model("WorkflowJob", workflowJobSchema);
