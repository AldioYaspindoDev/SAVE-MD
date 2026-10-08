export interface CategoryResponse {
    id: string,
    name: string,
    slug: string,
    description: string | null,
    color: string | null,
    icon: string | null,
    createdAt: string,
    updatedAt: string,
    _count?: {
        snippets: number
    }
}
