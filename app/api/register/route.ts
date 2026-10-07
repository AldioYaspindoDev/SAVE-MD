import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { success } from "@/lib/utils/response";
import { ApiError, handleApiError } from "@/lib/utils/errors";

export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => {
      throw new ApiError("VALIDATION_ERROR", "Invalid request body");
    });
    const data = registerSchema.parse(raw);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ApiError("CONFLICT", "Email is already registered");

    const password = await hash(data.password, 10);
    const user = await prisma.user.create({
      data: { email: data.email, name: data.name, password },
      select: { id: true, email: true, name: true },
    });

    return success(user, 201);
  } catch (err) {
    return handleApiError(err);
  }
}