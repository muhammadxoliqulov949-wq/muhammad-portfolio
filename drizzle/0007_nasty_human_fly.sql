CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`mime` text DEFAULT 'image/jpeg' NOT NULL,
	`data` text NOT NULL,
	`bytes` integer DEFAULT 0 NOT NULL,
	`width` integer,
	`height` integer,
	`etag` text DEFAULT '' NOT NULL,
	`uploaded_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_key_unique` ON `media` (`key`);