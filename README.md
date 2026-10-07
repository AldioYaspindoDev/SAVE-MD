# Markdown & Prompt Vault — Backend API

Personal vault for storing, organizing, searching, and managing Markdown files and AI prompts. Backend/API only; UI is handled separately.

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20.x |
| Language | TypeScript 5.x (strict) |
| Framework | Next.js 16 (App Router) |
| Database | MongoDB 6.x (Atlas) |
| ORM | Prisma 6.x |
| Auth | NextAuth.js 5 beta (Credentials + JWT), bcryptjs |
| Validation | Zod 4 |

> **Prisma must stay on 6.x** — Prisma 7 dropped MongoDB support.

## Getting Started

```bash
npm install
```

Copy `.env.example` to `.env` and fill in the values (see below).

```bash
npx prisma db push        # sync schema to MongoDB (no migrations for Mongo)
npm run dev               # http://localhost:3000
```

Useful scripts:

```bash
npm run prisma:generate   # regenerate the Prisma client
npm run prisma:validate   # validate schema
npm run prisma:studio     # browse the database
npm run lint              # ESLint
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | MongoDB connection string (`mongodb+srv://user:pass@cluster/waydeveloper`) |
| `NEXTAUTH_SECRET` | yes | Random secret for session/JWT signing. Generate with `openssl rand -hex 32` |
| `NEXTAUTH_URL` | yes | Public base URL, e.g. `http://localhost:3000` |

Never commit `.env`.

## Authentication

All endpoints except `POST /api/register`, `POST /api/auth/[...nextauth]`, and `GET /api/auth/session` require a session. Requests without a valid session return `401 UNAUTHORIZED`.

Every user-owned resource is scoped by the authenticated session user — ownership is never taken from the request body.

### Register

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.com","password":"password123","name":"Test"}'
```

Returns `201` (or `409` if the email is taken). Passwords are hashed with bcryptjs.

### Login

NextAuth v5 Credentials provider (JWT strategy). A full curl login requires the CSRF double-post flow:

```bash
# 1. get csrf token
curl -c cookies.txt http://localhost:3000/api/auth/csrf
# 2. submit credentials (uses the csrfToken from step 1)
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "csrfToken=<token>" \
  --data-urlencode "email=a@b.com" \
  --data-urlencode "password=password123"
# 3. use cookies.txt for authenticated requests
curl -b cookies.txt http://localhost:3000/api/categories
```

## API Reference

### Categories

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | List categories |
| `POST` | `/api/categories` | Create category (slug auto-generated) |
| `GET` | `/api/categories/[id]` | Get category |
| `PATCH` | `/api/categories/[id]` | Update category (slug regenerated on rename) |
| `DELETE` | `/api/categories/[id]` | Delete category (snippets kept, `categoryId` set to null) |

Body (POST/PATCH): `name` (1–50, required), `description` (≤200), `color` (hex), `icon` (≤10).

Duplicate `(userId, slug)` returns `409`. Deleting a category never deletes snippets.

### Snippets

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/snippets` | List/search/filter/sort/paginate snippets |
| `POST` | `/api/snippets` | Create snippet |
| `GET` | `/api/snippets/[id]` | Get full snippet |
| `PATCH` | `/api/snippets/[id]` | Partial update |
| `DELETE` | `/api/snippets/[id]` | Delete snippet (`204`) |
| `POST` | `/api/snippets/[id]/view` | Increment `viewCount` |
| `POST` | `/api/snippets/[id]/copy` | Increment `copyCount` |
| `POST` | `/api/snippets/[id]/favorite` | Toggle `isFavorite` |
| `POST` | `/api/snippets/[id]/pin` | Toggle `isPinned` |
| `GET` | `/api/snippets/[id]/download` | Download raw Markdown (`text/markdown`, `filename="<slug>.md"`) |

Body (POST/PATCH): `title` (1–200, required), `description` (≤500), `content` (≥1, required), `type` (`MARKDOWN`\|`PROMPT`, default `MARKDOWN`), `categoryId` (ObjectId, must belong to the same user), `tags` (≤20, each ≤30, lowercased), `language` (≤30).

### Snippet list (`GET /api/snippets`)

| Param | Values | Default |
|---|---|---|
| `q` | free text; searches **title, description, content, tags** (case-insensitive) | — |
| `categoryId` | ObjectId | — |
| `type` | `MARKDOWN` \| `PROMPT` | — |
| `tags` | comma-separated, **AND logic**, e.g. `?tags=nextjs,auth` | — |
| `isFavorite` | `true` \| `false` | — |
| `isPinned` | `true` \| `false` | — |
| `sort` | `updatedAt` \| `createdAt` \| `title` \| `viewCount` \| `copyCount` | `updatedAt` |
| `order` | `asc` \| `desc` | `desc` |
| `page` | ≥1 | `1` |
| `limit` | 1–100 | `20` |

List responses never include full `content`; they return an `excerpt` (max 200 characters).

```bash
curl -b cookies.txt "http://localhost:3000/api/snippets?q=hello&type=PROMPT&tags=ai&sort=viewCount&order=desc&page=1&limit=20"
```

### Statistics

| Method | Endpoint |
|---|---|
| `GET` | `/api/stats` |

Returns (scoped to the session user): `totalSnippets`, `totalCategories`, `totalFavorites`, `totalPrompts`, `totalMarkdown`.

## Response Format

Success (single):

```json
{ "success": true, "data": {} }
```

Success (list):

```json
{ "success": true, "data": [], "meta": { "page": 1, "limit": 20, "total": 0 } }
```

Error:

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Title is required", "details": [] } }
```

| HTTP | Code |
|---|---|
| 200 | OK (GET/PATCH) |
| 201 | Created |
| 204 | No content (DELETE) |
| 400 | `VALIDATION_ERROR` |
| 401 | `UNAUTHORIZED` |
| 403 | `FORBIDDEN` |
| 404 | `NOT_FOUND` |
| 409 | `CONFLICT` |
| 500 | `INTERNAL_ERROR` |

Internal errors are logged server-side and returned to clients as a generic `INTERNAL_ERROR` (no stack traces or DB details leak).

## Project Structure

```text
app/api/            route handlers (auth, validation, thin)
lib/auth.ts         NextAuth config + getCurrentUser() / requireAuth()
lib/services/       business logic, ownership, Prisma queries
lib/validations/    Zod schemas for every external input
lib/utils/          response helpers, errors, slugify
prisma/schema.prisma
types/next-auth.d.ts
```

## Notes

- `next-auth` is pinned to `^5.0.0-beta.32` (no stable 5.x release yet); session/`User.id` typing is augmented in `types/next-auth.d.ts`.
- Slug is Latin-only; a name that produces an empty slug returns `400`.
- Tag search in `q` matches the exact (lowercased) tag, not a substring; title/description/content use substring matching.
- Deleting a category nulls related snippets' `categoryId` inside a transaction.
- Rate limiting is deferred: the PRD's allowed HTTP/error codes do not include `429`, so adding it would require a PRD update. See `lib/utils/errors.ts` and `app/api/register/route.ts` if you want to introduce it.