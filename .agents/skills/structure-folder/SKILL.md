---
name: nextjs-folder-structure
description: Implement and organize a best-practice folder structure for a Next.js App Router project. Use when the project needs its application routes, route groups, components, libraries, API routes, and Prisma directory organized into a clean and scalable structure.
allowed-tools: Bash(*), Read, Edit, Write
license: MIT
compatibility: Requires Next.js App Router with TypeScript.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.13.1"
---

# Next.js Folder Structure

## Objective

Implement a clean, scalable, and maintainable folder structure for the existing Next.js App Router project.

The structure must separate:

- Authentication pages
- Dashboard pages
- API routes
- Reusable UI components
- Server-side utilities
- Prisma database configuration

This skill is responsible for **project structure only**.

Do not implement application features unless explicitly requested.

---

# 1. Core Principles

The implementation MUST follow these principles:

1. Use Next.js App Router conventions.
2. Use route groups to organize pages without affecting URLs.
3. Keep API routes inside `app/api`.
4. Keep reusable components inside `components`.
5. Keep server-side utilities and shared logic inside `lib`.
6. Keep Prisma schema inside `prisma`.
7. Do not duplicate files or utilities.
8. Do not move files unnecessarily if the existing structure is already valid.
9. Preserve existing functionality while restructuring.
10. Do not modify unrelated application logic.
11. Do not create unnecessary abstraction layers.
12. Follow the existing TypeScript and import conventions.

---

# 2. Target Structure

The target structure is:

```text
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
│
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── categories/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── snippets/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── edit/
│   │           └── page.tsx
│   │
│   └── search/
│       └── page.tsx
│
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts
│   │
│   ├── snippets/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   │
│   └── categories/
│       └── route.ts
│
components/
├── markdown-viewer.tsx
├── markdown-editor.tsx
├── snippet-card.tsx
├── copy-button.tsx
└── download-button.tsx

lib/
├── prisma.ts
├── auth.ts
└── utils.ts

prisma/
└── schema.prisma
```

---

# 3. Route Groups

Use Next.js route groups:

```text
(auth)
(dashboard)
```

Route groups MUST NOT change the public URL.

Therefore:

```text
app/(auth)/login/page.tsx
```

must resolve to:

```text
/login
```

and:

```text
app/(dashboard)/snippets/page.tsx
```

must resolve to:

```text
/snippets
```

Do not expose `(auth)` or `(dashboard)` in URLs.

---

# 4. Authentication Routes

Location:

```text
app/(auth)/
```

Structure:

```text
(auth)/
├── login/
│   └── page.tsx
└── register/
    └── page.tsx
```

Responsibilities:

### `/login`

```text
app/(auth)/login/page.tsx
```

Responsible only for the login page.

### `/register`

```text
app/(auth)/register/page.tsx
```

Responsible only for the registration page.

Do not put authentication business logic directly into these pages.

Authentication logic belongs in:

```text
lib/auth.ts
```

API authentication remains under:

```text
app/api/auth/
```

---

# 5. Dashboard Routes

Location:

```text
app/(dashboard)/
```

The dashboard route group contains authenticated application pages.

Structure:

```text
(dashboard)/
├── layout.tsx
├── page.tsx
├── categories/
├── snippets/
└── search/
```

---

## 5.1 Dashboard Layout

File:

```text
app/(dashboard)/layout.tsx
```

Responsibilities:

- Dashboard layout
- Sidebar
- Topbar
- Shared dashboard navigation
- Shared dashboard UI shell

Do not put database queries or complex business logic directly into the layout.

Authentication checks may be performed here if the application's architecture requires route-level protection.

---

## 5.2 Dashboard Home

File:

```text
app/(dashboard)/page.tsx
```

URL:

```text
/
```

Responsibilities:

- Recent snippets
- Favorite snippets
- Statistics
- Dashboard summary

The page should compose reusable components instead of containing large UI implementations.

---

# 6. Category Routes

Structure:

```text
categories/
├── page.tsx
└── [slug]/
    └── page.tsx
```

### Category List

```text
app/(dashboard)/categories/page.tsx
```

URL:

```text
/categories
```

Responsibilities:

- Display user's categories
- Create category UI
- Category management UI

### Category Detail

```text
app/(dashboard)/categories/[slug]/page.tsx
```

URL:

```text
/categories/:slug
```

Responsibilities:

- Display category information
- Display snippets belonging to the category

Do not duplicate category business logic inside the page.

---

# 7. Snippet Routes

Structure:

```text
snippets/
├── page.tsx
├── new/
│   └── page.tsx
└── [id]/
    ├── page.tsx
    └── edit/
        └── page.tsx
```

---

## 7.1 Snippet List

```text
app/(dashboard)/snippets/page.tsx
```

URL:

```text
/snippets
```

Responsibilities:

