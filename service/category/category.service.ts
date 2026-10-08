import { api } from "@/lib/axios";
import type { CreateCategoryInput } from "@/lib/validations/category";
import type { CategoryResponse } from "@/types/category";

export async function CreateCategory(payload: CreateCategoryInput){
    const { data } = await api.post("/api/categories", payload);
    return data;
}

export async function GetCategory(): Promise<CategoryResponse[]> {
    const { data } = await api.get("/api/categories");
    return data.data ?? [];
}

export async function DeleteCategory(id: string) {
    const { data } = await api.delete(`/api/categories/${id}`);
    return data;
}