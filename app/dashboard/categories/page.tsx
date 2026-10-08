"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Folder,
  Plus,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Code2,
  Terminal,
  Sparkles,
  Cpu,
  Layers,
  Database,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { ApiError } from "@/lib/api-error";
import { GetCategory } from "@/service/category/category.service";
import { CategoryResponse } from "@/types/category";
import Sidebar from "@/components/ui/sidebar";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await GetCategory();
      // Memastikan response selalu berupa array
      setCategories(Array.isArray(response) ? response : []);
      setError("");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Terjadi kesalahan saat mengambil data kategori"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchCategories();
    })();
  }, []);

  const retry = () => {
    setError("");
    setLoading(true);
    fetchCategories();
  };

  const ICON_OPTIONS = [
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
    { id: 'cpu', label: 'Cpu', icon: Cpu },
    { id: 'layers', label: 'Layers', icon: Layers },
    { id: 'database', label: 'Data', icon: Database },
    { id: 'docs', label: 'Docs', icon: FileText },
    { id: 'shield', label: 'Shield', icon: ShieldCheck },
  ];

  const getIconById = (iconId: string) => {
    const found = ICON_OPTIONS.find((opt) => opt.id === iconId);
    // Gunakan ikon Folder sebagai fallback jika ID tidak ditemukan
    return found ? found.icon : Folder;
  };

  return (
    <div className="flex w-full overflow-hidden max-w-8xl font-sans">
      <Sidebar />
      {/* Header Section */}
      <main className="flex-1 h-full overflow-y-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Kategori</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Kelola dan organisasi seluruh resource Anda berdasarkan kategori.
            </p>
          </div>
          <Link
            href="/dashboard/categories/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors shrink-0"
          >
            <Plus className="size-4" />
            <span>Tambah Kategori</span>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-red-700 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={retry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-lg text-xs transition-colors"
            >
              <RefreshCw className="size-3.5" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Skeleton Loading State (4 Cards) */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-5 bg-white border border-zinc-200 rounded-xl space-y-4 animate-pulse"
              >
                <div className="size-10 bg-zinc-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded w-full" />
                </div>
                <div className="h-8 bg-zinc-100 rounded w-full mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Content State: Grid 4 Kolom */}
        {!loading && !error && (
          <>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
                {categories.map((item, index) => {
                  const IconComponents = getIconById(item.icon ?? "");
                  // Fallback ke warna biru default (#2563eb) jika item.color kosong
                  const itemColor = item.color || "#2563eb";

                  return (
                    <div
                      key={item.id || index}
                      /* 1. Set CSS Variable --item-color pada parent card */
                      style={{ "--item-color": itemColor } as React.CSSProperties}
                      /* 2. Border hover menggunakan [var(--item-color)] */
                      className="group bg-white border border-zinc-200 hover:border-[var(--item-color)] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        {/* Icon & Count Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div
                            style={{
                              backgroundColor: `${itemColor}1A`, // Opacity ~10% saat normal
                              color: itemColor,
                            }}
                            /* 3. Background icon saat group-hover berubah mengikuti --item-color */
                            className="size-10 rounded-lg flex items-center justify-center group-hover:!bg-[var(--item-color)] group-hover:!text-white transition-colors"
                          >
                            <IconComponents className="size-5" />
                          </div>

                          {item._count?.snippets !== undefined && (
                            <span className="text-[11px] font-mono font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                              {item._count.snippets} Snippet
                            </span>
                          )}
                        </div>

                        {/* Category Name */}
                        {/* 4. Judul kategori berubah warna saat group-hover */}
                        <h2 className="text-base font-semibold text-zinc-900 group-hover:text-[var(--item-color)] transition-colors line-clamp-1">
                          {item.name}
                        </h2>

                        {/* Category Description */}
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description || "Tidak ada deskripsi kategori."}
                        </p>
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                        {/* 5. Teks Link & Icon Panah mengikuti warna itemColor */}
                        <Link
                          href={`/dashboard/categories/${item.slug}`}
                          style={{ color: itemColor }}
                          className="text-xs font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all hover:brightness-90"
                        >
                          Lihat Resource
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 text-center bg-white border border-dashed border-zinc-300 rounded-xl max-w-md mx-auto my-8">
                <div className="size-12 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Folder className="size-6" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">Belum Ada Kategori</h3>
                <p className="text-xs text-zinc-500 mt-1 mb-4">
                  Mulai buat kategori pertama Anda untuk mengelompokkan kode/snippet.
                </p>
                <Link
                  href="/dashboard/categories/new"
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors"
                >
                  <Plus className="size-3.5" />
                  Tambah Kategori
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div >
  );
}