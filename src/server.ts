import { serve } from "bun";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./db";
import redis from "./redis";
import { urls } from "./schema";

async function handleGetUrl(path: string) {
  const alias = path.match(/^\/([a-zA-Z0-9_-]{1,16})$/);
  if (alias) {
    const cached = await redis.get(alias[1]);
    if (cached) {
      return { url: cached };
    }
    const url = await db.query.urls.findFirst({
      where: eq(urls.alias, alias[1]),
    });
    if (url) {
      await redis.set(alias[1], url.url);
      return { url: url.url };
    }
  }
  return null;
}

function validateData(data: any) {
  const url = data.url;
  const alias = data.alias || nanoid(8);
  if (
    typeof url !== "string" ||
    url.length === 0 ||
    url.length > 255 ||
    !url.match(/^https?:\/\//)
  ) {
    return null;
  }
  if (
    typeof alias !== "string" ||
    alias.length === 0 ||
    alias.length > 16 ||
    !alias.match(/^[a-zA-Z0-9_-]+$/)
  ) {
    return null;
  }
  return { alias, url };
}

async function handleCreateUrl(alias: string, url: string) {
  const existing = await db.query.urls.findFirst({
    where: eq(urls.alias, alias),
  });
  if (existing) {
    return null;
  }
  await db.insert(urls).values({ alias, url });
  return { alias, url };
}

serve({
  port: 8080,
  async fetch(request) {
    const method = request.method;
    const path = new URL(request.url).pathname;

    if (method === "GET") {
      const url = await handleGetUrl(path);
      if (url) {
        return new Response(null, {
          status: 301,
          headers: { location: url.url },
        });
      } else {
        return new Response(JSON.stringify({ message: "Not Found" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        });
      }
    }

    if (method === "POST") {
      if (path !== "/") {
        return new Response(null, {
          status: 404,
          headers: { "content-type": "application/json" },
        });
      }

      const data = validateData(await request.json());
      if (!data) {
        return new Response(JSON.stringify({ message: "Bad Request" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }

      const url = await handleCreateUrl(data.alias, data.url);
      if (url) {
        return new Response(JSON.stringify(url), {
          status: 201,
          headers: { "content-type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ message: "Conflict" }), {
          status: 409,
          headers: { "content-type": "application/json" },
        });
      }
    }

    return new Response(null, {
      status: 405,
      headers: { allow: "GET, POST" },
    });
  },
  error() {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  },
});
