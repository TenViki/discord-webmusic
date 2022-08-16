import React, { useEffect } from "react";
import { DiscordChannel } from "../../types/discord";
import "./Channel.scss";

interface ChannelProps {
  channel: DiscordChannel;
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
  return (
    <div className={`channel`}>
      {channel.name} - {channel.type}
    </div>
  );
};

export default Channel;
