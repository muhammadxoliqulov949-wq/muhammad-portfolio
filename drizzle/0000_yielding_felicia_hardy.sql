CREATE TABLE `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text DEFAULT 'Admin' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`message` text NOT NULL,
	`read` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text DEFAULT 'Muhammad' NOT NULL,
	`title` text DEFAULT 'Full-stack dasturchi' NOT NULL,
	`badge` text DEFAULT 'Portfolio sayt' NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`avatar_initials` text DEFAULT 'MX' NOT NULL,
	`email` text DEFAULT 'yourname@example.com' NOT NULL,
	`telegram` text DEFAULT '@yourusername' NOT NULL,
	`stat_projects` text DEFAULT '5+' NOT NULL,
	`stat_experience` text DEFAULT '2 yil' NOT NULL,
	`stat_availability` text DEFAULT '24/7' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`link` text DEFAULT '',
	`order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
