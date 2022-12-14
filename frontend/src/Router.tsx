import React, { useEffect } from "react";
import { QueryClient, useQuery } from "react-query";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Redirect from "./pages/Redirect";
import "react-toastify/dist/ReactToastify.css";
import { DiscordUser } from "./types/auth";
import Navbar from "./components/nav/Navbar";
import { getUser } from "./api/login";
import Servers from "./pages/Servers";
import Guild from "./pages/Guild";
import { io, Socket } from "socket.io-client";
import { getBackgroundImage } from "./utils/background";

export const UserContext = React.createContext<{
  user: DiscordUser | null;
  setUser: React.Dispatch<React.SetStateAction<DiscordUser | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const SocketContext = React.createContext<Socket | null>(null);

export const useSocket = () => {
  return React.useContext(SocketContext);
};

const Router = () => {
  const [user, setUser] = React.useState<DiscordUser | null>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [backgroundimage] = React.useState<string>(getBackgroundImage());

  useQuery("user", () => getUser(localStorage.getItem("token")!), {
    enabled: !!localStorage.getItem("token"),
    onSuccess: (data) => setUser(data.data),
  });

  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_BACKEND_URL);

    socket.on("connect", () => {
      socket.emit("auth", localStorage.getItem("token"));
    });
    socket.on("auth-success", () => {
      console.log("Socket authorized");
      setSocket(socket);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SocketContext.Provider value={socket}>
        <Navbar user={user} setUser={setUser} />

        <main>
          <Routes>
            <Route path="/" element={<Home backgroundUrl={backgroundimage} />} />
            <Route path="/auth/redirect" element={<Redirect />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/servers/:guildId" element={<Guild />} />
          </Routes>
        </main>
        <ToastContainer theme="dark" />
      </SocketContext.Provider>
    </UserContext.Provider>
  );
};

export default Router;
