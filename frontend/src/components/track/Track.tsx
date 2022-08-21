import React from "react";
import { Track as TrackType } from "../../types/player";
import "./Track.scss";

interface TrackProps {
  track: TrackType;
  playindex: number;
  playing: boolean;
}

const Track: React.FC<TrackProps> = ({ track, playindex, playing }) => {
  const [image, setImage] = React.useState<string>(track.thumbnail);

  React.useEffect(() => {
    setImage(track.thumbnail);
  }, [track]);

  return (
    <div className="track">
      <div className="track-number">
        {playing ? (
          <div className="playing-bars">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <>{playindex + 1}</>
        )}
      </div>
      <div className="track-image">
        <img src={image.replace("maxresdefault", "default")} alt={track.title} onError={() => setImage("/Logo_error.png")} />
      </div>

      <div className="track-text">
        <div className="track-name">{track.title}</div>
        <div className="track-artist">{track.author}</div>
      </div>

      <div className="track-time">{track.duration}</div>
    </div>
  );
};

export default Track;
