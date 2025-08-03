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

  let access_token = getCookie(c, "access_token");


    // Para WebSocket (el objeto 'c' tiene 'req' que es Request | WebSocketUpgradeRequest)
  if (!access_token && c.req.url.includes("ws")) {
    access_token = c.req.header("access_token");
  }

  if (!access_token) {
    return httpResponse({
      c,
      message: "Sin credenciales válidas",
      status: 401,
    });
  }

  try {
    const res = await JwtHelper.verifyJwt(access_token);
    await next();
  } catch (error) {
    return httpResponse({ c, message: "Token inválido", status: 401 });
  }
});
