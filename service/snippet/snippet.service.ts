import { api } from "@/lib/axios";
import type { SnippetResponse } from "@/types/snippet";

export interface GetSnippetsParams {
    categoryId?: string;
    q?: string;
}

export async function GetSnippets(params: GetSnippetsParams = {}): Promise<SnippetResponse[]> {
    const { data } = await api.get("/api/snippets", { params });
    return data.data ?? [];
}