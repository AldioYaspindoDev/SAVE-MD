import { requireAuth } from "@/lib/auth";
import { snippetService } from "@/lib/services/snippet.service";
import { handleApiError } from "@/lib/utils/errors";
import { success } from "@/lib/utils/response";
import { objectIdSchema } from "@/lib/validations/query";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    objectIdSchema.parse(id);
    return success(await snippetService.togglePin(user.id, id));
  } catch (err) {
    return handleApiError(err);
  }
}