import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { error, type ErrorCode } from "@/lib/utils/response";

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return error(err.code, err.message, err.details);
  }
  if (err instanceof ZodError) {
    return error("VALIDATION_ERROR", "Invalid input", err.issues);
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return error("CONFLICT", "Resource already exists");
  }
  console.error(err);
  return error("INTERNAL_ERROR", "Internal server error");
}