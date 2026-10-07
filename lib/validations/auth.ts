import { z } from "zod";

export const registerSchema = z.object({
  email: z.email().trim().toLowerCase(),
  name: z.string().trim().min(2).max(100).optional(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;