import { api } from "@/lib/axios";
import { CreateSnippetInput, UpdateSnippetInput } from "@/lib/validations/snippet";
import type { SnippetDetail, SnippetResponse, SnippetType } from "@/types/snippet";

export interface GetSnippetsParams {
    categoryId?: string;
    q?: string;
    type?: SnippetType;
    limit?: number;
}

export async function GetSnippets(params: GetSnippetsParams = {}): Promise<SnippetResponse[]> {
    const { data } = await api.get("/api/snippets", { params });
    return data.data ?? [];
}

export async function CreateSnippets(payload: CreateSnippetInput) {
    const { data } = await api.post("/api/snippets", payload);
    return data;
}

export async function GetSnippet(id: string): Promise<SnippetDetail> {
    const { data } = await api.get(`/api/snippets/${id}`);
    return data.data;
}

export async function UpdateSnippets(id: string, payload: UpdateSnippetInput) {
    const { data } = await api.patch(`/api/snippets/${id}`, payload);
    return data;
}

export async function DeleteSnippet(id: string) {
    const { data } = await api.delete(`/api/snippets/${id}`);
    return data;
}