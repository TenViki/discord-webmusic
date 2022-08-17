import React from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { searchTracks } from "../../api/player";
import { Track } from "../../types/player";
import "./Queue.scss";

interface QueueProps {
  queue: Track[] | null;
  setQueue: React.Dispatch<React.SetStateAction<Track[] | null>>;
}

const Queue: React.FC<QueueProps> = () => {
  const [search, setSearch] = React.useState("");
  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [searchOpened, setSearchOpened] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const tracks = await searchTracks(search, localStorage.getItem("token")!);
    console.log(tracks);
    setTracks(tracks.data.tracks);
  };

  const handleTrackSelect = (track: Track) => {
    setTimeout(() => setSearchOpened(false), 200);
  };

  return (
    <div className={`queue ${searchOpened ? "search-opened" : ""}`}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          placeholder="Search..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchOpened(true)}
          onBlur={() => !tracks.length && setSearchOpened(false)}
        />
        <button type="submit">
          <FiSearch />
        </button>
      </form>

      <div className="queue-container">
        <div className="queue-tracks">Queue</div>

        <div className="search">
          <FiX onClick={() => setSearchOpened(false)} className="search-x" />
          {tracks.length ? (
            tracks.map((track) => (
              <div className="track-search" key={track.id} onClick={() => handleTrackSelect(track)}>
                <div className="track-search-image">
                  <img
                    src={track.thumbnail.replace("maxresdefault", "default")}
                    alt={track.title}
                    onError={() => {
                      track.thumbnail = "/Freddie Z II.png";
                    }}
                  />
                </div>
                <div className="track-search-text">
                  <div className="track-search-name">{track.title}</div>
                  <div className="track-search-artist">{track.author}</div>
                </div>
                <div className="track-search-time">{track.duration}</div>
              </div>
            ))
          ) : (
            <div className="no-search">Starts search</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Queue;
