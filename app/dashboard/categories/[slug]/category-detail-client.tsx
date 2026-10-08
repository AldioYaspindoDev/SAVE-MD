"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Terminal,
  Plus,
  Download,
  Copy,
  Eye,
  Search,
  AlertCircle,
  RefreshCw,
  Folder,
  Code2,
  Sparkles,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  ArrowLeft,
  Pen,
  Trash
} from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import { ApiError } from "@/lib/api-error";
import { DeleteCategory, GetCategory } from "@/service/category/category.service";
import { GetSnippets } from "@/service/snippet/snippet.service";
import type { CategoryResponse } from "@/types/category";
import type { SnippetResponse } from "@/types/snippet";

const ICON_OPTIONS = [
  { id: "code", icon: Code2 },
  { id: "terminal", icon: Terminal },
  { id: "sparkles", icon: Sparkles },
  { id: "cpu", icon: Cpu },
  { id: "layers", icon: Layers },
  { id: "database", icon: Database },
  { id: "docs", icon: FileText },
  { id: "shield", icon: ShieldCheck },
];

function renderCategoryIcon(iconId: string | null, className: string) {
  const Icon = ICON_OPTIONS.find((opt) => opt.id === iconId)?.icon ?? Folder;
  return <Icon className={className} />;
}

function timeAgo(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  return `${Math.floor(hours / 24)}h lalu`;
}

interface CategoryDetailClientProps {
  slug: string;
}

