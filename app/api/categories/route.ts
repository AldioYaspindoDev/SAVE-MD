import { requireAuth } from "@/lib/auth";
import { categoryService } from "@/lib/services/category.service";
import { ApiError, handleApiError } from "@/lib/utils/errors";
import { list, success } from "@/lib/utils/response";
import { createCategorySchema } from "@/lib/validations/category";

export async function GET() {
  try {
    const user = await requireAuth();
    const categories = await categoryService.list(user.id);
    return list(categories, {
      page: 1,
      limit: categories.length,
      total: categories.length,
    });
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
    const data = createCategorySchema.parse(raw);
    const category = await categoryService.create(user.id, data);
    return success(category, 201);
  } catch (err) {
    return handleApiError(err);
  }
}