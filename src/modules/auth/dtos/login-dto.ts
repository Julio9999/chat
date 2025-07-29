import { z } from "zod";


export const loginDto = z.object({
  username: z.string(),
  password: z.string(),
});
