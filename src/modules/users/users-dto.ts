import { z } from "zod";


export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string(),
  password: z.string().min(6),
  role: z.enum(["agent", "client"]),
});

export const updateUserSchema = createUserSchema.partial();