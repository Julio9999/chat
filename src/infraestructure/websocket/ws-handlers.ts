import { ServerWebSocket } from "bun";
import { WSContext } from "hono/ws";

export function handleConnect(ws:  WSContext<ServerWebSocket<undefined>>) {
  // Lógica para cuando un cliente se conecta
//   console.log("Cliente conectado:", payload);
  ws.send(JSON.stringify({ type: "connected", message: "Welcome!" }));
}

export function handleJoinConversation(ws: WSContext<ServerWebSocket<undefined>>) {
//   const { conversationId } = payload;
  // Lógica para que el cliente "se una" a una conversación
//   console.log(`Unido a conversación ${conversationId}`);
  ws.send(JSON.stringify({ type: "joined" }));
}

export function handleSendMessage(ws: WSContext<ServerWebSocket<undefined>>) {
//   const { conversationId, message } = payload;
  // Guardar el mensaje en base de datos, emitir a otros clientes, etc.
//   console.log(`Nuevo mensaje en conversación ${conversationId}: ${message}`);

  // Ejemplo: reenviar mensaje (en un sistema real tendrías lógica para enviarlo sólo a usuarios interesados)
  ws.send(JSON.stringify({ type: "message_received" }));
}