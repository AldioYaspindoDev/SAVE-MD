# PRD.md — Markdown & Prompt Vault

> **Version:** 1.1  
> **Status:** Active Development  
> **Methodology:** Spec-Driven Development (SDD)  
> **Architecture:** Next.js App Router — Backend/API Only  
> **Database:** MongoDB  
> **ORM:** Prisma  
> **UI:** Handled separately by developer

---

# 0. AGENT CONTRACT

> **READ THIS SECTION BEFORE DOING ANYTHING.**

This document is the **Single Source of Truth (SSOT)** for the project.

The agent MUST follow this PRD when implementing the system.

## 0.1 Absolute Rules

1. **Backend only.**
   - Do not create UI components.
   - Do not create frontend pages.
   - Do not create styling.
   - Do not implement client-side fetching.
   - Do not modify UI code unless explicitly requested.

2. **Follow development phases sequentially.**
   - Phase 1 → Phase 2 → Phase 3 → ...
   - Never skip a phase.
   - Never start the next phase before the current phase is approved.

3. **Stop after every phase.**
   
   The agent MUST report:
   - Files created/modified
   - Implementation summary
   - Test commands
   - Test results
   - Status
   - Blockers
   - Next phase

   Then STOP and wait for developer approval.

4. **PRD takes precedence over implementation assumptions.**

5. **Do not invent requirements.**

6. If a requirement is genuinely ambiguous and affects architecture, security, data integrity, or API behavior:
   - Ask the developer.
   - Do not continue with an assumption.

7. If the ambiguity does not affect architecture or behavior:
   - Follow the defaults defined in this PRD.

8. **Do not install dependencies outside the defined stack without approval.**

9. **Never hardcode secrets.**

10. **Never expose internal errors, stack traces, database queries, or credentials to clients.**

11. **Every protected API endpoint MUST perform authentication.**

12. **Every resource mutation MUST enforce ownership.**

13. **Every external input MUST be validated with Zod.**

14. **Every API endpoint MUST use the standardized response format.**

15. **Do not perform destructive database operations.**

16. **Do not modify unrelated code.**

---

# 1. PROJECT OVERVIEW

## 1.1 Product

**Markdown & Prompt Vault** is a personal application for storing, organizing, searching, and managing Markdown files and AI prompts.

Users can:

- Create categories
- Store Markdown snippets
- Store AI prompts
- Edit snippets
- Search snippets
- Filter snippets
- Tag snippets
- Favorite snippets
- Pin snippets
- Copy snippets
- Download snippets
- View usage statistics

---

# 2. SCOPE

## 2.1 Backend Scope

The backend includes:

- Authentication
- User registration
- Session management
- Category CRUD
- Snippet CRUD
- Search
- Filtering
- Pagination
- Tagging
- Favorite
- Pin
- View counter
- Copy counter
- Statistics
- Markdown download
- Validation
- Authorization
- Error handling

## 2.2 Out of Scope

The agent MUST NOT implement:

- UI/UX
- React components
- Frontend pages
- Styling
- Client-side state management
- Client-side fetching
- Visual design

These are handled separately by the developer.

---

# 3. TECHNOLOGY STACK

| Layer | Technology | Minimum Version |
|---|---|---|
| Runtime | Node.js | 20.x |
| Language | TypeScript | 5.x |
| Framework | Next.js App Router | 14.x |
| Database | MongoDB | 6.x |
| ORM | Prisma | 5.x |
| Authentication | NextAuth.js / Auth.js | 5.x |
| Validation | Zod | 3.x |
| Password Hashing | bcryptjs | 2.x |
| Environment | dotenv | — |

## 3.1 Database

MongoDB may run through:

- MongoDB Atlas
- Local MongoDB

## 3.2 Database Rules

Prisma MUST use:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

MongoDB ObjectId MUST use:

```prisma
id String @id @default(auto()) @map("_id") @db.ObjectId
```

MongoDB does not use SQL migration workflows.

For schema synchronization, use:

```bash
npx prisma db push
```

Do NOT use destructive database operations.

---

# 4. PROJECT ARCHITECTURE

The backend follows this architecture:

