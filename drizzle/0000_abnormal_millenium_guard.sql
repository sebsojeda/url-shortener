CREATE TABLE `urls` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`alias` varchar(16),
	`url` varchar(255),
	CONSTRAINT `urls_id` PRIMARY KEY(`id`),
	CONSTRAINT `alias_index` UNIQUE(`alias`)
);
