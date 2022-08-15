import { Router } from "express";
import { handleEvent } from "../bot/bot";
import { GithubDeliveryWebhook } from "../types/githubWebhooks";

const router = Router();

router.post("/:webhookId", async (req, res) => {
  const webhookObject: GithubDeliveryWebhook = {
    ...req.body,
    event_type: req.headers["x-github-event"],
  };

  res.send("OK");

  // Copy object
  const objectForPrint: any = { ...webhookObject };
  delete objectForPrint.sender;
  delete objectForPrint.repository;
  delete objectForPrint.organization;

  console.log("\n\n----------------------------");
  console.log("Event:", webhookObject.event_type);
  console.log("Object:", JSON.stringify(objectForPrint));
  console.log("----------------------------\n\n");

  try {
    await handleEvent(webhookObject, req.params.webhookId);
  } catch (error) {
    console.error(error);
  }
});

export default router;
