"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertProfileSchema = exports.insertCalculationSchema = exports.insertWorkerSchema = exports.insertProjectSchema = exports.profiles = exports.calculations = exports.workers = exports.projects = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const zod_1 = require("zod");
exports.projects = (0, pg_core_1.pgTable)("projects", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    address: (0, pg_core_1.text)("address").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.workers = (0, pg_core_1.pgTable)("workers", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    projectId: (0, pg_core_1.integer)("project_id").notNull().references(() => exports.projects.id),
    name: (0, pg_core_1.text)("name").notNull(),
    position: (0, pg_core_1.text)("position").notNull(),
    dailySalary: (0, pg_core_1.integer)("daily_salary").notNull(),
    workDays: (0, pg_core_1.integer)("work_days").notNull(),
});
exports.calculations = (0, pg_core_1.pgTable)("calculations", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    projectId: (0, pg_core_1.integer)("project_id").notNull().references(() => exports.projects.id),
    date: (0, pg_core_1.timestamp)("date").defaultNow().notNull(),
    summary: (0, pg_core_1.json)("summary").notNull(),
    totalSalary: (0, pg_core_1.integer)("total_salary").notNull(),
});
exports.profiles = (0, pg_core_1.pgTable)("profiles", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username"),
    email: (0, pg_core_1.text)("email"),
    bio: (0, pg_core_1.text)("bio"),
    photoUrl: (0, pg_core_1.text)("photo_url"),
});
exports.insertProjectSchema = zod_1.z.object({
    name: zod_1.z.string(),
    address: zod_1.z.string(),
});
exports.insertWorkerSchema = zod_1.z.object({
    projectId: zod_1.z.number(),
    name: zod_1.z.string(),
    position: zod_1.z.string(),
    dailySalary: zod_1.z.number(),
    workDays: zod_1.z.number(),
});
exports.insertCalculationSchema = zod_1.z.object({
    projectId: zod_1.z.number(),
    summary: zod_1.z.any(),
    totalSalary: zod_1.z.number(),
});
exports.insertProfileSchema = zod_1.z.object({
    username: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    photoUrl: zod_1.z.string().optional(),
});
//# sourceMappingURL=schema.js.map