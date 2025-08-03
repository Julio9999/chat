import { ServerWebSocket } from "bun";
import { createBunWebSocket } from "hono/bun";
import { Hono } from "hono";
import { WSContext, WSMessageReceive } from "hono/ws";

import { UsersRepository } from "../infraestructure/repositories/users/users-repository";

export const wsHandler = new Hono();

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();


export function handleJoinConversation(
  ws: WSContext<ServerWebSocket<undefined>>
) {
  ws.send(JSON.stringify({ type: "joined" }));
}

export function handleSendMessage(ws: WSContext<ServerWebSocket<undefined>>) {
  ws.send(JSON.stringify({ type: "message_received" }));
}

export async function handleOnMessage(
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext<ServerWebSocket<undefined>>
) {
  const data = JSON.parse(event.data as string);

  const { userId } = data.payload;


  const user = await UsersRepository.getUserById(userId);

  try {
    const event = data.event;
    const payload = data.payload;

    switch (event) {
      case "join_conversation":
        handleJoinConversation(ws);
        break;
      case "send_message":
        handleSendMessage(ws);
        break;
      default:
        ws.send(
          JSON.stringify({ type: "error", message: "Evento desconocido" })
        );
    }
  } catch (error) {
    ws.send(JSON.stringify({ type: "error", message: "Error en el mensaje" }));
  }
}

wsHandler.get(
  "/ws",
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        handleOnMessage(event, ws)
      },
      onClose() {
        console.log("Cliente desconectado");
      },
    };
  })
);