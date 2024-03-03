import { drizzle } from "drizzle-orm/mysql2";
import mysql2 from "mysql2/promise";
import * as schema from "./schema";

export const connection = await mysql2.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "db",
});

export const db = drizzle(connection, { schema: schema, mode: "default" });
