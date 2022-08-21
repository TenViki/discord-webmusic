import React from "react";
import { SocketContext } from "../../Router";
import { Track } from "../../types/player";
import "./Queue.scss";
import QueueSearch from "./QueueSearch";

interface QueueProps {
  queue: Track[] | null;
  setQueue: React.Dispatch<React.SetStateAction<Track[] | null>>;
  guildId: string;
}

const Queue: React.FC<QueueProps> = ({ guildId }) => {
  const socket = React.useContext(SocketContext);
  const [queue, setQueue] = React.useState<Track[] | null>(null);

  const handleQueueUpdate = (queue: Track[]) => {
    setQueue(queue);
  };

  React.useEffect(() => {}, [socket]);

  return (
    <div className={`guild-queue`}>
      <QueueSearch guildId={guildId} />

      <div className="guild-queue-tracks">
        {queue?.length ? (
          queue.map((track) => <>{track.title}, </>)
        ) : (
          <div className="no-queue">To create a queue, add something by searching</div>
        )}
      </div>
    </div>
  );
};

export default Queue;
