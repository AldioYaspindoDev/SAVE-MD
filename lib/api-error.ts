import { AxiosError } from "axios";
import { ApiErrorBody } from "@/types/api";

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function normalizeAxiosError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const body = (err.response?.data ?? {}) as ApiErrorBody
    return new ApiError(
      body.error?.message ?? err.message ?? 'Terjadi kesalahan',
      err.response?.status ?? 0,
      body.error?.code
    )
  }
  if (err instanceof ApiError) return err
  return new ApiError('Terjadi kesalahan tak terduga', 0)
}
