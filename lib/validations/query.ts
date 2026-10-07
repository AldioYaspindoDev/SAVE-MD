import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const snippetListQuerySchema = z.object({
  q: z.string().trim().optional(),
  categoryId: objectIdSchema.optional(),
  type: z.enum(["MARKDOWN", "PROMPT"]).optional(),
  tags: z.string().trim().optional(),
  isFavorite: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  isPinned: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  sort: z.enum(["updatedAt", "createdAt", "title", "viewCount", "copyCount"]).default("updatedAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type SnippetListQuery = z.infer<typeof snippetListQuerySchema>;