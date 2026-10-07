import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/utils/errors";
import { slugify } from "@/lib/utils/slug";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/validations/category";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  color: true,
  icon: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const categoryService = {
  async list(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: categorySelect,
    });
  },

  async get(userId: string, id: string) {
    const category = await prisma.category.findFirst({
      where: { id, userId },
      select: categorySelect,
    });
    if (!category) throw new ApiError("NOT_FOUND", "Category not found");
    return category;
  },

  async create(userId: string, input: CreateCategoryInput) {
    const slug = slugify(input.name);
    if (!slug) throw new ApiError("VALIDATION_ERROR", "Name must produce a valid slug");

    return prisma.category.create({
      data: { ...input, slug, userId },
      select: categorySelect,
    });
  },

  async update(userId: string, id: string, input: UpdateCategoryInput) {
    await this.get(userId, id);

    const data: UpdateCategoryInput & { slug?: string } = { ...input };
    if (input.name) {
      const slug = slugify(input.name);
      if (!slug) throw new ApiError("VALIDATION_ERROR", "Name must produce a valid slug");
      data.slug = slug;
    }

    return prisma.category.update({
      where: { id },
      data,
      select: categorySelect,
    });
  },

  async remove(userId: string, id: string) {
    await this.get(userId, id);

    await prisma.$transaction([
      prisma.snippet.updateMany({
        where: { userId, categoryId: id },
        data: { categoryId: null },
      }),
      prisma.category.delete({ where: { id } }),
    ]);
  },
};