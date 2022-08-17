import React from "react";
import { Track } from "../../types/player";

interface TrackSearchProps {
  track: Track;
  onClick: (track: Track) => void;
}

const TrackSearch: React.FC<TrackSearchProps> = ({ track, onClick }) => {
  const [image, setImage] = React.useState<string>(track.thumbnail);

  return (
    <div className="track-search" key={track.id} onClick={() => onClick(track)}>
      <div className="track-search-image">
        <img src={image.replace("maxresdefault", "default")} alt={track.title} onError={() => setImage("/Freddie Z II.png")} />
      </div>
      <div className="track-search-text">
        <div className="track-search-name">{track.title}</div>
        <div className="track-search-artist">{track.author}</div>
      </div>
      <div className="track-search-time">{track.duration}</div>
    </div>
  );
};

export default TrackSearch;
