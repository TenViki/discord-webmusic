import React from "react";
import { FiPause, FiPlay, FiRepeat, FiShuffle, FiSkipBack, FiSkipForward, FiVolume2 } from "react-icons/fi";
import { setState } from "../../api/player";
import { SocketContext } from "../../Router";
import { Track } from "../../types/player";
import "./Controls.scss";

interface ControlsProps {
  current: Track;
  guildId: string;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  repeat: number;
  setRepeat: (repeat: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

interface State {
  paused: boolean;
  repeatMode: number;
  volume: number;
}

const Controls: React.FC<ControlsProps> = ({ current, guildId, paused, repeat, setPaused, setRepeat, setVolume, volume }) => {
  const [image, setImage] = React.useState<string>(current.thumbnail);

  const socket = React.useContext(SocketContext);

  React.useEffect(() => {
    setImage(current.thumbnail);
  }, [current]);

  const handlePause = () => {
    setPaused(!paused);
    setState(guildId, !paused, 0, volume, localStorage.getItem("token")!);
  };

  const handleVolumeSend = () => {
    setState(guildId, paused, 0, volume, localStorage.getItem("token")!);
  };

  const handleStateChange = ({ paused, repeatMode, volume }: State) => {
    setPaused(paused);
    setRepeat(repeatMode);

    setVolume(volume);
  };

  React.useEffect(() => {
    if (!socket) return;

    socket.on("state-updated", handleStateChange);

    return () => {
      socket.off("state-updated", handleStateChange);
    };
  }, [socket]);

  return (
    <div className="guild-controls">
      <div className="controls-song">
        <div className="controls-song-image">
          <img
            src={current.thumbnail.replace("maxresdefault", "default")}
            alt={current.title}
            onError={() => setImage("/Logo_error.png")}
          />
        </div>
        <div className="controls-song-info">
          <div className="controls-song-title">{current.title}</div>
          <div className="controls-song-artist">{current.author}</div>
        </div>
      </div>

      <div className="controls-buttons">
        <div className="button-group">
          <button className="controls-button controls-button-prev">
            <FiShuffle />
          </button>
          <button className="controls-button controls-button-prev">
            <FiSkipBack />
          </button>
          <button className="controls-button controls-button-prev" onClick={handlePause}>
            {paused ? <FiPlay /> : <FiPause />}
          </button>
          <button className="controls-button controls-button-prev">
            <FiSkipForward />
          </button>
          <button className="controls-button controls-button-prev">
            <FiRepeat />
          </button>
        </div>

        <div className="progressbar">
          <div className="progressbar-fill" style={{ width: "0%" }} />
        </div>
      </div>

      <div className="controls-volume">
        <div className="controls-volume-icon">
          <FiVolume2 />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(+e.target.value)}
          onMouseUp={handleVolumeSend}
        />
      </div>
    </div>
  );
};

export default Controls;
