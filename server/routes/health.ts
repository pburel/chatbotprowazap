import { Request, Response } from "express";
import { storage } from "../storage";

export async function getHealth(req: Request, res: Response) {
  try {
    // Test database connection by trying to fetch analytics
    let dbStatus = {
      connected: false,
      type: "In-Memory",
      error: undefined as string | undefined
    };

    try {
      // Try to perform a simple database operation
      await storage.getAnalytics();
      
      // If using PostgreSQL (has DATABASE_URL), mark as connected
      if (process.env.DATABASE_URL) {
        dbStatus = {
          connected: true,
          type: "PostgreSQL (Supabase)",
          error: undefined
        };
      } else {
        dbStatus = {
          connected: true,
          type: "In-Memory",
          error: undefined
        };
      }
    } catch (error) {
      dbStatus = {
        connected: false,
        type: process.env.DATABASE_URL ? "PostgreSQL (Supabase)" : "In-Memory",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      timestamp: new Date().toISOString()
    });
  }
}