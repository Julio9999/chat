import { eq, or } from "drizzle-orm";
import { users } from "../../database/users/schema";
import { db_client } from "../../database/database-client";

export class UsersRepository {
  static async createUser(data: {
    username: string;
    email: string;
    passwordHash: string;
    role: string;
  }) {
    const [user] = await db_client.insert(users).values(data).returning();
    return user;
  }

  static async getUserById(id: number) {
    const [user] = await db_client.select().from(users).where(eq(users.id, id));
    return user;
  }

  static async getUserByUsername(username: string) {
    const [user] = await db_client
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  static async getUserByEmail(email: string) {
    const [user] = await db_client
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

 static async getUserByEmailOrUsername(email: string, username: string) {
  const [user] = await db_client
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.username, username)));

  return user;
}

  static async getAllUsers() {
    return await db_client.select().from(users);
  }

  static async updateUser(
    id: number,
    data: Partial<{
      username: string;
      email: string;
      passwordHash: string;
      role: string;
    }>
  ) {
    const [user] = await db_client
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  static async deleteUser(id: number) {
    const [user] = await db_client
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    return user;
  }
}
