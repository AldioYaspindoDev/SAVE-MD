---
name: setup-prisma-mongodb
description: Configure Prisma ORM with MongoDB in an existing Next.js project. Use when the user wants to install, initialize, configure, and validate Prisma with MongoDB.
allowed-tools: Bash(openspec:*), Bash(npm:*), Bash(npx:*), Read, Edit, Write
license: MIT
compatibility: Requires Node.js, npm, Next.js, Prisma, and MongoDB.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.13.1"
---

# Setup Prisma with MongoDB in Next.js

## Objective

Configure Prisma ORM with MongoDB in the existing Next.js project.

The implementation must:

- Install Prisma dependencies.
- Initialize Prisma with MongoDB.
- Configure `DATABASE_URL`.
- Configure `prisma/schema.prisma`.
- Create a reusable Prisma Client singleton.
- Generate Prisma Client.
- Validate the Prisma configuration.
- Verify that Prisma can connect to MongoDB.

Do not implement application-specific models or CRUD functionality unless explicitly requested.

---

## Preconditions

Before making changes, inspect the existing project.

Check:

- `package.json`
- Existing package manager
- Existing Prisma configuration
- Existing `prisma/` directory
- Existing `.env`
- Existing `.env.example`
- Existing `src/lib` or `lib` directory
- Existing TypeScript configuration

Do not overwrite an existing Prisma configuration without first determining whether it can be reused.

---

## Implementation

### 1. Install Prisma

Install:

```bash
npm install prisma --save-dev
npm install @prisma/client
```

If the project uses another package manager, use the corresponding command.

Do not install another ORM.

---

### 2. Initialize Prisma

If Prisma has not been initialized, run:

```bash
npx prisma init --datasource-provider mongodb
```

Expected structure:

```text
prisma/
└── schema.prisma
```

If `prisma/schema.prisma` already exists, modify the existing configuration instead of creating a duplicate.

---

### 3. Configure Prisma Schema

Configure `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

Do not add application-specific models at this stage.

---

### 4. Configure Environment Variable

Add the MongoDB connection string to `.env`:

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
```

Rules:

- Never hardcode credentials inside source code.
- Never expose MongoDB credentials in logs.
- Never commit `.env`.
- Reuse an existing `DATABASE_URL` if it is already configured.
- If `.env.example` exists, add:

```env
DATABASE_URL=
```

Do not replace an existing valid database configuration without user approval.

---

### 5. Configure Prisma Client Singleton

Create:

```text
src/lib/prisma.ts
```

If the project does not use a `src` directory, use:

```text
lib/prisma.ts
```

Implementation:

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

The application must reuse this instance.

Do not instantiate `PrismaClient` independently inside every:

- Route Handler
- Server Action
- Server Component
- Service

---

### 6. Generate Prisma Client

Run:

```bash
npx prisma generate
```

The command must complete successfully.

---

### 7. Validate Schema

Run:

```bash
npx prisma validate
```

Resolve any Prisma schema or configuration errors.

Do not ignore validation errors.

---

### 8. Verify Database Connection

Verify that Prisma can connect to the configured MongoDB database.

Use the Prisma command appropriate for the installed Prisma version.

If appropriate:

```bash
npx prisma db pull
```

Do not use destructive commands.

Do not reset the database.

Do not delete existing collections or data.

---

## MongoDB Schema Rules

When application models are added later, MongoDB ObjectId fields must follow Prisma's MongoDB syntax.

Example:

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Do not create this model during this task unless explicitly requested.

---

## Package Scripts

If the project does not already contain equivalent scripts, add:

```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio",
    "prisma:validate": "prisma validate"
  }
}
```

Preserve all existing scripts.

Do not overwrite unrelated `package.json` configuration.

---

## Verification

After implementation, verify:

### Dependencies

`package.json` contains:

```text
prisma
@prisma/client
```

### Prisma Schema

```text
prisma/
└── schema.prisma
```

### Prisma Client

One of:

```text
src/lib/prisma.ts
```

or:

```text
lib/prisma.ts
```

### Environment

`.env` contains:

```env
DATABASE_URL="..."
```

### Commands

The following must succeed:

```bash
npx prisma validate
npx prisma generate
```

---

## Constraints

The agent MUST NOT:

1. Replace MongoDB with another database.
2. Install another ORM.
3. Delete existing dependencies.
4. Delete or reset the database.
5. Run destructive database operations.
6. Create application-specific models without requirements.
7. Hardcode database credentials.
8. Commit `.env`.
9. Create multiple Prisma Client instances unnecessarily.
10. Modify unrelated application code.
11. Change the existing Next.js architecture.
12. Upgrade unrelated dependencies merely to complete this task.

---

## Expected Result

The project should have the following architecture:

```text
Next.js
│
├── app/
│   └── ...
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   └── lib/
│       └── prisma.ts
│
├── .env
│   └── DATABASE_URL
│
└── package.json
```

Prisma must be ready to be consumed by the Next.js server-side application.

The task is considered complete only when:

- Prisma is installed.
- MongoDB datasource is configured.
- `DATABASE_URL` is configured.
- Prisma Client singleton exists.
- Prisma Client generation succeeds.
- Prisma schema validation succeeds.
- MongoDB connectivity has been verified where credentials are available.

Do not implement CRUD, authentication, API endpoints, or application-specific database models as part of this task.