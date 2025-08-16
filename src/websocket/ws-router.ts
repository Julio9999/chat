import { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

import { handleOnClose, handleOnConnect, handleOnMessage } from "./ws-handlers";
import { JwtHelper } from "../lib/jwt-helper";

export const wsRouter = new Hono();

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

wsRouter.get(
  "/ws",
  upgradeWebSocket(async (c) => {
    const cookieHeader = c.req.header("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((pair) => pair.split("="))
    );
    const access_token = cookies["access_token"];
    const user = await JwtHelper.decodeJwt(access_token);
    const userId = user.payload.id as number; 


    return {
      onOpen(event, ws) {
        handleOnConnect(event, ws, userId);
      },
      onMessage(event, ws) {
        handleOnMessage(event, ws);
      },
      onClose(event, ws) {
        handleOnClose(ws, userId);
      },
    };
  })
);
