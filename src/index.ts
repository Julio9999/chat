import type { ServerWebSocket } from "bun";

import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

import { handleConnect, handleJoinConversation, handleSendMessage } from "./infraestructure/websocket/ws-handlers";

import userRouter from "./modules/users/users-controller";
import { authMiddleware } from "./modules/auth/middlewares/auth-middleware";
import { authRouter } from "./modules/auth/auth-controller";
import { errorHandler } from "./middlewares/error-handler-middleware";

const app = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();


app.use("*", authMiddleware)

app.onError(errorHandler)

app.route("/users", userRouter);

app.route("/auth", authRouter);




app.get(
  "/ws",
  upgradeWebSocket((c) => {

    return {
      onMessage(event, ws) {
        try {
          const type = event.type;

          switch (type) {
            case "connect":
              handleConnect(ws);
              break;
            case "join_conversation":
              handleJoinConversation(ws);
              break;
            case "send_message":
              handleSendMessage(ws);
              break;
            default:
              ws.send(JSON.stringify({ type: "error", message: "Evento desconocido" }));
          }
        } catch (error) {
          ws.send(JSON.stringify({ type: "error", message: "Error en el mensaje" }));
        }


      },
      onClose() {
        console.log("Cliente desconectado");
      },
    };
  })
);


export default {
  fetch: app.fetch,
  websocket,
};
