import React from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { addTrack, searchTracks } from "../../api/player";
import { Track } from "../../types/player";
import Loading from "../loading/Loading";
import TrackSearch from "../track/TrackSearch";
import "./QueueSearch.scss";

interface QueueSearchProps {
  guildId: string;
}

const QueueSearch: React.FC<QueueSearchProps> = ({ guildId }) => {
  const [search, setSearch] = React.useState("");
  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [searchOpened, setSearchOpened] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    setLoading(true);
    const tracks = await searchTracks(search, localStorage.getItem("token")!);
    setLoading(false);
    console.log(tracks);
    setTracks(tracks.data.tracks);
  };

  const handleTrackSelect = async (track: Track) => {
    setTimeout(() => setSearchOpened(false), 200);
    await addTrack(guildId, track, localStorage.getItem("token")!);
  };

  return (
    <div className="guild-queue-search">
      <form onSubmit={handleSearch} className="search-form">
        <input
          placeholder="Search..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchOpened(true)}
          onBlur={() => !tracks.length && setSearchOpened(false)}
        />
        <button type="submit">{loading ? <Loading size="small" /> : <FiSearch size={20} />}</button>
      </form>

      <div className="queue-search-tracks">
        {tracks.length ? (
          tracks.map((track) => <TrackSearch track={track} onClick={handleTrackSelect} />)
        ) : (
          <div className="no-search">Start search</div>
        )}
      </div>
    </div>
  );
};

export default QueueSearch;
