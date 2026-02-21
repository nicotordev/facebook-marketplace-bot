CREATE TABLE `facebook_accounts_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`facebookId` text NOT NULL,
	`name` text,
	`email` text,
	`accessToken` text NOT NULL,
	`refreshToken` text,
	`tokenExpiresAt` integer,
	`createdAt` integer,
	`updatedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `facebook_accounts_table_facebookId_unique` ON `facebook_accounts_table` (`facebookId`);--> statement-breakpoint
CREATE TABLE `marketplace_posts_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`facebookAccountId` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`price` text,
	`category` text,
	`imageUrls` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`scheduledAt` integer,
	`publishedAt` integer,
	`facebookPostId` text,
	`failureReason` text,
	`createdAt` integer,
	`updatedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`facebookAccountId`) REFERENCES `facebook_accounts_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`name` text,
	`age` integer,
	`email` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);