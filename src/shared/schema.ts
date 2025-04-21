import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { z } from "zod";

// Note: For this application, we're using localStorage for data persistence.
// This schema is primarily for type definitions used in the application.

// Project schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Worker schema
export const workers = pgTable("workers", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  name: text("name").notNull(),
  position: text("position").notNull(),
  dailySalary: integer("daily_salary").notNull(),
  workDays: integer("work_days").notNull(),
});

// Calculation result schema
export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  date: timestamp("date").defaultNow().notNull(),
  summary: json("summary").notNull(),
  totalSalary: integer("total_salary").notNull(),
});

// User profile schema
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  username: text("username"),
  email: text("email"),
  bio: text("bio"),
  photoUrl: text("photo_url"),
});

// Type definitions
export type Project = typeof projects.$inferSelect;
export type Worker = typeof workers.$inferSelect;
export type Calculation = typeof calculations.$inferSelect;
export type Profile = typeof profiles.$inferSelect;

// Define schemas manually instead of using createInsertSchema
export const insertProjectSchema = z.object({
  name: z.string(),
  address: z.string(),
});

export const insertWorkerSchema = z.object({
  projectId: z.number(),
  name: z.string(),
  position: z.string(),
  dailySalary: z.number(),
  workDays: z.number(),
});

export const insertCalculationSchema = z.object({
  projectId: z.number(),
  summary: z.any(),
  totalSalary: z.number(),
});

export const insertProfileSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertWorker = z.infer<typeof insertWorkerSchema>;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
