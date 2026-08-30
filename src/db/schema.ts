import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export type VisitorSession = typeof visitorSessions.$inferSelect;

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
	downloadAndroid: text("download_android"),
	downloadIos: text("download_ios"),
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

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
	name: text("name").notNull(),
	role: text("role").notNull().default("reader"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const oauthUsers = pgTable(
	"oauth_users",
	{
		id: serial("id").primaryKey(),
		provider: text("provider").notNull(),
		providerId: text("provider_id").notNull(),
		name: text("name").notNull(),
		email: text("email"),
		avatar: text("avatar"),
		profileUrl: text("profile_url"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex("oauth_provider_id_idx").on(table.provider, table.providerId),
	],
);

export const testimonials = pgTable("testimonials", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => oauthUsers.id, { onDelete: "cascade" }),
	authorName: text("author_name").notNull(),
	authorAvatar: text("author_avatar"),
	authorProfileUrl: text("author_profile_url"),
	provider: text("provider").notNull(),
	content: text("content").notNull(),
	approved: boolean("approved").notNull().default(true),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const visitorSessions = pgTable(
	"visitor_sessions",
	{
		id: serial("id").primaryKey(),
		sessionId: text("session_id").notNull(),
		name: text("name"),
		firstSeenAt: timestamp("first_seen_at").notNull().defaultNow(),
		lastSeenAt: timestamp("last_seen_at").notNull().defaultNow(),
	},
	(table) => [uniqueIndex("visitor_session_id_idx").on(table.sessionId)],
);

export const siteStats = pgTable("site_stats", {
	id: serial("id").primaryKey(),
	totalViews: integer("total_views").notNull().default(0),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
