import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text(),
    username: text().unique(),
    password: text(),
    email: text().notNull().unique(),
    birthday: integer(),
    country: text(),
    aboutMe: text(),
    avatar:text(),
    createdAt: integer().notNull(),
    updatedAt: integer().notNull()
});

export const socialConnections = sqliteTable("social_connections", {
    id: integer().primaryKey(),
    userId: integer().references(() => users.id, { onDelete: "cascade" }),
    provider: text().notNull(),
    providerId: text().notNull(),
    createdAt: integer().notNull(),
    updatedAt: integer().notNull()
});



export const pages = sqliteTable("pages", {
    id: integer().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    slug: text().notNull().unique(),
    authorId: integer().references(() => users.id, { onDelete: "set null" }),
    content: text().notNull(),
    createdAt: integer().notNull(),
    updatedAt: integer().notNull(),
    status: text().notNull(),
    publishedAt: integer(),
    excerpt: text(),
    coverImage: text(),
    seoTitle: text(),
    seoDescription: text(),
    seoKeywords: text(),
});