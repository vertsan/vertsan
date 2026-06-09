import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
	id: serial("id").primaryKey(),
	jobTitle: text("job_title").notNull(),
	company: text("company").notNull(),
	location: text("location").notNull(),
	summary: text("summary").notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date"),
	tags: text("tags").array().notNull().default([]),
	content: text("content").notNull().default(""),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const education = pgTable("education", {
	id: serial("id").primaryKey(),
	school: text("school").notNull(),
	summary: text("summary").notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date"),
	tags: text("tags").array().notNull().default([]),
	content: text("content").notNull().default(""),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	summary: text("summary").notNull(),
	status: text("status").notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date").notNull(),
	image: text("image"),
	link: text("link"),
	github: text("github"),
	tags: text("tags").array().notNull().default([]),
	content: text("content").notNull().default(""),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const certificates = pgTable("certificates", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	issuer: text("issuer").notNull(),
	date: text("date").notNull(),
	summary: text("summary").notNull(),
	credentialUrl: text("credential_url"),
	tags: text("tags").array().notNull().default([]),
	content: text("content").notNull().default(""),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const technologies = pgTable("technologies", {
	id: serial("id").primaryKey(),
	category: text("category").notNull(),
	items: text("items").array().notNull().default([]),
	content: text("content").notNull().default(""),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
