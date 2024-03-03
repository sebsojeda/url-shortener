import "dotenv/config";
import { createClient } from "redis";

const redis = createClient({ password: process.env.REDIS_PASSWORD });

await redis.connect();

export default redis;
