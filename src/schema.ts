import {
  mysqlTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const urls = mysqlTable(
  "urls",
  {
    id: serial("id").primaryKey(),
    alias: varchar("alias", { length: 16 }).notNull().unique(),
    url: varchar("url", { length: 255 }).notNull(),
  },
  (urls) => ({
    aliasIndex: uniqueIndex("alias_index").on(urls.alias),
  })
);
