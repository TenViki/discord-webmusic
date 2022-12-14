import React from "react";
import {
  FiPause,
  FiPlay,
  FiRepeat,
  FiShuffle,
  FiSkipBack,
  FiSkipForward,
  FiVolume,
  FiVolume1,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { sendAction, setState } from "../../api/player";
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
    socket?.emit("music:state", { paused: !paused, guildId });
  };

  const handleVolumeSend = () => {
    console.log("Emitting volume send");
    socket?.emit("music:volume", { volume, guildId });
  };

  const handleVolumeRecv = (data: { volume: number }) => {
    setVolume(data.volume);
  };

  const handleStateChange = ({ paused, repeatMode, volume }: State) => {
    console.log("state change", paused);
    setPaused(paused);
    setRepeat(repeatMode);

    setVolume(volume);
  };

  const handlePlayingChange = ({ paused }: { paused: boolean }) => {
    console.log("playing", paused);
    setPaused(paused);
  };

  const handleRepeat = () => {
    setRepeat((repeat + 1) % 4);
    setState(guildId, paused, (repeat + 1) % 4, volume, localStorage.getItem("token")!);
  };

  const handleAction = (action: string) => {
    sendAction(guildId, action, localStorage.getItem("token")!);
  };

  React.useEffect(() => {
    if (!socket) return;

    socket.on("state-updated", handleStateChange);
    socket.on("music:state", handlePlayingChange);
    socket.on("music:volume", handleVolumeRecv);

    return () => {
      socket.off("state-updated", handleStateChange);
      socket.off("music:state", handlePlayingChange);
      socket.off("music:volume", handleVolumeRecv);
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
          <button className="controls-button controls-button-prev" onClick={() => handleAction("shuffle")}>
            <FiShuffle />
          </button>
          <button className="controls-button controls-button-prev" onClick={() => handleAction("prev")}>
            <FiSkipBack />
          </button>
          <button className="controls-button controls-button-prev" onClick={handlePause}>
            {paused ? <FiPlay /> : <FiPause />}
          </button>
          <button className="controls-button controls-button-prev" onClick={() => handleAction("next")}>
            <FiSkipForward />
          </button>
          <button className="controls-button controls-button-prev" onClick={handleRepeat}>
            <FiRepeat />
          </button>
        </div>

        <div className="progressbar">
          <div className="progressbar-fill" style={{ width: "0%" }} />
        </div>
      </div>

      <div className="controls-volume">
        <div className="repeat-text">
          - {repeat === 0 && "Off"}
          {repeat === 1 && "Repeat queue"}
          {repeat === 2 && "Repeat current"}
          {repeat === 3 && "Autoplay"}
        </div>
        <div className="controls-volume-slider">
          <div className="controls-volume-icon">
            {volume == 0 && <FiVolumeX />}
            {volume > 0 && volume <= 33 && <FiVolume />}
            {volume > 33 && volume <= 66 && <FiVolume1 />}
            {volume > 66 && <FiVolume2 />}
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
    </div>
  );
};

export default Controls;