```text
HTTP Request
     │
     ▼
Route Handler
     │
     ├── Authentication
     ├── Input Parsing
     ├── Zod Validation
     │
     ▼
Service Layer
     │
     ├── Business Logic
     ├── Ownership Check
     └── Prisma Query
     │
     ▼
MongoDB
```

## 4.1 Responsibility

### Route Handler

Responsible for:

- Receiving HTTP request
- Parsing parameters/body
- Authentication
- Validation
- Calling service
- Returning standardized response

Route handlers MUST NOT contain complex business logic.

### Service

Responsible for:

- Business logic
- Database operations
- Ownership verification
- Data transformation
- Domain rules

### Validation

Responsible for:

- Request body validation
- Query parameter validation
- Parameter validation

### Prisma

Responsible for:

- Database access
- Data persistence
- Relations
- Query construction

---

# 5. DATABASE SCHEMA

File:

```text
prisma/schema.prisma
```

Use the following schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  categories Category[]
  snippets   Snippet[]

  @@map("users")
}

model Category {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  slug        String
  description String?
  color       String?  @default("#3b82f6")
  icon        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId   String   @db.ObjectId
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  snippets Snippet[]

  @@unique([userId, slug])
  @@index([userId])
  @@map("categories")
}

enum SnippetType {
  MARKDOWN
  PROMPT
}

model Snippet {
  id          String      @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  content     String
  type        SnippetType @default(MARKDOWN)
  tags        String[]    @default([])
  language    String?
  isFavorite  Boolean     @default(false)
  isPinned    Boolean     @default(false)
  viewCount   Int         @default(0)
  copyCount   Int         @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  userId     String    @db.ObjectId
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId String?   @db.ObjectId
  category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([userId, categoryId])
  @@index([userId, type])
  @@map("snippets")
}
```

---

# 6. DATA RULES

## User

- `email` MUST be unique.
- `password` MUST contain a hashed password.
- Plain-text passwords MUST NEVER be stored.

## Category

- `slug` is generated from `name`.
- Slug is lowercase.
- Slug uses dash-separated words.
- Slug MUST be unique per user.
- Category deletion MUST NOT delete snippets.
- Related snippets MUST have `categoryId = null`.

## Snippet

- `content` stores raw Markdown or prompt text.
- Rendering is handled by the client.
- `tags` MUST be lowercase.
- Maximum 20 tags per snippet.
- `userId` MUST ALWAYS come from the authenticated session.
- `userId` MUST NEVER be accepted from request body.

---

# 7. PRISMA CLIENT

File:

```text
lib/prisma.ts
```

Use a singleton Prisma Client.

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

All backend services MUST reuse this instance.

Do not instantiate `PrismaClient` repeatedly inside route handlers or services.

---

# 8. ENVIRONMENT VARIABLES

Required variables:

```env
DATABASE_URL="mongodb+srv://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

Create:

```text
.env.example
```

Example:

```env
DATABASE_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
```

Rules:

- `.env` MUST NOT be committed.
- Credentials MUST NOT appear in source code.
- Credentials MUST NOT appear in logs.
- `.env.example` MUST NOT contain real credentials.

---

# 9. API CONTRACT

## 9.1 Base Path

All API endpoints use:

```text
/api/*
```

---

## 9.2 Success Response

```json
{
  "success": true,
  "data": {}
}
```

For list endpoints:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

---

## 9.3 Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": []
  }
}
```

`details` is optional.

---

# 10. HTTP STATUS CODES

| Status | Meaning |
|---|---|
| 200 | Successful GET/PATCH |
| 201 | Successful POST/create |
| 204 | Successful DELETE |
| 400 | Validation error |
| 401 | Unauthenticated |
| 403 | Unauthorized ownership/access |
| 404 | Resource not found |
| 409 | Conflict |
| 500 | Internal server error |

---

# 11. ERROR CODES

Allowed error codes:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
INTERNAL_ERROR
```

Do not introduce additional error codes unless the PRD is updated.

---

# 12. AUTHENTICATION

Authentication uses:

- NextAuth.js / Auth.js
- Credentials provider
- JWT strategy

Protected routes MUST call:

```text
getCurrentUser()
```

If no authenticated user exists:

```text
401 UNAUTHORIZED
```

Authentication exceptions:

```text
/api/register
/api/auth/*
```

---

# 13. OWNERSHIP

Every user-owned resource MUST be scoped by the authenticated user's ID.

