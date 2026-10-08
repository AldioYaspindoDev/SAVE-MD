export type SnippetType = "MARKDOWN" | "PROMPT";

export interface SnippetResponse {
    id: string;
    title: string;
    description: string | null;
    type: SnippetType;
    tags: string[];
    language: string | null;
    categoryId: string | null;
    isFavorite: boolean;
    isPinned: boolean;
    viewCount: number;
    copyCount: number;
    createdAt: string;
    updatedAt: string;
    excerpt: string;
    categoryName: string | null;
    size: number;
    lines: number;
}

export interface SnippetDetail {
    id: string;
    title: string;
    description: string | null;
    content: string;
    type: SnippetType;
    tags: string[];
    language: string | null;
    categoryId: string | null;
    isFavorite: boolean;
    isPinned: boolean;
    viewCount: number;
    copyCount: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    category: { id: string; name: string } | null;
}