import React, { useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getQueue } from "../api/player";
import { getChannels } from "../api/servers";
import Button from "../components/button/Button";
import Channel from "../components/channel/Channel";
import Loading from "../components/loading/Loading";
import Queue from "../components/queue/Queue";
import { UserContext, useSocket } from "../Router";
import { DiscordChannelTypes } from "../types/discord";
import { Track } from "../types/player";
import "./Guild.scss";

const Guild = () => {
  const { user } = React.useContext(UserContext);
  const guildId = useParams().guildId;
  const socket = useSocket();

  useQuery(["queue", guildId], () => getQueue(guildId!, localStorage.getItem("token")!), {
    onSuccess: (data) => setQueue(data?.data?.queue),
    refetchOnWindowFocus: false,
  });

  const [queue, setQueue] = React.useState<null | Track[]>(null);

  const handleQueueCreated = () => {
    setQueue([]);
  };

  const handleQueueDestroyed = () => {
    setQueue(null);
  };

  const navigate = useNavigate();

  const { data } = useQuery(["guild", guildId], () => getChannels(localStorage.getItem("token")!, guildId!), {
    enabled: !!user && !!socket,
  });

  useEffect(() => {
    if (!socket || !data?.data) return;
    socket.emit("select-guild", guildId);

    socket.on("queue-created", handleQueueCreated);
    socket.on("queue-destroyed", handleQueueDestroyed);

    return () => {
      socket.off("queue-created", handleQueueCreated);
      socket.off("queue-destroyed", handleQueueDestroyed);
    };
  }, [guildId, socket, data]);

  if (!user) return <div className="error-message">You aren't logged in!</div>;
  if (!data)
    return (
      <div className="loading-text page">
        <Loading size="small" /> Fetching guild info...
      </div>
    );

  return (
    <div className="page guild-control">
      <div className="page-sidepanel">
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

        <div className="guild-channels">
          {data.data.channels
            .filter(
              (channel) =>
                channel.type === DiscordChannelTypes.GUILD_VOICE || channel.type === DiscordChannelTypes.GUILD_STAGE_VOICE
            )
            .map((channel) => (
              <Channel key={channel.id} channel={channel} guildId={data.data.guild.id} />
            ))}
        </div>
      </div>

      {queue ? <Queue queue={queue} setQueue={setQueue} guildId={guildId!} /> : "Rip queue :("}

      <div className="guild-controls">CONTROLS</div>
    </div>
  );
};

export default Guild;
