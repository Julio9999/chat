import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { JwtHelper } from "../../../lib/jwt-helper";
import { httpResponse } from "../../../utils/http-response";

export const authMiddleware = createMiddleware(async (c, next) => {
  const excludedPaths = ["/auth/login"];
  const currentPath = c.req.path;

  if (excludedPaths.includes(currentPath)) {
    await next();
    return;
  }

  const access_token = getCookie(c, "access_token");

  if (!access_token) {
    return httpResponse({
      c,
      message: "Sin credenciales válidas",
      status: 401,
    });
  }

  const verify = JwtHelper.verifyJwt(access_token);

  if (!verify) {
    return httpResponse({ c, message: "Token inválido", status: 401 });
  }

  await next();
});
