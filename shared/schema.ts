import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAvatar: text("customer_avatar"),
  lastMessage: text("last_message"),
  lastMessageTime: timestamp("last_message_time").defaultNow(),
  status: text("status").notNull().default("active"), // active, resolved, pending
  isActive: boolean("is_active").default(true),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  content: text("content").notNull(),
  isBot: boolean("is_bot").default(false),
  isUser: boolean("is_user").default(true),
  timestamp: timestamp("timestamp").defaultNow(),
  messageType: text("message_type").default("text"), // text, image, file, template
  metadata: jsonb("metadata"), // for storing additional message data
});

export const botConfigs = pgTable("bot_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().default("Customer Support Bot"),
  welcomeMessage: text("welcome_message").notNull(),
  isActive: boolean("is_active").default(true),
  autoRespond: boolean("auto_respond").default(true),
  responseDelay: integer("response_delay").default(1000), // in milliseconds
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messageTemplates = pgTable("message_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  content: text("content").notNull(),
  keywords: text("keywords").array(), // trigger keywords
  category: text("category").default("general"), // general, support, sales, etc.
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").defaultNow(),
  totalMessages: integer("total_messages").default(0),
  activeUsers: integer("active_users").default(0),
  botResponses: integer("bot_responses").default(0),
  responseRate: integer("response_rate").default(0), // percentage
  avgResponseTime: integer("avg_response_time").default(0), // in seconds
  userSatisfaction: integer("user_satisfaction").default(0), // 1-5 rating
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  avatar: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  customerName: true,
  customerPhone: true,
  customerAvatar: true,
  lastMessage: true,
  status: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  content: true,
  isBot: true,
  isUser: true,
  messageType: true,
  metadata: true,
});

export const insertBotConfigSchema = createInsertSchema(botConfigs).pick({
  name: true,
  welcomeMessage: true,
  isActive: true,
  autoRespond: true,
  responseDelay: true,
});

export const insertMessageTemplateSchema = createInsertSchema(messageTemplates).pick({
  name: true,
  content: true,
  keywords: true,
  category: true,
  isActive: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  date: true,
  totalMessages: true,
  activeUsers: true,
  botResponses: true,
  responseRate: true,
  avgResponseTime: true,
  userSatisfaction: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertBotConfig = z.infer<typeof insertBotConfigSchema>;
export type BotConfig = typeof botConfigs.$inferSelect;

export type InsertMessageTemplate = z.infer<typeof insertMessageTemplateSchema>;
export type MessageTemplate = typeof messageTemplates.$inferSelect;

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
