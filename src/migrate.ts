import "dotenv/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { connection, db } from "./db";

await migrate(db, { migrationsFolder: "./drizzle" });
await connection.end();
