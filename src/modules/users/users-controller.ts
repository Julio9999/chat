import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { UsersService } from "./users-service";
import { createUserSchema, updateUserSchema } from "./users-dto";
import { IUser } from "./users-interfaces";

const userRouter = new Hono();

userRouter.get("/", async (c) => {
  const allUsers = await UsersService.getAllUsers();
  return c.json(allUsers);
});

userRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const user = await UsersService.getUserById(id);
  if (!user) return c.notFound();
  return c.json(user);
});

userRouter.post(
  "/",
  zValidator("json", createUserSchema),
  async (c) => {
    const data = c.req.valid("json") ;
    const newUser = await UsersService.createUser(data);
    return c.json(newUser, 201);
  }
);

userRouter.put(
  "/:id",
  zValidator("json", updateUserSchema),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await UsersService.updateUser(id, data);
    return c.json(updated);
  }
);

userRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await UsersService.deleteUser(id);
  return c.json(deleted);
});

export default userRouter;
