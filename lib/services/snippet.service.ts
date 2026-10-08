import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/utils/errors";
import { slugify } from "@/lib/utils/slug";
import type { CreateSnippetInput, UpdateSnippetInput } from "@/lib/validations/snippet";
import type { SnippetListQuery } from "@/lib/validations/query";

const listSelect = {
  id: true,
  title: true,
  description: true,
  tags: true,
  type: true,
  categoryId: true,
  language: true,
  isFavorite: true,
  isPinned: true,
  viewCount: true,
  copyCount: true,
  createdAt: true,
  updatedAt: true,
  content: true,
  category: { select: { name: true } },
} as const;

export const snippetService = {
  async list(userId: string, query: SnippetListQuery) {
    const where: Prisma.SnippetWhereInput = { userId };

    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.type) where.type = query.type;
    if (query.isFavorite !== undefined) where.isFavorite = query.isFavorite;
    if (query.isPinned !== undefined) where.isPinned = query.isPinned;

    const tags = (query.tags ?? "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (tags.length) where.tags = { hasEvery: tags };

    if (query.q) {
      const q = query.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { tags: { hasEvery: [query.q.toLowerCase()] } },
      ];
    }

    const orderBy: Prisma.SnippetOrderByWithRelationInput = { [query.sort]: query.order };

    const [total, items] = await Promise.all([
      prisma.snippet.count({ where }),
      prisma.snippet.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        select: listSelect,
      }),
    ]);

    return {
      items: items.map(({ content, category, ...rest }) => ({
        ...rest,
        categoryName: category?.name ?? null,
        excerpt: content.slice(0, 200),
        size: Buffer.byteLength(content, "utf8"),
        lines: content.split("\n").length,
      })),
      total,
    };
  },

  async get(userId: string, id: string) {
    const snippet = await prisma.snippet.findFirst({
      where: { id, userId },
    });
    if (!snippet) throw new ApiError("NOT_FOUND", "Snippet not found");
    return snippet;
  },

  async assertCategoryOwned(userId: string, categoryId: string) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
      select: { id: true },
    });
    if (!category) throw new ApiError("NOT_FOUND", "Category not found");
  },

  async create(userId: string, input: CreateSnippetInput) {
    if (input.categoryId) {
      await this.assertCategoryOwned(userId, input.categoryId);
    }

    const data: Prisma.SnippetUncheckedCreateInput = {
      ...input,
      userId,
    };
    return prisma.snippet.create({ data });
  },

  async update(userId: string, id: string, input: UpdateSnippetInput) {
    await this.get(userId, id);

    if (input.categoryId) {
      await this.assertCategoryOwned(userId, input.categoryId);
    }

    const data: Prisma.SnippetUncheckedUpdateInput = input;
    return prisma.snippet.update({ where: { id }, data });
  },

  async remove(userId: string, id: string) {
    await this.get(userId, id);
    await prisma.snippet.delete({ where: { id } });
  },

  async addView(userId: string, id: string) {
    await this.get(userId, id);
    return prisma.snippet.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });
  },

  async addCopy(userId: string, id: string) {
    await this.get(userId, id);
    return prisma.snippet.update({
      where: { id },
      data: { copyCount: { increment: 1 } },
      select: { copyCount: true },
    });
  },

  async toggleFavorite(userId: string, id: string) {
    const snippet = await this.get(userId, id);
    return prisma.snippet.update({
      where: { id },
      data: { isFavorite: !snippet.isFavorite },
      select: { isFavorite: true },
    });
  },

  async togglePin(userId: string, id: string) {
    const snippet = await this.get(userId, id);
    return prisma.snippet.update({
      where: { id },
      data: { isPinned: !snippet.isPinned },
      select: { isPinned: true },
    });
  },

  async download(userId: string, id: string) {
    const snippet = await this.get(userId, id);
    return { content: snippet.content, filename: slugify(snippet.title) || "snippet" };
  },

  async stats(userId: string) {
    const [totalSnippets, totalCategories, totalFavorites, totalPrompts, totalMarkdown] =
      await Promise.all([
        prisma.snippet.count({ where: { userId } }),
        prisma.category.count({ where: { userId } }),
        prisma.snippet.count({ where: { userId, isFavorite: true } }),
        prisma.snippet.count({ where: { userId, type: "PROMPT" } }),
        prisma.snippet.count({ where: { userId, type: "MARKDOWN" } }),
      ]);
    return { totalSnippets, totalCategories, totalFavorites, totalPrompts, totalMarkdown };
  },
};