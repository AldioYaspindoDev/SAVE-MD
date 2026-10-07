import { NextResponse } from "next/server";

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

const errorStatuses: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function list<T>(data: T[], meta: { page: number; limit: number; total: number }) {
  return NextResponse.json({ success: true, data, meta }, { status: 200 });
}

export function error(code: ErrorCode, message: string, details?: unknown[]) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
    },
    { status: errorStatuses[code] }
  );
}