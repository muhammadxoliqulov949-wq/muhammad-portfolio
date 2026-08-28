CREATE TABLE `experience` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL,
	`company` text NOT NULL,
	`period` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`icon` text DEFAULT '🚀' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`level` integer DEFAULT 80 NOT NULL,
	`category` text DEFAULT 'Frontend' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`text` text NOT NULL,
	`avatar_initials` text DEFAULT '' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `profile` ADD `role2` text DEFAULT 'Veb-saytlar yarataman' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `role3` text DEFAULT 'Admin panellar quraman' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `photo_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `github` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `linkedin` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `instagram` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `location` text DEFAULT 'Toshkent, O''zbekiston' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `resume_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `github` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `projects` ADD `image` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `projects` ADD `tech` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `projects` ADD `featured` integer DEFAULT false NOT NULL;