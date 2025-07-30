import { Hono } from "hono";
import { setCookie } from "hono/cookie";

import { zValidator } from "@hono/zod-validator";
import { loginDto } from "./dtos/login-dto";
import { AuthService } from "./auth-service";
import { httpResponse } from "../../utils/http-response";
import { LOGIN_JWT_DURATION } from "../../constants/jwt-duration";

export const authRouter = new Hono();

authRouter.post("/login", zValidator("json", loginDto), async (c) => {
  const data = c.req.valid("json");
  const { username, password } = data;

  const { token } = await AuthService.login(username, password);

  setCookie(c, "access_token", token, {
    httpOnly: true,
    sameSite: "none",
    maxAge: LOGIN_JWT_DURATION
  });

  return httpResponse({ c, message: "Login exitoso", status: 200 });
});