- Display snippets
- Search
- Filtering
- Sorting
- Pagination UI

---

## 7.2 Create Snippet

```text
app/(dashboard)/snippets/new/page.tsx
```

URL:

```text
/snippets/new
```

Responsibilities:

- Create snippet form
- Markdown/prompt editor
- Client-side interaction

Business logic must remain outside the page.

---

## 7.3 Snippet Detail

```text
app/(dashboard)/snippets/[id]/page.tsx
```

URL:

```text
/snippets/:id
```

Responsibilities:

- Display snippet details
- Render Markdown
- Favorite
- Pin
- Copy
- Download

Use reusable components where appropriate.

---

## 7.4 Edit Snippet

```text
app/(dashboard)/snippets/[id]/edit/page.tsx
```

URL:

```text
/snippets/:id/edit
```

Responsibilities:

- Edit snippet
- Reuse the snippet editor component

Avoid duplicating the create/edit form.

---

# 8. Search Route

File:

```text
app/(dashboard)/search/page.tsx
```

URL:

```text
/search
```

Responsibilities:

- Search interface
- Search results
- Search filters

Search business logic must remain in backend services/API.

---

# 9. API Routes

API routes MUST remain separate from UI routes.

Location:

```text
app/api/
```

Structure:

```text
api/
├── auth/
├── snippets/
└── categories/
```

API routes use:

```text
route.ts
```

Do not use:

```text
page.tsx
```

inside API directories.

---

# 10. API Route Responsibilities

Route handlers should be thin.

A route handler should generally follow:

```text
Request
   ↓
Parse request
   ↓
Authenticate
   ↓
Validate input
   ↓
Call service
   ↓
Return response
```

Do not place complex business logic directly inside `route.ts`.

For example:

```ts
export async function POST(request: Request) {
  try {
    const user = await requireAuth();

    const body = await request.json();

    const input = snippetSchema.parse(body);

    const snippet = await snippetService.create({
      ...input,
      userId: user.id,
    });

    return successResponse(snippet, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
```

The exact implementation may differ depending on the existing project architecture.

---

# 11. Components

Reusable UI components belong inside:

```text
components/
```

Target:

```text
components/
├── markdown-viewer.tsx
├── markdown-editor.tsx
├── snippet-card.tsx
├── copy-button.tsx
└── download-button.tsx
```

## Component Responsibilities

### `markdown-viewer.tsx`

Responsible for rendering Markdown content.

### `markdown-editor.tsx`

Responsible for editing Markdown/prompt content.

### `snippet-card.tsx`

Reusable snippet preview/card.

### `copy-button.tsx`

Reusable copy-to-clipboard interaction.

### `download-button.tsx`

Reusable download interaction.

---

# 12. Component Rules

Components MUST be reusable where reasonable.

Do not create:

```text
components/dashboard-page-specific-component.tsx
```

unless the component is actually reusable or the project requires feature-specific organization.

Do not place:

- Prisma queries
- Database credentials
- Authentication configuration
- Business logic

inside reusable UI components.

---

# 13. Library Layer

Shared application utilities belong inside:

```text
lib/
```

Target:

```text
lib/
├── prisma.ts
├── auth.ts
└── utils.ts
```

---

## `lib/prisma.ts`

Responsible for:

- Prisma Client singleton
- Database access instance

---

## `lib/auth.ts`

Responsible for:

- Authentication configuration
- Session helpers
- `getCurrentUser()`
- `requireAuth()`

---

## `lib/utils.ts`

Responsible only for genuinely shared utilities.

Do not turn `utils.ts` into a dumping ground.

If utilities become domain-specific or numerous, create a dedicated file:

```text
lib/
├── utils/
│   ├── response.ts
│   ├── slug.ts
│   └── errors.ts
```

Do not create this directory unless the project actually requires it.

---

# 14. Prisma

Prisma schema belongs at:

```text
prisma/schema.prisma
```

Do not place Prisma schema inside:

```text
app/
components/
lib/
```

Prisma Client is exposed through:

```text
lib/prisma.ts
```

Application code should import the shared Prisma instance:

```ts
import { prisma } from "@/lib/prisma";
```

---

# 15. Server vs Client Components

Follow Next.js App Router conventions.

By default:

```text
page.tsx
layout.tsx
```

should remain Server Components.

Only use:

```tsx
"use client";
```

when the component requires client-side capabilities such as:

- `useState`
- `useEffect`
- Browser APIs
- Clipboard API
- Interactive form state
- Client-side event handlers

Prefer keeping pages as Server Components and isolating client-side behavior into smaller components.

Example:

```text
components/
├── snippet-card.tsx
├── copy-button.tsx       ← Client Component if required
└── markdown-editor.tsx   ← Client Component
```

Do not mark an entire page as Client Component unnecessarily.

---

