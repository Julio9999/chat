import { ContentfulStatusCode } from "hono/utils/http-status";
import type { Context } from "hono";

interface HttpResponseParams {
  c: Context;
  message: string;
  status: ContentfulStatusCode;
  data?: any;
}

export const httpResponse = ({
  c,
  message,
  status,
  data,
}: HttpResponseParams) => {
  return c.json({ message, data }, status);
};
