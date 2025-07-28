import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { conversations } from "../conversations/schema";
import { users } from "../users/schema";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),

  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  senderId: integer("sender_id").notNull().references(() => users.id),

  content: text("content").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow(),
});
