import { ServerWebSocket } from "bun";
import { createBunWebSocket } from "hono/bun";
import { Hono } from "hono";
import { WSContext, WSMessageReceive } from "hono/ws";

import { UsersRepository } from "../infraestructure/repositories/users/users-repository";
import { WSMessagePayload } from "./interfaces/ws-interfaces";

export const wsHandler = new Hono();

const connectedClients: WSContext<ServerWebSocket<undefined>>[] = [];

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

export const handleJoinConversation = (
  ws: WSContext<ServerWebSocket<undefined>>
) => {
  ws.send(JSON.stringify({ type: "joined" }));
};

export const handleSendMessage = (
  ws: WSContext<ServerWebSocket<undefined>>,
  wsMessagePayload: any
) => {

  const message = JSON.stringify({ message: wsMessagePayload.message });
  console.log("Enviando mensaje:");

  // Enviar a todos los clientes conectados
  for (const client of connectedClients) {
    console.log("Enviando mensaje a cliente:");
    client.send(message);
  }
};
export const handleOnMessage = async (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext<ServerWebSocket<undefined>>
) => {
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
        handleSendMessage(ws, payload);
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
  ws: WSContext<ServerWebSocket<undefined>>
) => {
  connectedClients.push(ws);
  console.log("Cliente conectado");
};

export const handleOnClose = (ws: WSContext<ServerWebSocket<undefined>>) => {
  const index = connectedClients.indexOf(ws);
  if (index !== -1) {
    connectedClients.splice(index, 1);
  }
  console.log("Cliente desconectado");
};

wsHandler.get(
  "/ws",
  upgradeWebSocket((c) => {
    return {
      onOpen(event, ws) {
        handleOnConnect(event, ws);
      },
      onMessage(event, ws) {
        handleOnMessage(event, ws);
      },
      onClose(event, ws) {
        handleOnClose(ws);
      },
    };
  })
);