Correct:

```text
session.user.id
```

Incorrect:

```text
request.body.userId
```

For update/delete/read operations, verify ownership before performing the operation.

The client MUST NOT be trusted to provide ownership information.

---

# 14. PAGINATION

Query:

```text
?page=1&limit=20
```

Rules:

```text
page  >= 1
limit >= 1
limit <= 100
```

Defaults:

```text
page = 1
limit = 20
```

---

# 15. SEARCH

Query:

```text
?q=keyword
```

Search fields:

- title
- description
- content
- tags

Search MUST be case-insensitive.

---

# 16. FILTERING

Supported parameters:

```text
categoryId
type
tags
isFavorite
isPinned
```

Example:

```text
?categoryId=xxx&type=PROMPT
```

Tags:

```text
?tags=nextjs,auth
```

Tag filtering uses **AND logic**.

---

# 17. SORTING

Supported:

```text
updatedAt
createdAt
title
viewCount
copyCount
```

Order:

```text
asc
desc
```

Default:

```text
desc
```

---

# 18. API ENDPOINTS

## Authentication

| Method | Endpoint |
|---|---|
| POST | `/api/register` |
| POST | `/api/auth/[...nextauth]` |
| GET | `/api/auth/session` |

## Categories

| Method | Endpoint |
|---|---|
| GET | `/api/categories` |
| POST | `/api/categories` |
| GET | `/api/categories/[id]` |
| PATCH | `/api/categories/[id]` |
| DELETE | `/api/categories/[id]` |

## Snippets

| Method | Endpoint |
|---|---|
| GET | `/api/snippets` |
| POST | `/api/snippets` |
| GET | `/api/snippets/[id]` |
| PATCH | `/api/snippets/[id]` |
| DELETE | `/api/snippets/[id]` |
| POST | `/api/snippets/[id]/view` |
| POST | `/api/snippets/[id]/copy` |
| POST | `/api/snippets/[id]/favorite` |
| POST | `/api/snippets/[id]/pin` |
| GET | `/api/snippets/[id]/download` |

## Statistics

| Method | Endpoint |
|---|---|
| GET | `/api/stats` |

Statistics are implemented in Phase 6.

---

# 19. VALIDATION

Validation files:

```text
lib/validations/
```

## Register

```text
email      → valid email
name       → optional, minimum 2 characters
password   → minimum 8 characters
```

## Category

```text
name        → 1–50 characters
description → optional, maximum 200 characters
color       → optional hexadecimal color
icon        → optional, maximum 10 characters
```

## Snippet

```text
title       → 1–200 characters
description → optional, maximum 500 characters
content     → minimum 1 character
type        → MARKDOWN | PROMPT
categoryId  → optional ObjectId
tags        → maximum 20 items
tag         → maximum 30 characters
language    → optional, maximum 30 characters
```

## Pagination

```text
page  → number, minimum 1
limit → number, minimum 1, maximum 100
```

---

# 20. DEVELOPMENT PHASES

> **IMPORTANT:** Each phase is an independent implementation checkpoint.

---

## PHASE 1 — Project & Database Foundation

### Objective

Prepare the Next.js backend and MongoDB/Prisma foundation.

### Tasks

1. Initialize or inspect Next.js App Router.
2. Install:
   - `prisma`
   - `@prisma/client`
   - `zod`
   - `bcryptjs`
   - `next-auth`
   - `@auth/prisma-adapter`
3. Configure Prisma.
4. Create `prisma/schema.prisma`.
5. Create `lib/prisma.ts`.
6. Create `.env.example`.
7. Create `lib/utils/response.ts`.
8. Run:

```bash
npx prisma generate
npx prisma db push
```

### Acceptance Criteria

- Prisma Client generates successfully.
- MongoDB connection works.
- Database schema is synchronized.
- No TypeScript errors.
- Response helpers exist.
- No UI code is created.

### Test

```bash
npx prisma validate
npx prisma generate
npx prisma db push
```

### Phase Gate

STOP.

Report:

```text
=== PHASE 1 REPORT ===

Status: ✅ Done / ⚠️ Partial / ❌ Blocked

Files created:
-

Files modified:
-

Tests:
-

Result:
-

Blockers:
-

Next phase:
Phase 2 — Auth
```

