import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  password: text().notNull(),
  name: text(),
  age: int(),
  email: text().unique(),
});

export const facebookAccountsTable = sqliteTable("facebook_accounts_table", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  facebookId: text().notNull().unique(),
  name: text(),
  email: text(),
  password: text(),
  accessToken: text().notNull(),
  refreshToken: text(),
  tokenExpiresAt: int(), // unix timestamp; null if long-lived
  createdAt: int({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: int({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const marketplacePostsTable = sqliteTable("marketplace_posts_table", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  facebookAccountId: int()
    .notNull()
    .references(() => facebookAccountsTable.id, { onDelete: "cascade" }),
  title: text().notNull(),
  description: text(),
  price: text(), // e.g. "10", "10.50 €" for flexibility
  category: text(),
  imageUrls: text(), // JSON array of image URLs: ["url1", "url2"]
  status: text()
    .notNull()
    .$type<"draft" | "scheduled" | "publishing" | "published" | "failed">()
    .default("draft"),
  scheduledAt: int(), // unix timestamp; when to publish (optional)
  publishedAt: int(), // unix timestamp; set when status = published
  facebookPostId: text(), // Marketplace listing ID from Facebook API
  failureReason: text(), // error message when status = failed
  createdAt: int({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: int({ mode: "timestamp" }).$defaultFn(() => new Date()),
});