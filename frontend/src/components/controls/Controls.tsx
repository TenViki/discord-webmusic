import React from "react";
import { FiPause, FiRepeat, FiShuffle, FiSkipBack, FiSkipForward, FiVolume2 } from "react-icons/fi";
import { Track } from "../../types/player";
import "./Controls.scss";

interface ControlsProps {
  current: Track;
}

const Controls: React.FC<ControlsProps> = ({ current }) => {
  const [image, setImage] = React.useState<string>(current.thumbnail);

  React.useEffect(() => {
    setImage(current.thumbnail);
  }, [current]);

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
        <button className="controls-button controls-button-prev">
          <FiShuffle />
        </button>
        <button className="controls-button controls-button-prev">
          <FiSkipBack />
        </button>
        <button className="controls-button controls-button-prev">
          <FiPause />
        </button>
        <button className="controls-button controls-button-prev">
          <FiSkipForward />
        </button>
        <button className="controls-button controls-button-prev">
          <FiRepeat />
        </button>
      </div>

      <div className="controls-volume">
        <div className="controls-volume-icon">
          <FiVolume2 />
        </div>
        <input type="range" />
      </div>
    </div>
  );
};

export default Controls;
