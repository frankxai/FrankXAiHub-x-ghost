import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original User table - kept as is
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  authorName: text("author_name").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  readTime: integer("read_time").notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

// Resources (AI Center of Excellence)
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  icon: text("icon").notNull(),
  link: text("link").notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

// AI Characters
export const aiCharacters = pgTable("ai_characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  type: text("type").notNull(),
});

export const insertAiCharacterSchema = createInsertSchema(aiCharacters).omit({
  id: true,
});

// Music Samples
export const musicSamples = pgTable("music_samples", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  tags: text("tags").notNull(),
  duration: text("duration").notNull(),
  audioUrl: text("audio_url").notNull(),
});

export const insertMusicSampleSchema = createInsertSchema(musicSamples).omit({
  id: true,
});

// Reading Progress
export const readingProgress = pgTable("reading_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  postId: integer("post_id").notNull(),
  progress: integer("progress").notNull(),
});

export const insertReadingProgressSchema = createInsertSchema(readingProgress).omit({
  id: true,
});

// AI Maturity Assessments
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  organizationName: text("organization_name").notNull(),
  industry: text("industry").notNull(),
  size: text("size").notNull(),
  role: text("role").notNull(),
  objectives: text("objectives").array().notNull(),
  maturityScore: integer("maturity_score"),
  recommendations: jsonb("recommendations"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  maturityScore: true,
  recommendations: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertAICharacter = z.infer<typeof insertAiCharacterSchema>;
export type AICharacter = typeof aiCharacters.$inferSelect;

export type InsertMusicSample = z.infer<typeof insertMusicSampleSchema>;
export type MusicSample = typeof musicSamples.$inferSelect;

export type InsertReadingProgress = z.infer<typeof insertReadingProgressSchema>;
export type ReadingProgress = typeof readingProgress.$inferSelect;

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
