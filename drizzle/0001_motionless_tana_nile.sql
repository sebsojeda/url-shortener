ALTER TABLE `urls` MODIFY COLUMN `alias` varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `urls` MODIFY COLUMN `url` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `urls` ADD CONSTRAINT `urls_alias_unique` UNIQUE(`alias`);