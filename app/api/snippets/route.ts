import { requireAuth } from "@/lib/auth";
import { snippetService } from "@/lib/services/snippet.service";
import { ApiError, handleApiError } from "@/lib/utils/errors";
import { list, success } from "@/lib/utils/response";
import { snippetListQuerySchema } from "@/lib/validations/query";
import { createSnippetSchema } from "@/lib/validations/snippet";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const url = new URL(request.url);
    const query = snippetListQuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
    const { items, total } = await snippetService.list(user.id, query);
    return list(items, { page: query.page, limit: query.limit, total });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const raw = await request.json().catch(() => {
      throw new ApiError("VALIDATION_ERROR", "Invalid request body");
    });
    const data = createSnippetSchema.parse(raw);
    const snippet = await snippetService.create(user.id, data);
    return success(snippet, 201);
  } catch (err) {
    return handleApiError(err);
  }
}