import type { ServerWebSocket } from "bun";

import { createBunWebSocket } from "hono/bun";

import { Hono } from "hono";

import { cors } from 'hono/cors'

import {  wsHandler } from "./websocket/ws-handlers";

import userRouter from "./modules/users/users-controller";
import { authMiddleware } from "./modules/auth/middlewares/auth-middleware";
import { authRouter } from "./modules/auth/auth-controller";
import { errorHandler } from "./middlewares/error-handler-middleware";

const app = new Hono();

const { websocket } = createBunWebSocket<ServerWebSocket>();


app.use(cors({origin: ['http://localhost:5173', 'https://chat-frontend-g9yz.onrender.com/'], credentials: true}))
app.use("*", authMiddleware)


app.onError(errorHandler)

app.route("/users", userRouter);

app.route("/auth", authRouter);

app.route("", wsHandler);


export default {
  fetch: app.fetch,
  websocket,
};
