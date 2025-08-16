import type { ServerWebSocket } from "bun";

import { createBunWebSocket } from "hono/bun";

import { Hono } from "hono";

import { cors } from 'hono/cors'

import { logger } from 'hono/logger'

import userRouter from "./modules/users/users-controller";
import { authMiddleware } from "./modules/auth/middlewares/auth-middleware";
import { authRouter } from "./modules/auth/auth-controller";
import { errorHandler } from "./middlewares/error-handler-middleware";
import { wsRouter } from "./websocket/ws-router";

const app = new Hono();

const { websocket } = createBunWebSocket<ServerWebSocket>();


app.use(cors({origin: ['http://localhost:4173', 'http://localhost:5173', 'https://chat-frontend-g9yz.onrender.com'], credentials: true}))

app.use(logger())

app.use("*", authMiddleware)

app.onError(errorHandler)

app.route("/users", userRouter);

app.route("/auth", authRouter);

app.route("", wsRouter);


export default {
  fetch: app.fetch,
  websocket,
};
