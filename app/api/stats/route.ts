import { connection } from "next/server";
import { requireAuth } from "@/lib/auth";
import { snippetService } from "@/lib/services/snippet.service";
import { handleApiError } from "@/lib/utils/errors";
import { success } from "@/lib/utils/response";

export async function GET() {
  await connection();

  try {
    const user = await requireAuth();
    return success(await snippetService.stats(user.id));
  } catch (err) {
    return handleApiError(err);
  }
}