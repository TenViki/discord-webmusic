import React from "react";
import { SocketContext } from "../../Router";
import { Track as TrackType } from "../../types/player";
import Track from "../track/Track";
import "./Queue.scss";
import QueueSearch from "./QueueSearch";

interface QueueProps {
  queue: TrackType[] | null;
  setQueue: React.Dispatch<React.SetStateAction<TrackType[] | null>>;
  guildId: string;
  current: TrackType | null;
}

const Queue: React.FC<QueueProps> = ({ guildId, queue: queueOriginal, current }) => {
  const socket = React.useContext(SocketContext);
  const [queue, setQueue] = React.useState<TrackType[] | null>(queueOriginal);

  const handleQueueUpdate = (queue: TrackType[]) => {
    setQueue(queue);
  };
  React.useEffect(() => {
    if (!socket) return;
    socket.on("queue-update", handleQueueUpdate);

    return () => {
      socket.off("queue-update", handleQueueUpdate);
    };
  }, [socket]);

  return (
    <div className={`guild-queue`}>
      <QueueSearch guildId={guildId} />

      <div className="guild-queue-tracks">
        {current && <Track track={current} playindex={0} playing={true} />}
        {queue?.length ? (
          queue.map((track, i) => <Track track={track} playindex={i} playing={false} key={i} />)
        ) : (
          <div className="no-queue">To create a queue, add something by searching</div>
        )}
      </div>
    </div>
  );
};

export default Queue;
