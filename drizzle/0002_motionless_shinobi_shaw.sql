-- 0002: case study va dizayn auditi tuzatishlari uchun yangi ustunlar.
--
-- Eslatma: Drizzle generate bu migratsiyaga `ALTER TABLE ... ALTER COLUMN`
-- qatorlarini ham qo'shgan edi (profile.email, skills.level, services.icon
-- kabi ustunlardagi DEFAULT qiymatlarini yangilash uchun). SQLite bu
-- amalni qo'llab-quvvatlamaydi — shuning uchun ular olib tashlandi.
-- Bu xavfsiz: ilova (API + seed) bu ustunlarga qiymatni har doim aniq
-- yuboradi, ya'ni eski DEFAULT hech qachon ishlatilmaydi.
-- (Agar kelajakda DB'ni noldan toza qurmoqchi bo'lsangiz:
--  `rm -rf drizzle data && npm run db:setup` — yangi bitta migratsiya paydo bo'ladi.)

ALTER TABLE `profile` ADD `response_time` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `since_year` text DEFAULT '' NOT NULL;--> statement-breakpoint

ALTER TABLE `projects` ADD `year` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `role` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `impact` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `problem` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `approach` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `outcome` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `gallery` text DEFAULT '' NOT NULL;--> statement-breakpoint

ALTER TABLE `skills` ADD `years` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `skills` ADD `context` text DEFAULT '' NOT NULL;--> statement-breakpoint

ALTER TABLE `services` ADD `price_from` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `delivery` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `features` text DEFAULT '' NOT NULL;--> statement-breakpoint

ALTER TABLE `experience` ADD `highlights` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `experience` ADD `current` integer DEFAULT false NOT NULL;--> statement-breakpoint

ALTER TABLE `testimonials` ADD `rating` integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `source_url` text DEFAULT '' NOT NULL;
