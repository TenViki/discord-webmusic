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

const Queue: React.FC<QueueProps> = ({ guildId, queue: queueOriginal }) => {
  const socket = React.useContext(SocketContext);
  const [queue, setQueue] = React.useState<Track[] | null>(queueOriginal);
  const [current, setCurrent] = React.useState<Track | null>(null);

  const handleQueueUpdate = (queue: Track[]) => {
    setQueue(queue);
  };

  const handleTrackStart = (track: Track) => {
    setCurrent(track);
  };

  React.useEffect(() => {
    if (!socket) return;
    socket.on("queue-update", handleQueueUpdate);
    socket.on("track-start", handleTrackStart);

    return () => {
      socket.off("queue-update", handleQueueUpdate);
      socket.off("track-start", handleTrackStart);
    };
  }, [socket]);

  return (
    <div className={`guild-queue`}>
      <QueueSearch guildId={guildId} />

      <div className="guild-queue-tracks">
        Current: {current?.title}
        {queue?.length ? (
          queue.map((track) => (
            <div>
              {track.title}
              <br />
            </div>
          ))
        ) : (
          <div className="no-queue">To create a queue, add something by searching</div>
        )}
      </div>
    </div>
  );
};

export default Queue;
