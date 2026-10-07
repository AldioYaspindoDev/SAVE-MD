import { requireAuth } from "@/lib/auth";
import { categoryService } from "@/lib/services/category.service";
import { ApiError, handleApiError } from "@/lib/utils/errors";
import { success } from "@/lib/utils/response";
import { updateCategorySchema } from "@/lib/validations/category";
import { objectIdSchema } from "@/lib/validations/query";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    objectIdSchema.parse(id);
    return success(await categoryService.get(user.id, id));
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
    const data = updateCategorySchema.parse(raw);
    return success(await categoryService.update(user.id, id, data));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    objectIdSchema.parse(id);
    await categoryService.remove(user.id, id);
    return new Response(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
}