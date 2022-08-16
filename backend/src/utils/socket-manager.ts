import { Socket } from "socket.io";
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
      const auth = SocketManager.socketClients.get(socket.id);
      if (!auth) return;

      if (await userHasAdminInGuild(auth, guildId)) {
        SocketManager.socketGuilds.set(socket.id, guildId);
      }
    });
  }
}
