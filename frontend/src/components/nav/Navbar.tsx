import React, { FC } from "react";
import { useLocation, useMatch, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/logo.png";
import { DiscordUser } from "../../types/auth";
import "./Navbar.scss";

interface NavbarProps {
  user: DiscordUser | null;
  setUser: (user: DiscordUser | null) => void;
}

const Navbar: FC<NavbarProps> = ({ user, setUser }) => {
  const inHome = useMatch({
    path: "/",
    end: true,
  });

  const navigate = useNavigate();

  return (
    <nav className={`nav ${inHome ? "home" : ""}`}>
      <div className="nav-logo">
        <img src={logo} alt="Logo" className="nav-logo-img" />
      </div>
      <div className="nav-links">
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/servers"
        >
          Servers
        </NavLink>
      </div>

      {user && (
        <div className="nav-user">
          <div className="nav-user-avatar">
            <img
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
              alt="Avatar"
            />
          </div>
          <div className="nav-user-name">
            {user.username}
            <span>#{user.discriminator}</span>
          </div>
          <div
            className="nav-link"
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
              navigate("/");
              toast.success("Logged out successfully!");
            }}
          >
            Log out
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
