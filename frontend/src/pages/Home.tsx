import Button from "../components/button/Button";
import "./Home.scss";
import { FaDiscord } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router";
import { UserContext } from "../Router";
import React from "react";

const Home = () => {
  const navigate = useNavigate();
  const { user } = React.useContext(UserContext);

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-text">
          <h1>Zexel</h1>
          <p>Take your music playing on discord to another level</p>
          {user ? (
            <Button
              text="Manage servers"
              onClick={() => navigate("/servers")}
              RightIcon={FiChevronRight}
            />
          ) : (
            <Button
              text="Login with Discord"
              color="discord"
              LeftIcon={FaDiscord}
              RightIcon={FiChevronRight}
              onClick={() =>
                window.location.replace(import.meta.env.VITE_DISCORD_REDIRECT)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
