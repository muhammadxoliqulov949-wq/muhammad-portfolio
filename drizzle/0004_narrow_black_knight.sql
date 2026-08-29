CREATE TABLE `achievements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`issuer` text DEFAULT '' NOT NULL,
	`kind` text DEFAULT 'cert' NOT NULL,
	`year` text DEFAULT '' NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`url` text DEFAULT '' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`institution` text NOT NULL,
	`credential` text DEFAULT '' NOT NULL,
	`field` text DEFAULT '' NOT NULL,
	`period` text DEFAULT '' NOT NULL,
	`status` text DEFAULT '' NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`current` integer DEFAULT false NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `profile` ADD `phone` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `english_level` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `story` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `strengths` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `interests` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `principle_work` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `principle_delivery` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `workflow` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `status` text DEFAULT '' NOT NULL;