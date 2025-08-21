import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  users,
  conversations,
  messages,
  botConfigs,
  messageTemplates,
  analytics,
  type User,
  type Conversation,
  type Message,
  type BotConfig,
  type MessageTemplate,
  type Analytics,
  type InsertUser,
  type InsertConversation,
  type InsertMessage,
  type InsertBotConfig,
  type InsertMessageTemplate,
  type InsertAnalytics,
} from "../../shared/schema";
import type { IStorage } from "../storage";

export class PostgresStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    return await this.getUserById(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "admin",
      avatar: insertUser.avatar ?? null,
      createdAt: new Date(),
    };

    await db.insert(users).values(user);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    await db.update(users).set(updates).where(eq(users.id, id));
    return await this.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    return await this.getAllConversations();
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return await this.getConversationById(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      status: insertConversation.status || "active",
      customerAvatar: insertConversation.customerAvatar ?? null,
      lastMessage: insertConversation.lastMessage ?? null,
      lastMessageTime: new Date(),
      isActive: true,
    };

    await db.insert(conversations).values(conversation);
    return conversation;
  }

  async getConversationById(id: string): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    return result[0];
  }

  async getAllConversations(): Promise<Conversation[]> {
    return await db.select().from(conversations);
  }

  async updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation | undefined> {
    await db.update(conversations).set(updates).where(eq(conversations.id, id));
    return await this.getConversationById(id);
  }

  async deleteConversation(id: string): Promise<boolean> {
    const result = await db.delete(conversations).where(eq(conversations.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    return await this.getMessagesByConversation(conversationId);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      conversationId: insertMessage.conversationId ?? null,
      isBot: insertMessage.isBot ?? false,
      isUser: insertMessage.isUser ?? true,
      messageType: insertMessage.messageType ?? "text",
      timestamp: new Date(),
      metadata: insertMessage.metadata ?? null,
    };

    await db.insert(messages).values(message);
    return message;
  }

  async getMessageById(id: string): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result[0];
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.conversationId, conversationId));
  }

  async getAllMessages(): Promise<Message[]> {
    return await db.select().from(messages);
  }

  async updateMessage(id: string, updates: Partial<InsertMessage>): Promise<Message | undefined> {
    await db.update(messages).set(updates).where(eq(messages.id, id));
    return await this.getMessageById(id);
  }

  async deleteMessage(id: string): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  // Bot Configuration
  async getBotConfig(): Promise<BotConfig | undefined> {
    const result = await db.select().from(botConfigs).limit(1);
    return result[0];
  }

  async updateBotConfig(config: InsertBotConfig): Promise<BotConfig> {
    const existing = await this.getBotConfig();
    const id = existing?.id || randomUUID();
    
    const updated: BotConfig = {
      id,
      ...config,
      name: config.name || "Customer Support Bot",
      isActive: config.isActive ?? true,
      autoRespond: config.autoRespond ?? true,
      responseDelay: config.responseDelay ?? 1000,
      updatedAt: new Date(),
    };

    if (existing) {
      await db.update(botConfigs).set(updated).where(eq(botConfigs.id, id));
    } else {
      await db.insert(botConfigs).values(updated);
    }

    return updated;
  }

  // Message Templates
  async getMessageTemplates(): Promise<MessageTemplate[]> {
    return await this.getAllMessageTemplates();
  }

  async getMessageTemplate(id: string): Promise<MessageTemplate | undefined> {
    return await this.getMessageTemplateById(id);
  }

  async createMessageTemplate(insertTemplate: InsertMessageTemplate): Promise<MessageTemplate> {
    const id = randomUUID();
    const template: MessageTemplate = {
      ...insertTemplate,
      id,
      keywords: insertTemplate.keywords ?? null,
      category: insertTemplate.category ?? null,
      isActive: insertTemplate.isActive ?? true,
      usageCount: 0,
      createdAt: new Date(),
    };

    await db.insert(messageTemplates).values(template);
    return template;
  }

  async getMessageTemplateById(id: string): Promise<MessageTemplate | undefined> {
    const result = await db.select().from(messageTemplates).where(eq(messageTemplates.id, id)).limit(1);
    return result[0];
  }

  async getAllMessageTemplates(): Promise<MessageTemplate[]> {
    return await db.select().from(messageTemplates);
  }

  async updateMessageTemplate(id: string, updates: Partial<InsertMessageTemplate>): Promise<MessageTemplate | undefined> {
    await db.update(messageTemplates).set(updates).where(eq(messageTemplates.id, id));
    return await this.getMessageTemplateById(id);
  }

  async deleteMessageTemplate(id: string): Promise<boolean> {
    const result = await db.delete(messageTemplates).where(eq(messageTemplates.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  // Analytics
  async getAnalytics(): Promise<Analytics[]> {
    return await this.getAllAnalytics();
  }

  async createAnalyticsEntry(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    return await this.createAnalytics(insertAnalytics);
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analyticsEntry: Analytics = {
      ...insertAnalytics,
      id,
      date: insertAnalytics.date || new Date(),
      totalMessages: insertAnalytics.totalMessages ?? 0,
      activeUsers: insertAnalytics.activeUsers ?? 0,
      botResponses: insertAnalytics.botResponses ?? 0,
      responseRate: insertAnalytics.responseRate ?? 0,
      avgResponseTime: insertAnalytics.avgResponseTime ?? 0,
      userSatisfaction: insertAnalytics.userSatisfaction ?? 0,
    };

    await db.insert(analytics).values(analyticsEntry);
    return analyticsEntry;
  }

  async getAnalyticsById(id: string): Promise<Analytics | undefined> {
    const result = await db.select().from(analytics).where(eq(analytics.id, id)).limit(1);
    return result[0];
  }

  async getAllAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analytics);
  }

  async updateAnalytics(id: string, updates: Partial<InsertAnalytics>): Promise<Analytics | undefined> {
    await db.update(analytics).set(updates).where(eq(analytics.id, id));
    return await this.getAnalyticsById(id);
  }

  async deleteAnalytics(id: string): Promise<boolean> {
    const result = await db.delete(analytics).where(eq(analytics.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }
}