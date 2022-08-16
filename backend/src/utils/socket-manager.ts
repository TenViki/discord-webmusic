import { Socket } from "socket.io";
import { IAuth } from "../models/auth.model";

export class SocketManager {
  public static clients = new Map<string, { socket: Socket; user: IAuth }>();
}