export default function CategoryDetailClient({ slug }: CategoryDetailClientProps) {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [snippets, setSnippets] = useState<SnippetResponse[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const fetchCategory = async () => {
    if (!slug) return;
    try {
      const categories = await GetCategory();
      const found = categories.find((c) => c.slug === slug);
      if (!found) {
        setNotFound(true);
      } else {
        setCategory(found);
      }
      setError("");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Terjadi kesalahan saat mengambil data kategori"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchCategory();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!category) return;
    let active = true;

    const timer = setTimeout(async () => {
      try {
        const items = await GetSnippets({
          categoryId: category.id,
          q: query.trim() || undefined,
        });
        if (!active) return;
        setSnippets(items);
        setError("");
      } catch (err) {
        if (active) {
          setError(
            err instanceof ApiError ? err.message : "Terjadi kesalahan saat mengambil snippet"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [category, query]);

  const retry = () => {
    setError("");
    setLoading(true);
    setNotFound(false);
    void fetchCategory();
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("Hapus kategori ini? Tindakan ini tidak bisa dibatalkan.")) return;
    setError("");
    try {
      await DeleteCategory(id);
      router.push("/dashboard/categories");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Terjadi kesalahan saat menghapus kategori"
      );
    }
  }

  const accent = category?.color || "#2563eb";
  const totalSnippets = category?._count?.snippets ?? snippets.length;
  const lastUpdated = snippets[0]?.updatedAt ?? category?.updatedAt;

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-zinc-200 rounded w-1/3" />
            <div className="h-4 bg-zinc-100 rounded w-1/2" />
            <div className="h-40 bg-white border border-zinc-200 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto">
        {/* Error State */}
        {error && (
          <div className="max-w-[1200px] mx-auto px-6 pt-6">
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
          </div>
        )}

        {/* Not Found State */}
        {!error && notFound && (
          <div className="max-w-md mx-auto my-20 p-12 text-center bg-white border border-dashed border-zinc-300 rounded-xl">
            <div className="size-12 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Folder className="size-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">Kategori Tidak Ditemukan</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Kategori dengan slug &quot;{slug}&quot; tidak tersedia.
            </p>
            <Link
              href="/dashboard/categories"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Kembali ke Kategori
            </Link>
          </div>
        )}

        {!error && !notFound && category && (
          <>
            {/* Breadcrumb Bar */}
            <div className="w-full bg-white border-b border-zinc-200">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2 text-xs font-mono font-medium">
                <Link href="/dashboard/categories" className="text-zinc-400 hover:text-zinc-700">
                  KATEGORI
                </Link>
                <span className="text-zinc-300">{"//"}</span>
                <span className="text-zinc-500 uppercase">{slug}</span>
              </div>
            </div>

            {/* Hero Header */}
            <div className="w-full bg-white border-b border-zinc-200">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-7">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                  <div className="max-w-3xl flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                      <div
                        className="px-2 py-0.5 rounded flex items-center gap-1"
                        style={{ backgroundColor: `${accent}1A`, color: accent }}
                      >
                        {renderCategoryIcon(category.icon, "w-3.5 h-3.5")}
                        <span className="uppercase">{category.slug}</span>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-medium text-neutral-900 font-sans">
                      {category.name}
                    </h1>

                    <p className="text-gray-600 text-sm sm:text-base font-normal leading-relaxed">
                      {category.description || "Tidak ada deskripsi kategori."}
                    </p>

                    {/* Metadata Grid */}
                    <div className="pt-4 border-t border-zinc-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                      <div>
                        <div className="text-zinc-400 uppercase text-[10px]">SLUG URI</div>
                        <div className="text-neutral-900 font-medium truncate">
                          categories/{category.slug}
                        </div>
                      </div>
                      <div>
                        <div className="text-zinc-400 uppercase text-[10px]">TOTAL SNIPPET</div>
                        <div className="font-medium" style={{ color: accent }}>
                          {totalSnippets} Snippet
                        </div>
                      </div>
                      <div>
                        <div className="text-zinc-400 uppercase text-[10px]">
                          TERAKHIR DIPERBARUI
                        </div>
                        <div className="text-neutral-900 font-medium">
                          {lastUpdated ? timeAgo(lastUpdated) : "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-zinc-400 uppercase text-[10px]">FORMAT BERKAS</div>
                        <div className="text-green-800 font-medium">.md / .prompt</div>
                      </div>
                    </div>
                  </div>

                  {/* Header Action Buttons */}
                  <div className="flex flex-col gap-2 w-full lg:w-auto shrink-0">
                    <div>
                      <Link
                        href={`/dashboard/snippets/new?categoryId=${category.id}`}
                        className="px-2 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Snippet</span>
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/categories/update?categoryId=${category.id}`}
                        className="px-2 py-2 bg-neutral-200 hover:bg-neutral-800 hover:text-white text-neutral-900 rounded text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        <Pen className="w-3.5 h-3.5" />
                        <span>Edit Kategori</span>
                      </Link>

                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="px-2 py-2 bg-neutral-200 hover:bg-neutral-800 hover:text-white text-neutral-900 rounded text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        <Trash className="w-3.5 h-3.5" />
                        <span>Hapus Kategori</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Toolbar */}
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 mt-6 pb-10">
              <div className="p-4 bg-white border border-zinc-200 rounded-t-lg flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <Folder className="w-4 h-4" style={{ color: accent }} />
                  <span className="uppercase">{category.name}</span>
                  <span className="text-zinc-300">{"//"}</span>
                  <span>{totalSnippets} total</span>
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari snippet di kategori ini..."
                    className="w-full h-9 pl-9 pr-3 bg-white text-neutral-900 border border-zinc-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Snippet List */}
              <div className="p-4 bg-white border-x border-b border-zinc-200 rounded-b-lg">
                {snippets.length > 0 ? (
                  <>
                    <div className="mb-3 text-xs font-mono text-zinc-400">
                      {query
                        ? `${snippets.length} hasil untuk "${query}"`
                        : `${snippets.length} snippet`}
                    </div>
                    <div className="flex flex-col gap-3">
                      {snippets.map((snippet) => {
                        const isPrompt = snippet.type === "PROMPT";
                        const fileIcon = isPrompt ? (
                          <Terminal className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-700" />
                        );
                        const typeBg = isPrompt
                          ? "bg-amber-50 text-yellow-700 border-yellow-600/40"
                          : "bg-violet-100 text-indigo-900 border-blue-700/30";
                        return (
                          <div
                            key={snippet.id}
                            className="bg-white border border-zinc-200 rounded hover:shadow-sm transition-shadow"
                          >
                            <div className="p-4 flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2 font-mono text-xs font-medium text-neutral-900">
                                  {fileIcon}
                                  <span>{snippet.title}</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-mono text-xs">
                                  <span className={`px-1.5 py-0.5 rounded border ${typeBg}`}>
                                    {snippet.type}
                                  </span>
                                  {snippet.language && (
                                    <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded border border-zinc-200">
                                      {snippet.language}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed font-sans line-clamp-2">
                                {snippet.description || snippet.excerpt}
                              </p>
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                <span className="text-[11px] font-mono text-zinc-400">
                                  Diperbarui {timeAgo(snippet.updatedAt)}
                                </span>
                                <div className="flex items-center gap-2 font-mono text-xs">
                                  <Link
                                    href={`/dashboard/snippets/${snippet.id}`}
                                    className="px-2.5 py-1 bg-white border border-zinc-300 rounded hover:bg-zinc-50 flex items-center gap-1 text-neutral-900 transition-colors"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Lihat Detail</span>
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => navigator.clipboard?.writeText(snippet.excerpt)}
                                    className="px-2.5 py-1 bg-white border border-zinc-300 rounded hover:bg-zinc-50 flex items-center gap-1 text-neutral-900 transition-colors"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Salin Teks</span>
                                  </button>
                                  <a
                                    href={`/api/snippets/${snippet.id}/download`}
                                    className="px-2.5 py-1 bg-white border border-zinc-300 rounded hover:bg-zinc-50 flex items-center gap-1 text-neutral-900 transition-colors"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Unduh</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  /* Empty / No-result State */
                  <div className="p-12 text-center bg-zinc-50 border border-dashed border-zinc-300 rounded-lg">
                    <div className="size-12 bg-white border border-zinc-200 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Folder className="size-6" />
                    </div>
                    {query ? (
                      <p className="text-xs text-zinc-500">
                        Tidak ada snippet yang cocok dengan &quot;{query}&quot;.
                      </p>
                    ) : (
                      <>
                        <h3 className="text-sm font-semibold text-zinc-900">
                          Belum Ada Snippet
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1 mb-4">
                          Kategori ini masih kosong. Tambahkan snippet pertama Anda.
                        </p>
                        <Link
                          href={`/dashboard/snippets/new?categoryId=${category.id}`}
                          className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded-lg transition-colors"
                        >
                          <Plus className="size-3.5" />
                          Tambah Snippet
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
