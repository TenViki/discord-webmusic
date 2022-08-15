import { GuildBasedChannel } from "discord.js";
import React, { useEffect } from "react";
import { FiCheck, FiChevronRight, FiHash, FiLock } from "react-icons/fi";
import { useMutation } from "react-query";
import { createWebhook } from "../../api/servers";
import { BACKEND_URL } from "../../config/backend";
import Button from "../button/Button";
import "./Channel.scss";

interface ChannelProps {
  channel: GuildBasedChannel & {
    canSendMessages: boolean;
    webhook?: {
      guild: string;
      channel: string;
      _id: string;
    };
  };
  selectedChannel: string;
  onSelect: () => void;
  guildId: string;
}

const Channel: React.FC<ChannelProps> = ({
  channel,
  onSelect,
  selectedChannel,
  guildId,
}) => {
  const [opened, setOpened] = React.useState(false);
  const [copiedShown, setCopiedShown] = React.useState(false);
  const [webhook, setWebhook] = React.useState<
    | {
        guild: string;
        channel: string;
        _id: string;
      }
    | undefined
  >(channel.webhook);

  const { isLoading, mutate } = useMutation(createWebhook, {
    onSuccess: (data) => {
      setWebhook(data.data);
      setTimeout(handleWebhookCopy, 300);
    },
  });

  useEffect(() => {
    if (!copiedShown) return;
    let mount = true;

    setTimeout(() => mount && setCopiedShown(false), 2000);

    return () => {
      mount = false;
    };
  }, [copiedShown]);

  const handleWebhookCopy = () => {
    navigator.clipboard.writeText(`${BACKEND_URL}webhooks/${webhook?._id}`);

    setCopiedShown(true);
  };

  return (
    <div
      className={`channel ${!channel.canSendMessages ? "locked" : ""} ${
        selectedChannel === channel.id ? "opened" : ""
      }`}
    >
      <div
        className="channel-header"
        onClick={() => channel.canSendMessages && onSelect()}
      >
        <div className="channel-name">
          <FiHash /> {channel.name}
        </div>
        {!channel.canSendMessages && (
          <div className="channel-locked">
            <FiLock /> Bot cannot send messages in this channel
          </div>
        )}
      </div>
      <div className={`channel-content ${opened ? "opened" : ""}`}>
        {webhook ? (
          <div className="channel-webhook" onClick={handleWebhookCopy}>
            <div className="channel-webhook-url">
              {BACKEND_URL}webhooks/{webhook._id}
            </div>

            <div
              className={`channel-webhook-copy ${copiedShown ? "opened" : ""}`}
            >
              <FiCheck />
              URL Copied!
            </div>
          </div>
        ) : (
          <Button
            text="Create webhook"
            fullwidth
            disabled={isLoading}
            loading={isLoading}
            centered
            RightIcon={FiChevronRight}
            onClick={async () => {
              mutate({
                guildId: guildId,
                channelId: channel.id,
                token: localStorage.getItem("token")!,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Channel;
