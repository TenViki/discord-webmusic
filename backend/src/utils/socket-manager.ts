import { Socket } from "socket.io";
import { io } from "../main";
import { IAuth } from "../models/auth.model";
import { userHasAdminInGuild } from "../services/discord.service";

export class SocketManager {
  public static socketClients = new Map<string, IAuth>();
  public static socketGuilds = new Map<string, string>();

  public static registerSocket(socket: Socket, user: IAuth) {
    SocketManager.socketClients.set(socket.id, user);

    SocketManager.registerEvents(socket);
  }

  public static async registerEvents(socket: Socket) {
    socket.on("select-guild", async (guildId) => {
      console.log("Select guild", guildId);
      const auth = SocketManager.socketClients.get(socket.id);
      if (!auth) return;

      console.log("Hello");
      if (await userHasAdminInGuild(auth, guildId)) {
        const oldGuild = SocketManager.socketGuilds.get(socket.id);
        if (oldGuild) socket.leave(oldGuild);
        socket.join(guildId);
        SocketManager.socketGuilds.set(socket.id, guildId);
      }
    });
  }

  public static async registerEvent(
    socket: Socket,
    event: string,
    callback: (...args: any[]) => void
  ) {
    socket.on(event, async (...args) => {
      const auth = SocketManager.socketClients.get(socket.id);
      if (!auth) return;

      if (SocketManager.socketGuilds.has(socket.id)) {
        callback(...args);
      }
    });
  }

  public static sendToGuild(guildId: string, event: string, ...args: any[]) {
    io.to(guildId).emit(event, ...args);
  }
}
