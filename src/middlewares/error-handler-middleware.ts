import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { BlankEnv, HTTPResponseError } from "hono/types";

export const errorHandler = (
  err: Error | HTTPResponseError | any,
  c: Context<BlankEnv, any, {}>
) => {
  console.log(err);

  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }

  if (err.code == "ERR_POSTGRES_SERVER_ERROR") {
    return c.json({ message: err.detail }, 400);
  }

  return c.json({ message: "Algo salió mal" }, 500);
};
