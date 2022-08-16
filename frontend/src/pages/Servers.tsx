import React from "react";
import { useQuery } from "react-query";
import { getGuilds } from "../api/servers";
import Loading from "../components/loading/Loading";
import ServerCard from "../components/server/ServerCard";
import { UserContext } from "../Router";
import "./Servers.scss";

const Servers = () => {
  const { user } = React.useContext(UserContext);

  const { isLoading, data } = useQuery(
    ["guilds", user?.id],
    () => getGuilds(localStorage.getItem("token")!),
    {
      enabled: !!user,
    }
  );

  if (!user) return <div className="error-message">You aren't logged in!</div>;

  return (
    <div className="server-select">
      <h1 className="page-title">Servers</h1>

      {isLoading ? (
        <div className="loading-text">
          <Loading size="small" /> Loading servers...
        </div>
      ) : (
        <div className="serverlist">
          {data?.data.map((guild) => (
            <ServerCard server={guild} key={guild.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Servers;
