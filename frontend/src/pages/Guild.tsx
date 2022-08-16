import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getChannels } from "../api/servers";
import Channel from "../components/channel/Channel";
import Loading from "../components/loading/Loading";
import { UserContext } from "../Router";
import { DiscordChannelTypes } from "../types/discord";
import "./Guild.scss";

const Guild = () => {
  const { user } = React.useContext(UserContext);
  const guildId = useParams().guildId;

  const [selectedChannel, setSelectedChannel] = React.useState<string>("");

  const navigate = useNavigate();

  const { data } = useQuery(
    ["guild", guildId],
    () => getChannels(localStorage.getItem("token")!, guildId!),
    {
      enabled: !!user,
    }
  );

  if (!user) return <div className="error-message">You aren't logged in!</div>;
  if (!data)
    return (
      <div className="loading-text page">
        <Loading size="small" /> Fetching guild info...
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <div className="icon-back" onClick={() => navigate("/servers")}>
          <FiArrowLeft />
        </div>

        {data.data.guild.icon ? (
          <img
            src={`https://cdn.discordapp.com/icons/${data.data.guild.id}/${data.data.guild.icon}.png`}
            alt="Server icon"
            className="server-icon-header"
          />
        ) : (
          <div className="server-icon-letter">{data.data.guild.name[0]}</div>
        )}
        <h1>{data.data.guild.name}</h1>
      </div>

      <div className="channels">
        {data.data.channels
          .filter(
            (channel) =>
              channel.type === DiscordChannelTypes.GUILD_VOICE ||
              channel.type === DiscordChannelTypes.GUILD_STAGE_VOICE
          )
          .map((channel) => (
            <Channel
              key={channel.id}
              channel={channel}
              selectedChannel={selectedChannel}
              onSelect={() => setSelectedChannel(channel.id)}
              guildId={data.data.guild.id}
            />
          ))}
      </div>
    </div>
  );
};

export default Guild;
