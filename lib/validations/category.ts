import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(50),
  description: z.string().trim().max(200).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex value like #3b82f6")
    .optional(),
  icon: z.string().trim().max(10).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;