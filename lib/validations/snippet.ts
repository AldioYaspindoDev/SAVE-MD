import { z } from "zod";

import { objectIdSchema } from "@/lib/validations/query";

const tagSchema = z.string().trim().toLowerCase().min(1).max(30);

export const createSnippetSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500).optional(),
  content: z.string().min(1),
  type: z.enum(["MARKDOWN", "PROMPT"]).default("MARKDOWN"),
  categoryId: objectIdSchema.nullable().optional(),
  tags: z.array(tagSchema).max(20).default([]),
  language: z.string().trim().max(30).optional(),
});

export const updateSnippetSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(500).optional(),
  content: z.string().min(1).optional(),
  type: z.enum(["MARKDOWN", "PROMPT"]).optional(),
  categoryId: objectIdSchema.nullable().optional(),
  tags: z.array(tagSchema).max(20).optional(),
  language: z.string().trim().max(30).optional(),
});

export type CreateSnippetInput = z.infer<typeof createSnippetSchema>;
export type UpdateSnippetInput = z.infer<typeof updateSnippetSchema>;