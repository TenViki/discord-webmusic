import React from "react";
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

export const UserContext = React.createContext<{
  user: DiscordUser | null;
  setUser: React.Dispatch<React.SetStateAction<DiscordUser | null>>;
}>({
  user: null,
  setUser: () => {},
});

const Router = () => {
  const [user, setUser] = React.useState<DiscordUser | null>(null);
  useQuery("user", () => getUser(localStorage.getItem("token")!), {
    enabled: !!localStorage.getItem("token"),
    onSuccess: (data) => setUser(data.data),
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Navbar user={user} setUser={setUser} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/redirect" element={<Redirect />} />
          <Route path="/servers" element={<Servers />} />
          <Route path="/servers/:guildId" element={<Guild />} />
        </Routes>
      </main>
      <ToastContainer theme="dark" />
    </UserContext.Provider>
  );
};

export default Router;
