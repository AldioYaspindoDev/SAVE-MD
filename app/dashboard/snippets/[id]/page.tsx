'use client';

import { useMemo, useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Eye,
  Copy,
  Link2,
  Pencil,
  Check,
  ChevronDown,
  Download,
  Star,
  Pin,
  FileText,
  Terminal,
  Shield,
  WrapText,
  RefreshCw,
  Trash
} from 'lucide-react';
import Sidebar from '@/components/ui/sidebar';
import { DeleteSnippet, GetSnippet, UpdateSnippets } from '@/service/snippet/snippet.service';
import { GetCategory } from '@/service/category/category.service';
import { SnippetForm, type SnippetFormData } from '@/app/dashboard/snippets/new/page';
import type { SnippetDetail, SnippetType } from '@/types/snippet';

/* ============================================================
 * CONSTANTS
 * ============================================================ */

const TYPE_BADGE: Record<
  SnippetType,
  { bg: string; text: string; border: string; icon: React.ElementType }
> = {
  MARKDOWN: {
    bg: 'bg-violet-100',
    text: 'text-indigo-900',
    border: 'border-violet-200',
    icon: FileText,
  },
  PROMPT: {
    bg: 'bg-amber-50',
    text: 'text-yellow-600',
    border: 'border-amber-200',
    icon: Terminal,
  },
};

/**
 * Opsi ekstensi download.
 * - `auto` mengikuti `language` dari snippet.
 * - `txt` dan `md` selalu tersedia sebagai format netral.
 */
const DOWNLOAD_FORMATS = [
  { value: 'auto', label: 'Sesuai Bahasa', ext: null },
  { value: 'md', label: 'Markdown', ext: 'md' },
  { value: 'txt', label: 'Plain Text', ext: 'txt' },
  { value: 'ts', label: 'TypeScript', ext: 'ts' },
  { value: 'tsx', label: 'TSX (React)', ext: 'tsx' },
  { value: 'js', label: 'JavaScript', ext: 'js' },
  { value: 'py', label: 'Python', ext: 'py' },
  { value: 'java', label: 'Java', ext: 'java' },
  { value: 'go', label: 'Go', ext: 'go' },
  { value: 'rs', label: 'Rust', ext: 'rs' },
  { value: 'sql', label: 'SQL', ext: 'sql' },
  { value: 'json', label: 'JSON', ext: 'json' },
] as const;

interface Category {
  id: string;
  name: string;
}

/* ============================================================
 * PAGE
 * ============================================================ */

// Route dynamic (useParams) — di-prerender sebagai static shell lalu stream di request time.
export default function SnippetDetailPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SnippetDetailContent />
    </Suspense>
  );
}

function PageFallback() {
  return (
    <div className="flex w-full max-w-8xl overflow-hidden font-sans">
      <main className="flex-1 h-screen overflow-y-auto p-6 bg-slate-50">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-zinc-200 rounded w-1/3" />
          <div className="h-40 bg-white border border-zinc-200 rounded" />
          <div className="h-96 bg-neutral-900 rounded" />
        </div>
      </main>
    </div>
  );
}

function SnippetDetailSkeleton() {
  return (
    <div className="flex w-full max-w-8xl overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto p-6 bg-slate-50">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-zinc-200 rounded w-1/3" />
          <div className="h-40 bg-white border border-zinc-200 rounded" />
          <div className="h-96 bg-neutral-900 rounded" />
        </div>
      </main>
    </div>
  );
}

function SnippetDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [snippet, setSnippet] = useState<SnippetDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  const [wrap, setWrap] = useState(true);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<string>('auto');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  /* ---------- fetch ---------- */

  const fetchSnippet = async () => {
    try {
      const data = await GetSnippet(id);
      setSnippet(data);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal memuat snippet.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchSnippet();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    void (async () => {
      try {
        const data = await GetCategory();
        setCategories(data.map((c) => ({ id: c.id, name: c.name })));
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  /* ---------- derived ---------- */

  const badge = snippet ? TYPE_BADGE[snippet.type] : null;
  const BadgeIcon = badge?.icon;

  const stats = useMemo(() => {
    if (!snippet) return { lines: 0, chars: 0, bytes: 0 };
    const lines = snippet.content.split('\n').length;
    const chars = snippet.content.length;
    const bytes = new Blob([snippet.content]).size;
    return { lines, chars, bytes };
  }, [snippet]);

  /* ---------- handlers ---------- */

  const handleCopyContent = async () => {
    if (!snippet) return;
    await navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyLink = async () => {
    if (!snippet) return;
    const url = `${window.location.origin}/dashboard/snippets/${snippet.id}`;
    await navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1500);
  };

  const handleDownload = (format?: string) => {
    if (!snippet) return;
    const ext =
      DOWNLOAD_FORMATS.find((f) => f.value === (format ?? downloadFormat))
        ?.ext ?? (snippet.language?.split(' ')[0] || 'txt');

    const mimeMap: Record<string, string> = {
      md: 'text/markdown',
      txt: 'text/plain',
      json: 'application/json',
    };

    const blob = new Blob([snippet.content], {
      type: mimeMap[ext] || 'text/plain',
    });
    const url = URL.createObjectURL(blob);

    const baseName = snippet.title.replace(/\.[^/.]+$/, '');

    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdate = async (data: SnippetFormData) => {
    await UpdateSnippets(id, {
      title: data.title,
      description: data.description,
      content: data.content,
      type: data.type,
      categoryId: data.categoryId,
      tags: data.tags,
      language: data.language,
    });
    await fetchSnippet();
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Hapus snippet "${snippet?.title}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }

    setDeleting(true);
    setDeleteError('');
    try {
      await DeleteSnippet(id);
      router.replace('/dashboard/snippets');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Gagal menghapus snippet.');
      setDeleting(false);
    }
  };

  /* ---------- loading / error ---------- */

  if (loading) {
    return <SnippetDetailSkeleton />;
  }

  if (error || !snippet || !badge) {
    return (
      <div className="flex w-full max-w-8xl overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto p-6 bg-slate-50">
          <div className="mx-auto mt-10 max-w-md p-5 bg-red-50 border border-red-200 rounded flex flex-col gap-3">
            <p className="text-red-700 text-xs font-mono">
              {error || 'Snippet tidak ditemukan.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void fetchSnippet();
              }}
              className="h-9 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ---------- render ---------- */

  return (
    <div className="flex w-full max-w-8xl overflow-hidden font-sans">
      <Sidebar />
      <div className="min-h-screen bg-slate-50 flex-1 h-full overflow-y-auto">
        {/* ============ BREADCRUMB BAR ============ */}
        <div className="w-full bg-white border-b border-zinc-200">
          <div className="mx-auto px-6 py-3 flex justify-between items-center flex-wrap gap-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <Link
                href="/dashboard/snippets"
                className="px-2.5 py-1 bg-neutral-100 rounded text-zinc-500 hover:bg-zinc-200"
              >
                SEMUA BERKAS
              </Link>
              <span className="text-zinc-300 text-base">/</span>
              <span className="text-zinc-400">WORKSPACE</span>
              <span className="text-zinc-400">{'//'}</span>
              <span className="text-zinc-400">SNIPPETS</span>
              <span className="text-zinc-400">{'//'}</span>
              <span className="text-neutral-900">
                {editing ? 'EDIT' : 'DETAIL'}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-zinc-400" />
                <span className="text-neutral-900">{snippet.viewCount}</span>
                <span className="text-zinc-400">DILIHAT</span>
              </div>
              <div className="w-px h-3 bg-zinc-200" />
              <div className="flex items-center gap-1.5">
                <Copy className="w-3 h-3 text-zinc-400" />
                <span className="text-neutral-900">{snippet.copyCount}</span>
                <span className="text-zinc-400">DISALIN</span>
              </div>
              <div className="w-px h-3 bg-zinc-200" />
              <div className="flex items-center gap-1">
                <span className="text-zinc-400">ID:</span>
                <span className="px-1 bg-zinc-100 rounded text-zinc-500">
                  {snippet.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ HEADER ============ */}
        <div className="w-full bg-white border-b border-zinc-200">
          <div className="mx-auto p-6 flex justify-between items-start gap-6 flex-wrap">
            {/* Left: metadata */}
            <div className="flex-1 flex flex-col gap-3 min-w-[300px]">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full border flex items-center gap-1.5 text-xs font-mono ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  {BadgeIcon && <BadgeIcon className="w-3 h-3" />}
                  {snippet.type}
                </span>

                <span className="px-2 py-0.5 bg-blue-50 rounded-full border border-blue-200 flex items-center gap-1.5 text-xs font-mono text-indigo-900">
                  <Shield className="w-3 h-3" />
                  TERVERIFIKASI
                </span>

                {snippet.isFavorite && (
                  <span className="px-2 py-0.5 bg-amber-50 rounded-full border border-amber-300 flex items-center gap-1.5 text-xs font-mono text-amber-900">
                    <Star className="w-3 h-3" />
                    FAVORIT
                  </span>
                )}

                {snippet.isPinned && (
                  <span className="px-2 py-0.5 bg-blue-50 rounded-full border border-blue-300 flex items-center gap-1.5 text-xs font-mono text-indigo-900">
                    <Pin className="w-3 h-3" />
                    DISEMATKAN
                  </span>
                )}

                <span className="text-zinc-400 text-xs font-mono">
                  · UTF-8 · {stats.bytes} BYTES
                </span>
              </div>

              {/* Title */}
              <h1 className="text-neutral-900 text-3xl font-semibold leading-9 break-words">
                {snippet.title}
              </h1>

              {/* Description */}
              {snippet.description && (
                <p className="text-gray-700 text-base leading-6 max-w-3xl">
                  {snippet.description}
                </p>
              )}

              {/* Tags */}
              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {snippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-neutral-100 border border-zinc-300 rounded-full text-xs font-mono text-neutral-900 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: actions */}
            {!editing && (
              <div className="flex items-center gap-2 shrink-0">
                {/* Copy link (icon only) */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title={linkCopied ? 'Link tersalin!' : 'Salin link share'}
                  className={`size-9 flex items-center justify-center rounded border transition-colors ${linkCopied
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-white border-zinc-300 text-zinc-600 hover:bg-zinc-50'
                    }`}
                >
                  {linkCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                </button>

                {/* Edit — buka form inline, tetap di halaman ini */}
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="h-9 px-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Snippet
                  <span className="ml-1 px-1 py-0.5 bg-indigo-900/40 rounded text-[10px] font-mono text-blue-200">
                    E
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ============ TOOLBAR (hanya mode lihat) ============ */}
        {!editing && (
          <div className="w-full bg-neutral-100 border-b border-zinc-200">
            <div className="mx-auto px-6 py-2 flex flex-col gap-2">
              {/* File info row */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 bg-zinc-300 rounded-full" />
                  <span className="size-2.5 bg-zinc-300 rounded-full" />
                  <span className="size-2.5 bg-zinc-300 rounded-full" />
                </div>
                <div className="w-px h-3 bg-zinc-200" />
                <FileText className="w-3 h-3 text-gray-500" />
                <span className="text-gray-800 text-xs font-mono truncate">
                  {snippet.title}
                </span>
              </div>

              {/* Actions row */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-zinc-200/60 rounded text-xs font-mono text-gray-700">
                    {snippet.language ?? 'plaintext'}
                  </span>
                  <span className="text-gray-500 text-xs font-mono">
                    {stats.lines} BARIS
                  </span>
                  <span className="text-gray-500 text-xs font-mono">·</span>
                  <span className="text-gray-500 text-xs font-mono">
                    READ-ONLY
                  </span>
                </div>

                <div className="w-px h-3.5 bg-zinc-200" />

                <div className="flex items-center gap-1">
                  {/* Wrap toggle */}
                  <button
                    type="button"
                    onClick={() => setWrap((v) => !v)}
                    className="px-2 py-1 rounded text-xs font-mono text-zinc-500 hover:bg-zinc-200 flex items-center gap-1"
                  >
                    <WrapText className="w-3 h-3" />
                    WRAP: {wrap ? 'ON' : 'OFF'}
                  </button>

                  {/* Copy content */}
                  <button
                    type="button"
                    onClick={handleCopyContent}
                    className="px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors bg-blue-50 text-indigo-900 hover:bg-blue-100"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        TERSALIN
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        SALIN SEMUA
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ CONTENT ============ */}
        <div className="mx-auto p-6">
          {editing ? (
            /* ---- form edit inline: tetap di halaman ini ---- */
            <div className="bg-white border border-zinc-200 rounded p-6">
              <SnippetForm
                key={snippet.updatedAt}
                embedded
                categories={categories}
                initialData={{
                  title: snippet.title,
                  description: snippet.description ?? '',
                  content: snippet.content,
                  type: snippet.type,
                  tags: snippet.tags,
                  language: snippet.language ?? '',
                  categoryId: snippet.categoryId,
                  isFavorite: snippet.isFavorite,
                  isPinned: snippet.isPinned,
                }}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(false)}
              />
            </div>
          ) : (
            <>
              <CodeViewer content={snippet.content} wrap={wrap} />

              {/* ============ FOOTER INFO ============ */}
              <div className="mt-6 flex justify-between gap-4">

                {/* Download + actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Download dropdown */}
                  <div className="relative inline-flex">
                    <select
                      value={downloadFormat}
                      onChange={(e) => setDownloadFormat(e.target.value)}
                      className="appearance-none pl-7 pr-8 py-1.5 bg-white border border-zinc-300 rounded text-xs font-mono text-neutral-900 hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-blue-700 cursor-pointer"
                    >
                      {DOWNLOAD_FORMATS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label} ({f.ext ?? snippet.language ?? 'auto'})
                        </option>
                      ))}
                    </select>
                    <Download className="w-3 h-3 text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-3 h-3 text-zinc-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Actual download */}
                  <button
                    type="button"
                    onClick={() => handleDownload()}
                    className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-xs font-mono text-neutral-900 hover:bg-zinc-50 flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Unduh
                  </button>

                  {/* Quick download .md / .txt */}
                  <button
                    type="button"
                    onClick={() => handleDownload('md')}
                    className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-xs font-mono text-neutral-900 hover:bg-zinc-50 flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    .md
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('txt')}
                    className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-xs font-mono text-neutral-900 hover:bg-zinc-50 flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    .txt
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {deleteError && (
                    <span role="alert" className="max-w-64 text-xs text-red-600">
                      {deleteError}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    aria-label="Hapus snippet"
                    title={deleting ? 'Menghapus...' : 'Hapus snippet'}
                    className="bg-red-50 px-2 py-2 rounded hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash size={20} className="text-red-500" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * CODE VIEWER — background hitam, tinggi adjustable (drag handle)
 * ============================================================ */

interface CodeViewerProps {
  content: string;
  wrap: boolean;
}

function CodeViewer({ content, wrap }: CodeViewerProps) {
  const [height, setHeight] = useState(480);
  const lines = content.split('\n');
  const gutterRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const resizeStateRef = useRef<{ startY: number; startH: number } | null>(
    null
  );

  // sync scroll antara gutter & body
  useEffect(() => {
    const body = bodyRef.current;
    const gutter = gutterRef.current;
    if (!body || !gutter) return;

    const onScroll = () => {
      gutter.scrollTop = body.scrollTop;
    };
    body.addEventListener('scroll', onScroll);
    return () => body.removeEventListener('scroll', onScroll);
  }, []);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeStateRef.current = { startY: e.clientY, startH: height };

    const onMove = (ev: MouseEvent) => {
      if (!resizeStateRef.current) return;
      const delta = ev.clientY - resizeStateRef.current.startY;
      setHeight(Math.max(180, resizeStateRef.current.startH + delta));
    };

    const onUp = () => {
      resizeStateRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      className="flex flex-col bg-neutral-900 border border-zinc-700 rounded-sm overflow-hidden"
      style={{ height }}
    >
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Gutter */}
        <div
          ref={gutterRef}
          className="w-12 py-3 px-3 border-r border-zinc-700 overflow-hidden shrink-0 select-none"
        >
          {lines.map((_, i) => (
            <div
              key={i}
              className="text-right text-zinc-500 text-xs font-mono leading-5"
              style={{ height: 20 }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-auto p-3">
          <pre
            className={`text-xs font-mono leading-5 ${wrap
                ? 'whitespace-pre-wrap break-words'
                : 'whitespace-pre'
              }`}
          >
            {lines.map((line, i) => (
              <CodeLine key={i} line={line} />
            ))}
          </pre>
        </div>
      </div>

      {/* ============ Resize handle ============ */}
      <div
        onMouseDown={startResize}
        title="Drag untuk ubah tinggi"
        className="h-1.5 bg-neutral-800 hover:bg-blue-700/60 cursor-ns-resize transition-colors shrink-0"
      />
    </div>
  );
}

/**
 * Highlighter sederhana untuk markdown (palet gelap):
 * - heading `### ` → biru bold
 * - numbered list `1.` → kuning
 * - inline `code` → bg biru muda
 */
function CodeLine({ line }: { line: string }) {
  // heading
  if (/^#{1, 6}\s/.test(line)) {
    return <div className="text-blue-300 font-medium">{line}</div>;
  }

  // numbered list
  const numberedMatch = line.match(/^(\s*)(\d+\.)(\s.*)$/);
  if (numberedMatch) {
    const [, indent, num, rest] = numberedMatch;
    return (
      <div className="text-zinc-100">
        {indent}
        <span className="text-yellow-400 font-medium">{num}</span>
        {rest}
      </div>
    );
  }

  // inline code `...`
  const parts = line.split(/(`[^`]+`)/g);
  if (parts.length > 1) {
    return (
      <div className="text-zinc-100">
        {parts.map((p, i) =>
          p.startsWith('`') && p.endsWith('`') ? (
            <span key={i} className="px-1 bg-blue-900/60 text-blue-200 rounded">
              {p.slice(1, -1)}
            </span>
          ) : (
            <span key={i}>{p}</span>
          )
        )}
      </div>
    );
  }

  return <div className="text-zinc-100">{line || '\u00A0'}</div>;
}
