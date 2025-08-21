import { 
  type User, 
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type BotConfig,
  type InsertBotConfig,
  type MessageTemplate,
  type InsertMessageTemplate,
  type Analytics,
  type InsertAnalytics
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Conversations
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  
  // Messages
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Bot Config
  getBotConfig(): Promise<BotConfig | undefined>;
  updateBotConfig(config: InsertBotConfig): Promise<BotConfig>;
  
  // Message Templates
  getMessageTemplates(): Promise<MessageTemplate[]>;
  getMessageTemplate(id: string): Promise<MessageTemplate | undefined>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  updateMessageTemplate(id: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate | undefined>;
  deleteMessageTemplate(id: string): Promise<boolean>;
  
  // Analytics
  getAnalytics(): Promise<Analytics[]>;
  createAnalyticsEntry(analytics: InsertAnalytics): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message[]>;
  private botConfig: BotConfig | undefined;
  private messageTemplates: Map<string, MessageTemplate>;
  private analytics: Map<string, Analytics>;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.messageTemplates = new Map();
    this.analytics = new Map();
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Create default user
    const defaultUser: User = {
      id: randomUUID(),
      username: "admin",
      password: "admin",
      name: "John Smith",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Default bot config
    this.botConfig = {
      id: randomUUID(),
      name: "Customer Support Bot",
      welcomeMessage: "Hello! I'm your virtual assistant. How can I help you today?",
      isActive: true,
      autoRespond: true,
      responseDelay: 1000,
      updatedAt: new Date(),
    };

    // Default message templates
    const templates: MessageTemplate[] = [
      {
        id: randomUUID(),
        name: "Order Status",
        content: "I can help you check your order status. Please provide your order number.",
        keywords: ["order", "status", "track"],
        category: "support",
        isActive: true,
        usageCount: 45,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Business Hours",
        content: "Our business hours are Monday-Friday 9AM-6PM EST. For urgent matters, please call our emergency line.",
        keywords: ["hours", "time", "open"],
        category: "general",
        isActive: true,
        usageCount: 23,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Return Policy",
        content: "You can return items within 30 days of purchase. Please visit our returns page for more details.",
        keywords: ["return", "refund", "policy"],
        category: "support",
        isActive: true,
        usageCount: 18,
        createdAt: new Date(),
      },
    ];

    templates.forEach(template => {
      this.messageTemplates.set(template.id, template);
    });

    // Sample conversations
    const sampleConversations: Conversation[] = [
      {
        id: randomUUID(),
        customerName: "Sarah Johnson",
        customerPhone: "+1234567890",
        customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
        lastMessage: "Bot successfully handled product inquiry",
        lastMessageTime: new Date(Date.now() - 2 * 60 * 1000),
        status: "active",
        isActive: true,
      },
      {
        id: randomUUID(),
        customerName: "Michael Chen",
        customerPhone: "+1234567891",
        customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
        lastMessage: "Thanks for the help!",
        lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
        status: "resolved",
        isActive: true,
      },
      {
        id: randomUUID(),
        customerName: "Emily Rodriguez",
        customerPhone: "+1234567892",
        customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
        lastMessage: "Bot escalated complex query to human agent",
        lastMessageTime: new Date(Date.now() - 12 * 60 * 1000),
        status: "pending",
        isActive: true,
      },
    ];

    sampleConversations.forEach(conv => {
      this.conversations.set(conv.id, conv);
    });

    // Sample analytics data
    const today = new Date();
    const analyticsData: Analytics = {
      id: randomUUID(),
      date: today,
      totalMessages: 2847,
      activeUsers: 1234,
      botResponses: 892,
      responseRate: 94,
      avgResponseTime: 1200,
      userSatisfaction: 48, // 4.8 out of 5, stored as 48
    };
    this.analytics.set(analyticsData.id, analyticsData);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
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
    this.users.set(id, user);
    return user;
  }

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).sort(
      (a, b) => (b.lastMessageTime?.getTime() || 0) - (a.lastMessageTime?.getTime() || 0)
    );
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
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
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;

    const updated = { ...conversation, ...updates };
    this.conversations.set(id, updated);
    return updated;
  }

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messages.get(conversationId) || [];
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

    const messages = this.messages.get(insertMessage.conversationId!) || [];
    messages.push(message);
    this.messages.set(insertMessage.conversationId!, messages);

    return message;
  }

  // Bot Config
  async getBotConfig(): Promise<BotConfig | undefined> {
    return this.botConfig;
  }

  async updateBotConfig(config: InsertBotConfig): Promise<BotConfig> {
    const updated: BotConfig = {
      id: this.botConfig?.id || randomUUID(),
      ...config,
      name: config.name || "Customer Support Bot",
      isActive: config.isActive ?? true,
      autoRespond: config.autoRespond ?? true,
      responseDelay: config.responseDelay ?? 1000,
      updatedAt: new Date(),
    };
    this.botConfig = updated;
    return updated;
  }

  // Message Templates
  async getMessageTemplates(): Promise<MessageTemplate[]> {
    return Array.from(this.messageTemplates.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getMessageTemplate(id: string): Promise<MessageTemplate | undefined> {
    return this.messageTemplates.get(id);
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
    this.messageTemplates.set(id, template);
    return template;
  }

  async updateMessageTemplate(id: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate | undefined> {
    const template = this.messageTemplates.get(id);
    if (!template) return undefined;

    const updated = { ...template, ...updates };
    this.messageTemplates.set(id, updated);
    return updated;
  }

  async deleteMessageTemplate(id: string): Promise<boolean> {
    return this.messageTemplates.delete(id);
  }

  // Analytics
  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).sort(
      (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)
    );
  }

  async createAnalyticsEntry(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = {
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
    this.analytics.set(id, analytics);
    return analytics;
  }
}

import { PostgresStorage } from "./storage/postgres";

// Initialize storage with error handling
let storageInstance: IStorage;
try {
  if (process.env.DATABASE_URL) {
    storageInstance = new PostgresStorage();
    console.log("Using PostgreSQL storage (Supabase)");
  } else {
    storageInstance = new MemStorage();
    console.log("Using in-memory storage");
  }
} catch (error) {
  console.warn("Failed to initialize PostgreSQL storage, falling back to in-memory:", error);
  storageInstance = new MemStorage();
}

export const storage = storageInstance;