Wait for developer approval.

---

# 21. PHASE 2 — AUTHENTICATION

### Objective

Implement registration, login, and session management.

### Tasks

- `POST /api/register`
- NextAuth configuration
- Credentials provider
- JWT strategy
- `getCurrentUser()`
- `requireAuth()`
- Session type extension

### Acceptance Criteria

- Registration returns `201`.
- Password is hashed.
- Duplicate email returns `409`.
- Login produces valid session.
- Protected endpoint returns `401` without authentication.

### Test

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.com","password":"password123","name":"Test"}'
```

STOP and request approval.

---

# 22. PHASE 3 — CATEGORY CRUD

### Tasks

Create:

```text
lib/services/category.service.ts
lib/validations/category.ts
```

Implement:

```text
GET    /api/categories
POST   /api/categories
GET    /api/categories/[id]
PATCH  /api/categories/[id]
DELETE /api/categories/[id]
```

### Rules

- Generate slug automatically.
- Enforce `(userId, slug)` uniqueness.
- Enforce ownership.
- Deleting category sets snippet `categoryId` to null.

### Acceptance Criteria

- CRUD works.
- Duplicate slug returns `409`.
- Other users cannot access the resource.
- Delete does not delete snippets.

STOP and request approval.

---

# 23. PHASE 4 — SNIPPET CRUD

### Tasks

Create:

```text
lib/services/snippet.service.ts
lib/validations/snippet.ts
```

Implement:

```text
POST   /api/snippets
GET    /api/snippets/[id]
PATCH  /api/snippets/[id]
DELETE /api/snippets/[id]
```

### Rules

- `userId` comes from session.
- `categoryId` must belong to the same user.
- All mutations enforce ownership.
- PATCH supports partial updates.

### Acceptance Criteria

- Create works with category.
- Create works without category.
- Update works.
- Delete works.
- Cross-user access is rejected.

STOP and request approval.

---

# 24. PHASE 5 — SEARCH, FILTER & PAGINATION

Implement:

```text
GET /api/snippets
```

Support:

- Search
- Category filter
- Type filter
- Tag filter
- Favorite filter
- Pin filter
- Sorting
- Ordering
- Pagination

For list responses:

- Do not return complete `content`.
- Return an `excerpt`.
- Maximum excerpt length: 200 characters.

Return:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

STOP and request approval.

---

# 25. PHASE 6 — SNIPPET ACTIONS & STATISTICS

Implement:

```text
POST /api/snippets/[id]/view
POST /api/snippets/[id]/copy
POST /api/snippets/[id]/favorite
POST /api/snippets/[id]/pin
GET  /api/snippets/[id]/download
GET  /api/stats
```

## Download

Response MUST:

```text
Content-Type: text/markdown
Content-Disposition: attachment; filename="<slug>.md"
```

Return raw Markdown content.

## Statistics

Return:

- Total snippets
- Total categories
- Total favorites
- Total prompts
- Total Markdown snippets

STOP and request approval.

---

# 26. PHASE 7 — POLISH & DOCUMENTATION

### Tasks

- Standardized error handling
- Optional simple rate limiting
- Minimal server logging
- README
- Complete `.env.example`
- Endpoint documentation
- Curl examples
- TypeScript validation
- Production build validation

### Required checks

```bash
npx tsc --noEmit
npm run build
```

### Acceptance Criteria

- Build succeeds.
- TypeScript has zero errors.
- API responses are consistent.
- README is complete.
- Environment variables are documented.

STOP and report final status.

---

# 27. TARGET DIRECTORY STRUCTURE

```text
prisma/
└── schema.prisma

app/
└── api/
    ├── register/
    │   └── route.ts
    │
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts
    │
    ├── categories/
    │   ├── route.ts
    │   └── [id]/
    │       └── route.ts
    │
    ├── snippets/
    │   ├── route.ts
    │   └── [id]/
    │       ├── route.ts
    │       ├── view/
    │       │   └── route.ts
    │       ├── copy/
    │       │   └── route.ts
    │       ├── favorite/
    │       │   └── route.ts
    │       ├── pin/
    │       │   └── route.ts
    │       └── download/
    │           └── route.ts
    │
    └── stats/
        └── route.ts

