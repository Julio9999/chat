import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users/schema";

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),

  // Un cliente y un agente por conversación (1 a 1)
  clientId: integer("client_id").notNull().references(() => users.id),
  agentId: integer("agent_id").notNull().references(() => users.id),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
