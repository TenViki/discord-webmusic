import { Channel, Client } from "discord.js";
import { GithubEvents } from "./githubWebhooks";

export interface GithubCommit {
  id: string;
  tree_id: string;
  timestamp: string;
  message: string;
  url: string;
  author: {
    name: string;
    email: string;
    url: string;
  };
  committer: {
    name: string;
    email: string;
    username: string;
  };
  distinct: boolean;
  added: string[];
  removed: string[];
  modified: string[];
}

export interface EventHandler<K extends keyof GithubEvents> {
  name: string;
  handler: (event: GithubEvents[K], bot: Client, channel: Channel) => void;
}
