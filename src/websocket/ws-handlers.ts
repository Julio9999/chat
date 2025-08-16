import { ServerWebSocket } from "bun";
import { WSContext, WSMessageReceive } from "hono/ws";

import { userConnectionsManager } from "./user-connections-handler";
import { UsersRepository } from "../infraestructure/repositories/users/users-repository";

export const handleJoinConversation = (
  ws: WSContext<ServerWebSocket<undefined>>
) => {
  ws.send(JSON.stringify({ type: "joined" }));
};

export const handleWritting = async(ws: WSContext<ServerWebSocket<undefined>>, writting: boolean, userId: number) => {

  const user = await UsersRepository.getUserById(userId);

  const message = {
    event: "on_writting",
    payload: {writting, username: writting ? user.username: ''},
  };



  userConnectionsManager.broadcastExcept(ws,message)

};

export const handleSendMessage = (wsMessagePayload: any) => {
  const newMessage = {
    payload: wsMessagePayload.message,
    event: "on_new_message",
  };
  
  userConnectionsManager.broadcast(newMessage)
};
export const handleOnMessage = async (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext<ServerWebSocket<undefined>>
) => {
  const data = JSON.parse(event.data as string);

  const userId = data.userId;


  try {
    const event = data.event;
    const payload = data.payload;
    console.log(payload)

    switch (event) {
      case "join_conversation":
        handleJoinConversation(ws);
        break;
      case "send_message":
        handleSendMessage(payload);
        break;
      case "on_writting":
        handleWritting(ws,payload.writting, userId);
        break;
      default:
        ws.send(
          JSON.stringify({ type: "error", message: "Evento desconocido" })
        );
    }
  } catch (error) {
    ws.send(JSON.stringify({ type: "error", message: "Error en el mensaje" }));
  }
};

export const handleOnConnect = async (
  event: Event,
  ws: WSContext<ServerWebSocket<undefined>>,
  userId: number
) => {
  userConnectionsManager.addConnection(userId, ws)
  console.log("Cliente conectado");
};

export const handleOnClose = (
  ws: WSContext<ServerWebSocket<undefined>>,
  userId: number
) => {
  userConnectionsManager.removeConnection(userId, ws)
  console.log("Cliente desconectado");
};
