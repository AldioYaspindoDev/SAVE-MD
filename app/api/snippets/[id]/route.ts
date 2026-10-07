import { requireAuth } from "@/lib/auth";
import { snippetService } from "@/lib/services/snippet.service";
import { ApiError, handleApiError } from "@/lib/utils/errors";
import { success } from "@/lib/utils/response";
import { objectIdSchema } from "@/lib/validations/query";
import { updateSnippetSchema } from "@/lib/validations/snippet";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    objectIdSchema.parse(id);
    return success(await snippetService.get(user.id, id));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    objectIdSchema.parse(id);
    const raw = await request.json().catch(() => {
      throw new ApiError("VALIDATION_ERROR", "Invalid request body");
    });
    const data = updateSnippetSchema.parse(raw);
    return success(await snippetService.update(user.id, id, data));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    objectIdSchema.parse(id);
    await snippetService.remove(user.id, id);
    return new Response(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
}