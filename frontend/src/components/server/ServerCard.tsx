import React, { FC } from "react";
import { FiChevronDown, FiChevronRight, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router";
import { UserGuilds as UserGuild } from "../../types/discord";
import Button from "../button/Button";
import "./ServerCard.scss";

interface ServerCardProps {
  server: UserGuild;
}

const ServerCard: FC<ServerCardProps> = ({ server }) => {
  const navigate = useNavigate();
  return (
    <div className="server">
      <div className="server-icon">
        {server.icon ? (
          <img
            src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
            alt="Server icon"
          />
        ) : (
          <div>
            <span>{server.name[0]}</span>
          </div>
        )}
      </div>

      <div className="server-name">{server.name}</div>

      <div className="server-action">
        {server.bot ? (
          <Button
            text="Manage"
            RightIcon={FiChevronRight}
            onClick={() => navigate(`/servers/${server.id}`)}
          />
        ) : (
          <Button
            text="Invite"
            color="grey"
            onClick={() =>
              window.open(
                `https://discord.com/api/oauth2/authorize?client_id=1008791063839912046&permissions=2048&scope=bot&guild_id=${server.id}`,
                `Invite BetterGithub to ${server.name}`,
                "width=500,height=900"
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default ServerCard;
