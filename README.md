# URL Shortener

A fast, tiny URL shortener API.

## Development

1. Install Bun dependencies:

```bash
bun install
```

2. Start the MySQL database and Redis server:

```bash
docker compose up
```

3. Run the database migrations:

```bash
bunx tsx src/migrate.ts
```

4. Start the Bun server:

```bash
bun run src/server.ts
```

## Usage

### Shorten a URL

```bash
curl -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com"}' http://localhost:8080
```

```json
{
  "url": "https://example.com",
  "alias": "<url-alias>"
}
```

### Redirect to a URL

```bash
curl -I http://localhost:8080/<url-alias>
```

```http
HTTP/1.1 301 Moved Permanently
Location: https://example.com
```
