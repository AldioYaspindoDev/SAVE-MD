'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ElementType } from 'react';
import {
  Plus,
  FileText,
  Terminal,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import Sidebar from '@/components/ui/sidebar';
import { ApiError } from '@/lib/api-error';
import { GetSnippets } from '@/service/snippet/snippet.service';
import type { SnippetResponse, SnippetType } from '@/types/snippet';

/* ============================================================
 * TYPES & CONSTANTS
 * ============================================================ */

type FilterKey = 'all' | 'markdown' | 'prompt';
type SortKey = 'recent' | 'oldest' | 'name';

const TYPE_STYLES: Record<
  SnippetType,
  { bg: string; text: string; border: string; icon: ElementType; extension: string }
> = {
  MARKDOWN: {
    bg: 'bg-violet-100',
    text: 'text-indigo-900',
    border: 'border-transparent',
    icon: FileText,
    extension: '.md',
  },
  PROMPT: {
    bg: 'bg-amber-50',
    text: 'text-yellow-600',
    border: 'border-yellow-600/20',
    icon: Terminal,
    extension: '.prompt',
  },
};

const PER_PAGE = 8;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function timeAgo(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  return `${days}h lalu`;
}

/* ============================================================
 * PAGE
 * ============================================================ */

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<SnippetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState<SortKey>('recent');
  const [page, setPage] = useState(1);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const data = await GetSnippets({ limit: 100 });
      setSnippets(data);
      setError('');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Terjadi kesalahan saat mengambil snippet'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchSnippets();
    })();
  }, []);

  const counts = useMemo(
    () => ({
      all: snippets.length,
      markdown: snippets.filter((s) => s.type === 'MARKDOWN').length,
      prompt: snippets.filter((s) => s.type === 'PROMPT').length,
    }),
    [snippets]
  );

  const filtered = useMemo(() => {
    let arr = snippets;
    if (filter === 'markdown') arr = arr.filter((s) => s.type === 'MARKDOWN');
    if (filter === 'prompt') arr = arr.filter((s) => s.type === 'PROMPT');

    arr = [...arr];
    if (sort === 'recent') {
      arr.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sort === 'oldest') {
      arr.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    } else if (sort === 'name') {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    }
    return arr;
  }, [snippets, filter, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const FILTERS: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'SEMUA', count: counts.all },
    { key: 'markdown', label: 'MARKDOWN', count: counts.markdown },
    { key: 'prompt', label: 'PROMPT', count: counts.prompt },
  ];

  return (
    <div className="flex w-full max-w-8xl overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto">
        {/* ============ HEADER ============ */}
        <div className="w-full bg-white border-b border-zinc-200">
          <div className="mx-auto px-6 py-3 flex flex-col gap-1">
            <h1 className="text-zinc-900 text-3xl font-medium leading-9">
              Semua Snippets &amp; Resource
            </h1>
            <p className="text-zinc-500 text-sm leading-5 max-w-2xl">
              Koleksi terpusat file markdown, template prompt, dan potongan kode yang telah
              disimpan. Klik kartu untuk membuka detail dan pratinjau lengkap.
            </p>
          </div>
        </div>

        {/* ============ ACTION BAR ============ */}
        <div className="w-full bg-white border-b border-zinc-200">
          <div className="mx-auto px-6 py-3 flex flex-wrap justify-between items-center gap-4">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map((f) => {
                const isActive = filter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => {
                      setFilter(f.key);
                      setPage(1);
                    }}
                    className={`h-7 px-4 rounded-full outline outline-1 outline-offset-[-1px] flex items-center gap-2 transition-colors ${
                      isActive
                        ? 'bg-violet-100 outline-blue-700'
                        : 'bg-white outline-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isActive ? 'bg-blue-700' : 'bg-zinc-400'
                      }`}
                    />
                    <span
                      className={`text-xs font-medium font-mono tracking-wide ${
                        isActive ? 'text-indigo-900' : 'text-zinc-500'
                      }`}
                    >
                      {f.label} ({f.count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort + add */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 text-xs font-medium font-mono uppercase">
                  Urut:
                </span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortKey);
                    setPage(1);
                  }}
                  className="pl-3 pr-6 py-1 bg-white rounded border border-zinc-300 text-neutral-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-700"
                >
                  <option value="recent">Terbaru Diperbarui</option>
                  <option value="oldest">Terlama</option>
                  <option value="name">Nama A-Z</option>
                </select>
              </div>

              <div className="w-px h-3 bg-zinc-200" />

              <Link
                href="/dashboard/snippets/new"
                className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-medium flex items-center gap-2 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tambah Resource Baru
              </Link>
            </div>
          </div>
        </div>

        {/* ============ ERROR ============ */}
        {error && (
          <div className="px-6 pt-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-red-700 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => void fetchSnippets()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-lg text-xs transition-colors"
              >
                <RefreshCw className="size-3.5" />
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* ============ GRID ============ */}
        <div className="p-6 bg-slate-50 min-h-screen">
          <div className="mx-auto flex flex-col gap-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-56 bg-white rounded border border-zinc-200 animate-pulse"
                  />
                ))}
              </div>
            ) : paged.length === 0 ? (
              <div className="py-16 text-center text-zinc-400 text-sm font-mono">
                {snippets.length === 0
                  ? 'Belum ada snippet. Tambahkan resource baru.'
                  : 'Tidak ada resource pada filter ini.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {paged.map((snippet) => {
                  const style = TYPE_STYLES[snippet.type];
                  const Icon = style.icon;

                  return (
                    <div
                      key={snippet.id}
                      className="bg-white rounded border border-zinc-200 flex flex-col justify-between hover:shadow-sm transition-shadow"
                    >
                      <div className="p-4 flex flex-col gap-3">
                        {/* Badge + size */}
                        <div className="pb-3 border-b border-zinc-100 flex justify-between items-center">
                          <div
                            className={`px-2 py-0.5 rounded flex items-center gap-1 border ${style.bg} ${style.border}`}
                          >
                            <Icon className={`w-3 h-3 ${style.text}`} />
                            <span
                              className={`text-xs font-medium font-mono tracking-wide ${style.text}`}
                            >
                              {snippet.type}
                            </span>
                          </div>
                          <span className="text-zinc-400 text-xs font-medium font-mono">
                            {style.extension} · {formatSize(snippet.size)}
                          </span>
                        </div>

                        {/* Category + title */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-zinc-400 text-[10px] font-mono uppercase tracking-wide">
                            {snippet.categoryName ?? 'TANPA KATEGORI'}
                          </span>
                          <h3 className="text-neutral-900 text-base font-medium leading-5 line-clamp-2 break-words">
                            {snippet.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-zinc-500 text-xs leading-5 line-clamp-3 min-h-[3.75rem]">
                          {snippet.description || snippet.excerpt || 'Tanpa deskripsi.'}
                        </p>

                        {/* Meta */}
                        <div className="pt-2 border-t border-zinc-100 flex justify-between items-center">
                          <span className="text-zinc-400 text-xs font-mono">
                            {snippet.lines} baris
                          </span>
                          <span className="text-zinc-400 text-xs font-mono">
                            {timeAgo(snippet.updatedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Bottom action */}
                      <Link
                        href={`/dashboard/snippets/${snippet.id}`}
                        className="px-4 py-2 bg-neutral-100 border-t border-zinc-200 flex justify-between items-center hover:bg-neutral-200 transition-colors"
                      >
                        <span className="flex items-center gap-1 text-zinc-500 text-xs font-mono">
                          Lihat Detail
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        <span className="text-zinc-400 text-xs font-mono">⋯</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ============ PAGINATION ============ */}
            {totalPages > 1 && (
              <div className="pt-4 border-t border-zinc-200 flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2.5 py-1 bg-white rounded border border-zinc-300 text-zinc-400 text-xs font-mono hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← SEBELUMNYA
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === page;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded border text-xs font-mono ${
                        isActive
                          ? 'bg-violet-100 border-blue-700 text-indigo-900'
                          : 'bg-white border-zinc-300 text-neutral-900 hover:bg-zinc-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-2.5 py-1 bg-white rounded border border-zinc-300 text-neutral-900 text-xs font-mono hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  BERIKUTNYA →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}