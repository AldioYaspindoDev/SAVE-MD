import { requireAuth } from "@/lib/auth";
import { snippetService } from "@/lib/services/snippet.service";
import { handleApiError } from "@/lib/utils/errors";
import { objectIdSchema } from "@/lib/validations/query";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    objectIdSchema.parse(id);
    const { content, filename } = await snippetService.download(user.id, id);
    return new Response(content, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="${filename}.md"`,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}