# 16. URL & Folder Rules

Use folder names based on their URL semantics.

Examples:

```text
login
register
categories
snippets
search
```

Dynamic routes:

```text
[id]
[slug]
```

Use:

```text
[id]
```

when the resource is addressed by ID.

Use:

```text
[slug]
```

when the resource is addressed by a human-readable slug.

Do not create folders such as:

```text
pages/
screens/
views/
```

inside the App Router unless explicitly required.

---

# 17. Existing Project Inspection

Before modifying the structure, inspect:

```text
package.json
tsconfig.json
app/
components/
lib/
prisma/
```

Also inspect existing imports and references.

The agent MUST determine:

- Which files already exist.
- Which routes already exist.
- Which components already exist.
- Whether the project uses `src/`.
- Whether path aliases are configured.
- Whether Prisma already exists.
- Whether API routes already exist.

Do not blindly recreate existing files.

---

# 18. Restructuring Rules

If the project already contains code:

1. Do not delete working code.
2. Identify dependencies before moving files.
3. Update imports after moving files.
4. Preserve route behavior.
5. Preserve API behavior.
6. Preserve component behavior.
7. Run TypeScript checks after restructuring.
8. Run the development/build validation after restructuring.

If moving a file would introduce significant risk, stop and ask the developer.

---

# 19. File Naming

Use lowercase kebab-case for files:

```text
markdown-viewer.tsx
markdown-editor.tsx
snippet-card.tsx
copy-button.tsx
download-button.tsx
```

Next.js special files retain their required names:

```text
page.tsx
layout.tsx
route.ts
loading.tsx
error.tsx
not-found.tsx
```

React component names use PascalCase:

```tsx
MarkdownViewer
MarkdownEditor
SnippetCard
CopyButton
DownloadButton
```

---

# 20. Import Convention

Use the configured TypeScript alias:

```ts
import { prisma } from "@/lib/prisma";
```

Prefer:

```ts
@/components/...
@/lib/...
```

over deeply nested relative imports:

```ts
../../../../lib/prisma
```

Do not modify `tsconfig.json` if the alias is already configured.

---

# 21. Validation

After restructuring, run:

```bash
npx tsc --noEmit
```

If available:

```bash
npm run lint
```

And:

```bash
npm run build
```

All existing routes should remain accessible.

Verify:

```text
/
/login
/register
/categories
/snippets
/snippets/new
/search
```

and dynamic routes where applicable.

---

# 22. Acceptance Criteria

The task is complete when:

- [ ] `app/(auth)` exists.
- [ ] Login route exists.
- [ ] Register route exists.
- [ ] `app/(dashboard)` exists.
- [ ] Dashboard layout exists.
- [ ] Category routes exist.
- [ ] Snippet routes exist.
- [ ] Search route exists.
- [ ] API routes remain under `app/api`.
- [ ] Reusable components are under `components`.
- [ ] Shared server utilities are under `lib`.
- [ ] Prisma schema is under `prisma`.
- [ ] Existing functionality is preserved.
- [ ] Imports are updated.
- [ ] No duplicate implementation exists.
- [ ] TypeScript check passes.
- [ ] Build passes where applicable.
- [ ] No unnecessary UI/business logic is introduced into unrelated layers.

---

# 23. Expected Final Structure

```text
project-root/
│
├── app/
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   │
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── snippets/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   │
│   │   └── search/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts
│       ├── snippets/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       └── categories/
│           └── route.ts
│
├── components/
│   ├── markdown-viewer.tsx
│   ├── markdown-editor.tsx
│   ├── snippet-card.tsx
│   ├── copy-button.tsx
│   └── download-button.tsx
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

# 24. Agent Workflow

Before implementation:

1. Inspect the existing project.
2. Compare the current structure with the target structure.
3. Identify files that need to be created.
4. Identify files that need to be moved.
5. Identify imports that will be affected.
6. Do not make unnecessary changes.

During implementation:

1. Create missing directories.
2. Move existing files only when required.
3. Update affected imports.
4. Preserve functionality.
5. Do not implement unrelated features.

After implementation:

```bash
npx tsc --noEmit
```

Then, if available:

```bash
npm run lint
npm run build
```

---

# 25. Final Report

After completing the task, report:

```text
=== FOLDER STRUCTURE IMPLEMENTATION ===

Status: ✅ Done / ⚠️ Partial / ❌ Blocked

Created:
- ...

Moved:
- ...

Modified:
- ...

Deleted:
- None
  OR
- ...

Routes affected:
- ...

Imports updated:
- ...

Validation:
- TypeScript: PASS/FAIL
- Lint: PASS/FAIL
- Build: PASS/FAIL

Issues:
- None
  OR
- ...

Waiting for developer review.
```

Do not continue implementing unrelated features after completing this skill.

# END OF SKILL