lib/
├── prisma.ts
├── auth.ts
├── services/
│   ├── category.service.ts
│   └── snippet.service.ts
├── validations/
│   ├── auth.ts
│   ├── category.ts
│   ├── snippet.ts
│   └── query.ts
└── utils/
    ├── response.ts
    ├── slug.ts
    └── errors.ts

types/
└── next-auth.d.ts

.env.example
README.md
```

---

# 28. CODE QUALITY RULES

1. TypeScript strict mode.
2. Avoid `any`.
3. Use async/await.
4. Use service layer.
5. Keep route handlers thin.
6. Validate external input using Zod.
7. Check authentication before protected operations.
8. Check ownership before resource mutation.
9. Use Prisma `select` to prevent unnecessary data retrieval.
10. Do not expose internal errors.
11. Use `@/` import aliases.
12. Keep comments minimal.
13. Avoid duplicated business logic.
14. Keep utilities reusable.
15. Do not modify unrelated files.

---

# 29. SECURITY RULES

The agent MUST enforce:

### Authentication

Every protected endpoint requires a valid session.

### Authorization

A valid session does not automatically grant access to another user's resources.

Always scope queries by:

```text
userId = session.user.id
```

### Password

Passwords MUST:

- Be hashed using bcryptjs.
- Never be returned through API responses.
- Never be logged.

### Secrets

Secrets MUST only exist in:

```text
.env
```

### Input

Never trust:

- Request body
- Query parameters
- URL parameters
- Client-provided user IDs

All must be validated.

---

# 30. GLOBAL DEFINITION OF DONE

The project is considered complete only when:

- [ ] All required phases are completed.
- [ ] Prisma is connected to MongoDB.
- [ ] Prisma schema is valid.
- [ ] Authentication works.
- [ ] Authorization works.
- [ ] Ownership checks work.
- [ ] Category CRUD works.
- [ ] Snippet CRUD works.
- [ ] Search works.
- [ ] Filtering works.
- [ ] Pagination works.
- [ ] Favorite works.
- [ ] Pin works.
- [ ] View counter works.
- [ ] Copy counter works.
- [ ] Download works.
- [ ] Statistics work.
- [ ] API response format is consistent.
- [ ] Zod validation exists.
- [ ] No UI has been implemented.
- [ ] TypeScript has zero errors.
- [ ] Production build succeeds.
- [ ] README exists.
- [ ] `.env.example` exists.

---

# 31. PHASE REPORT FORMAT

At the end of every phase, use exactly this structure:

```text
=== PHASE X REPORT ===

Status: ✅ Done / ⚠️ Partial / ❌ Blocked

Objective:
<short summary>

Files created:
- ...

Files modified:
- ...

Implementation:
- ...

Tests executed:
- ...

Test results:
- ...

Known issues:
- ...

Blockers:
- None
  OR
- ...

Next phase:
<phase name>

Waiting for developer approval.
```

The agent MUST NOT automatically continue to the next phase.

---

# 32. CHANGE MANAGEMENT

If the developer requests a change that conflicts with this PRD:

1. Identify the conflict.
2. Explain which requirement conflicts.
3. Do not silently override the PRD.
4. Ask whether the PRD should be updated.
5. Only implement the change after confirmation.

If a requirement changes:

```text
Update PRD
    ↓
Confirm specification
    ↓
Implement
    ↓
Test
```

Do not implement first and update the PRD afterward.

---

# 33. AGENT SESSION PROTOCOL

At the beginning of a new session:

1. Read `PRD.md`.
2. Identify the current development phase.
3. Inspect the existing implementation.
4. Compare implementation against PRD.
5. Report readiness.

Initial response:

```text
PRD loaded.

Current phase:
<phase>

Existing implementation:
<summary>

Ready to continue with:
<phase>

Waiting for developer instruction.
```

Do not start implementation merely because the PRD has been loaded.

---

# 34. FINAL AGENT REMINDER

> **PRD > assumptions.**  
> **Specification > speed.**  
> **Security > convenience.**  
> **Consistency > creativity.**
>
> Backend only.
>
> Follow phases sequentially.
>
> Validate all input.
>
> Authenticate protected routes.
>
> Enforce ownership.
>
> Never expose secrets.
>
> Never perform destructive database operations.
>
> Stop after every phase and wait for approval.

---

# END OF PRD