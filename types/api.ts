export type ApiErrorBody = {
    success?: boolean,
    error?: {
        code?: string,
        message?: string,
        details?: unknown[]
    }
}
