'use client';

import {
  useState,
  useMemo,
  useRef,
  useEffect,
  Suspense,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileText, Terminal, Star, Pin, X, Save, Loader2 } from 'lucide-react';
import Sidebar from '@/components/ui/sidebar';
import { GetCategory } from '@/service/category/category.service';
import { CreateSnippets } from '@/service/snippet/snippet.service';

/* ============================================================
 * TYPES (samakan dengan Prisma model)
 * ============================================================ */

type SnippetType = 'MARKDOWN' | 'PROMPT';

interface Category {
  id: string;
  name: string;
}

export interface SnippetFormData {
  title: string;
  description: string;
  content: string;
  type: SnippetType;
  tags: string[];
  language: string;
  categoryId: string | null;
  isFavorite: boolean;
  isPinned: boolean;
}

interface SnippetFormProps {
  categories?: Category[];
  initialData?: Partial<SnippetFormData>;
  onSubmit?: (data: SnippetFormData) => Promise<void>;
  onCancel?: () => void;
  /** Render hanya isi form (tanpa Sidebar/wrapper) untuk dipakai di halaman lain */
  embedded?: boolean;
}

/* ============================================================
 * CONSTANTS
 * ============================================================ */

const TYPE_OPTIONS: {
  value: SnippetType;
  label: string;
  description: string;
  icon: React.ElementType;
  accent: string; // warna teks/ikon
}[] = [
    {
      value: 'MARKDOWN',
      label: 'MARKDOWN',
      description: 'Dokumentasi, panduan instruksi, & berkas catatan .md',
      icon: FileText,
      accent: 'text-indigo-900',
    },
    {
      value: 'PROMPT',
      label: 'PROMPT',
      description: 'System instruction AI, meta-prompts, agent templates',
      icon: Terminal,
      accent: 'text-yellow-600',
    },
  ];

const MAX_DESCRIPTION = 250;

/* ============================================================
 * COMPONENT
 * ============================================================ */

export function SnippetForm({
  categories = [],
  initialData,
  onSubmit,
  onCancel,
  embedded,
}: SnippetFormProps) {
  /* ---------- state ---------- */
  const [form, setForm] = useState<SnippetFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    content: initialData?.content ?? '',
    type: initialData?.type ?? 'MARKDOWN',
    tags: initialData?.tags ?? [],
    language: initialData?.language ?? '',
    categoryId: initialData?.categoryId ?? null,
    isFavorite: initialData?.isFavorite ?? false,
    isPinned: initialData?.isPinned ?? false,
  });

  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- derived ---------- */
  const contentStats = useMemo(() => {
    const lines = form.content.split('\n').length;
    const chars = form.content.length;
    return { lines, chars };
  }, [form.content]);

  const descRemaining = MAX_DESCRIPTION - form.description.length;

  /* ---------- helpers ---------- */
  const update = <K extends keyof SnippetFormData>(
    key: K,
    value: SnippetFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddTag = (raw: string) => {
    const value = raw.trim().toUpperCase();
    if (!value || form.tags.includes(value)) return;
    update('tags', [...form.tags, value]);
    setTagInput('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && form.tags.length) {
      update('tags', form.tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tag: string) => {
    update(
      'tags',
      form.tags.filter((t) => t !== tag)
    );
  };

  const handleSubmit = async () => {
    setError(null);

    // validasi minimal
    if (!form.title.trim()) return setError('Judul snippet wajib diisi.');
    if (!form.content.trim()) return setError('Konten snippet wajib diisi.');

    try {
      setSubmitting(true);
      await onSubmit?.(form);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan.'
      );
    } finally {
      setSubmitting(false);
    }
  };


  // ... state sebelumnya

  /* ---------- editor state ---------- */
  const [editorHeight, setEditorHeight] = useState(300); // px
  const [autoGrow, setAutoGrow] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);
  const resizeStateRef = useRef<{ startY: number; startH: number } | null>(null);

  /* ---------- resize handler ---------- */
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeStateRef.current = { startY: e.clientY, startH: editorHeight };

    const onMove = (ev: MouseEvent) => {
      if (!resizeStateRef.current) return;
      const delta = ev.clientY - resizeStateRef.current.startY;
      const next = Math.max(180, resizeStateRef.current.startH + delta);
      setEditorHeight(next);
    };

    const onUp = () => {
      resizeStateRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  /* ---------- auto-grow ---------- */
  useEffect(() => {
    if (!autoGrow || !textareaRef.current) return;
    const el = textareaRef.current;
    el.style.height = 'auto';
    el.style.height = `${Math.max(180, el.scrollHeight)}px`;
    setEditorHeight(el.scrollHeight);
  }, [form.content, autoGrow]);

  /* ---------- ESC untuk keluar fullscreen ---------- */
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  /* ---------- render ---------- */
  const body = (
    <>
        {/* ============================================================
       * 1.0 JUDUL
       * ============================================================ */}
        <Field label="1.0 Judul Snippet" required meta="UNIQUE_SLUG_COMPLIANT">
          <input
            type="text"
            maxLength={200}
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="clean_architecture_refactor.prompt"
            className="w-full h-11 px-3.5 bg-neutral-100 rounded-sm border border-zinc-300 text-neutral-900 text-base font-normal focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700"
          />
          <Hint>
            Gunakan format berkas eksplisit (.prompt, .ts, .md, .py) untuk
            auto-deteksi sintaksis.
          </Hint>
        </Field>

        {/* ============================================================
       * 2.0 TIPE SNIPPET
       * ============================================================ */}
        <Field
          label="2.0 Tipe Snippet"
          required
          meta="[ENUM: SNIPPETTYPE @DEFAULT(MARKDOWN)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = form.type === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('type', opt.value)}
                  className={`p-3 rounded-sm border text-left transition-colors ${isActive
                    ? 'bg-violet-100 border-blue-700'
                    : 'bg-neutral-100 border-zinc-200 hover:bg-zinc-50'
                    }`}
                >
                  <div className="flex justify-between items-center pb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${opt.accent}`} />
                      <span
                        className={`text-xs font-medium font-mono ${isActive ? 'text-indigo-900' : 'text-neutral-900'
                          }`}
                      >
                        {opt.label}
                      </span>
                    </div>
                    <span
                      className={`size-2 rounded-full ${isActive
                        ? 'bg-blue-700'
                        : 'border border-zinc-300 bg-transparent'
                        }`}
                    />
                  </div>
                  <p
                    className={`text-xs leading-4 ${isActive ? 'text-indigo-900' : 'text-zinc-500'
                      }`}
                  >
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </Field>

        {/* ============================================================
       * 3.0 FORMAT/BAHASA + KATEGORI
       * ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="3.0 Format / Bahasa"
            meta="[STRING?]"
            metaRight={
              <span className="text-green-800">AUTO-SYNCED</span>
            }
          >
            <input
              type="text"
              maxLength={30}
              value={form.language}
              onChange={(e) => update('language', e.target.value)}
              placeholder="markdown (LLM Standard System)"
              className="w-full h-10 px-4 bg-neutral-100 rounded-sm border border-zinc-300 text-neutral-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-700"
            />
          </Field>

          <Field
            label="Relasi Kategori"
            meta="[CATEGORY_ID?]"
            metaRight={
              <button
                type="button"
                onClick={() => {
                  /* TODO: buka modal buat kategori baru */
                }}
                className="text-blue-700 hover:underline"
              >
                + Baru
              </button>
            }
          >
            <select
              value={form.categoryId ?? ''}
              onChange={(e) => update('categoryId', e.target.value || null)}
              className="w-full h-12 px-4 bg-neutral-100 rounded-sm border border-zinc-300 text-neutral-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-700"
            >
              <option value="">— Tanpa Kategori —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* ============================================================
       * 4.0 DESKRIPSI
       * ============================================================ */}
        <Field
          label="4.0 Deskripsi Ringkas"
          meta="[STRING? MAX(250)]"
          metaRight={
            <span
              className={descRemaining < 0 ? 'text-red-600' : 'text-zinc-500'}
            >
              {form.description.length}/{MAX_DESCRIPTION} KARAKTER
            </span>
          }
        >
          <textarea
            value={form.description}
            onChange={(e) =>
              update('description', e.target.value.slice(0, MAX_DESCRIPTION))
            }
            rows={3}
            placeholder="Instruksi terstruktur untuk restrukturisasi modul monorepo TypeScript dan boundary context."
            className="w-full px-3 py-3 bg-neutral-100 rounded-sm border border-zinc-300 text-neutral-900 text-xs leading-5 focus:outline-none focus:ring-1 focus:ring-blue-700 resize-none"
          />
        </Field>

        {/* ============================================================
       * 5.0 KONTEN
       * ============================================================ */}
        <Field
          label="5.0 Konten Berkas (Content)"
          required
          meta="[TYPE: TEXT(REQUIRED)]"
          metaRight={
            <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 rounded-sm text-zinc-500">
              {contentStats.lines} BARIS · {contentStats.chars} CHAR · UTF-8
            </span>
          }
        >
          <div
            className="w-full bg-neutral-900 rounded-sm border border-zinc-300 overflow-hidden flex flex-col"
            style={{ height: editorHeight }}
          >
            {/* ============ Toolbar ============ */}
            <div className="h-9 px-3 bg-neutral-900 border-b border-zinc-500/40 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="size-2.5 bg-red-600/80 rounded-full" />
                <span className="size-2.5 bg-yellow-600/80 rounded-full" />
                <span className="size-2.5 bg-green-800/80 rounded-full" />
                <span className="ml-2 text-zinc-300 text-xs font-mono truncate">
                  BUFF: content.buffer.raw
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Auto-grow toggle */}
                <button
                  type="button"
                  onClick={() => setAutoGrow((v) => !v)}
                  title="Auto-grow saat mengetik"
                  className={`px-2 py-0.5 text-xs font-mono rounded-sm transition-colors ${autoGrow
                    ? 'bg-blue-700/30 text-blue-200'
                    : 'text-zinc-400 hover:bg-zinc-800'
                    }`}
                >
                  Auto
                </button>

                {/* Fullscreen toggle */}
                <button
                  type="button"
                  onClick={() => setFullscreen((v) => !v)}
                  title="Fullscreen (F11-like)"
                  className="px-2 py-0.5 text-zinc-300 text-xs font-mono hover:bg-zinc-800 rounded-sm"
                >
                  {fullscreen ? 'Keluar' : 'Luas'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    /* TODO: auto-format */
                  }}
                  className="px-2 py-0.5 text-zinc-300 text-xs font-mono hover:bg-zinc-800 rounded-sm"
                >
                  Format
                </button>

                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(form.content)}
                  className="px-2 py-0.5 text-zinc-300 text-xs font-mono hover:bg-zinc-800 rounded-sm"
                >
                  Salin
                </button>
              </div>
            </div>

            {/* ============ Editor body ============ */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Line numbers — sinkron dengan scroll */}
              <div
                ref={lineNumberRef}
                className="w-12 py-3 px-3 border-r border-zinc-500/30 flex flex-col items-end select-none overflow-hidden shrink-0"
              >
                {Array.from({ length: contentStats.lines }, (_, i) => (
                  <span
                    key={i}
                    className="text-zinc-500 text-xs font-mono leading-5"
                  >
                    {i + 1}
                  </span>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                onScroll={(e) => {
                  // sync scroll line numbers
                  if (lineNumberRef.current) {
                    lineNumberRef.current.scrollTop = e.currentTarget.scrollTop;
                  }
                }}
                onKeyDown={(e) => {
                  // Tab = 2 spasi (bukan pindah fokus)
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const el = e.currentTarget;
                    const start = el.selectionStart;
                    const end = el.selectionEnd;
                    const next =
                      form.content.slice(0, start) +
                      '  ' +
                      form.content.slice(end);
                    update('content', next);
                    requestAnimationFrame(() => {
                      el.selectionStart = el.selectionEnd = start + 2;
                    });
                  }
                }}
                spellCheck={false}
                placeholder="### ROLE DEFINITION
Anda bertindak sebagai Principal Software Architect.
Analisis struktur kode berikut dan petakan boundary domain
menurut prinsip Clean Architecture."
                className="flex-1 p-3 bg-neutral-900 text-zinc-100 text-xs font-mono leading-5 resize-none focus:outline-none placeholder:text-zinc-600 overflow-auto"
              />
            </div>

            {/* ============ Resize handle ============ */}
            <div
              onMouseDown={startResize}
              title="Drag untuk ubah tinggi"
              className="h-1.5 bg-neutral-800 hover:bg-blue-700/60 cursor-ns-resize transition-colors shrink-0"
            />
          </div>
        </Field>

        {/* ============================================================
       * 6.0 TAGS
       * ============================================================ */}
        <Field
          label="6.0 Daftar Tag"
          meta="[TYPE: STRING[] @DEFAULT([])]"
          metaRight={<span>TEKAN ENTER ATAU KOMA</span>}
        >
          <div className="min-h-14 p-2.5 bg-neutral-100 rounded-sm border border-zinc-300 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {form.tags.map((tag, idx) => {
                const isFirst = idx === 0;
                return (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1.5 h-6 pl-3 pr-2 rounded-full border text-xs font-mono uppercase ${isFirst
                      ? 'bg-violet-100 border-blue-700 text-indigo-900'
                      : 'bg-zinc-100 border-zinc-300 text-neutral-900'
                      }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${isFirst ? 'bg-blue-700' : 'bg-zinc-400'
                        }`}
                    />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => handleAddTag(tagInput)}
              placeholder="+ Tambah tag..."
              className="w-full min-w-32 py-1.5 bg-transparent text-zinc-900 text-xs focus:outline-none placeholder:text-zinc-400"
            />
          </div>
        </Field>

        {/* ============================================================
       * 7.0 STATUS FLAGS
       * ============================================================ */}
        <Field label="7.0 Status Flags" meta="[BOOLEAN ATTRIBUTES]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FlagCard
              checked={form.isFavorite}
              onChange={(v) => update('isFavorite', v)}
              icon={<Star className="w-3.5 h-3 text-yellow-600" />}
              title="Favoritkan Snippet"
              subtitle="Tandai untuk akses instan di bar cepat"
              code="isFavorite"
            />
            <FlagCard
              checked={form.isPinned}
              onChange={(v) => update('isPinned', v)}
              icon={<Pin className="w-3.5 h-3.5 text-blue-800" />}
              title="Sematkan ke Atas"
              subtitle="Selalu render di posisi teratas daftar"
              code="isPinned"
            />
          </div>
        </Field>

        {/* ============================================================
       * ERROR
       * ============================================================ */}
        {error && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-sm text-red-700 text-xs font-mono">
            {error}
          </div>
        )}

        {/* ============================================================
       * FOOTER / ACTION
       * ============================================================ */}
        <div className="pt-6 border-t border-zinc-200 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="h-9 px-4 bg-white border border-zinc-300 rounded-sm text-neutral-900 text-xs hover:bg-zinc-50 disabled:opacity-50"
          >
            Batal <span className="text-zinc-400 font-mono ml-1">[ESC]</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="h-11 px-6 bg-blue-700 hover:bg-blue-800 text-white rounded-sm text-xs font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Simpan Snippet
              </>
            )}
          </button>
        </div>
    </>
  );

  if (embedded) return <div className="flex flex-col gap-7">{body}</div>;

  return (
    <div className="flex w-full max-w-8xl overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto p-5 w-full p-8 flex flex-col gap-7 bg-white">
        {body}
      </div>
    </div>
  );
}

/* ============================================================
 * SUB-COMPONENTS
 * ============================================================ */

interface FieldProps {
  label: string;
  required?: boolean;
  meta?: string;
  metaRight?: React.ReactNode;
  children: React.ReactNode;
}

function Field({ label, required, meta, metaRight, children }: FieldProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-start gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="size-2 bg-blue-700 shrink-0" />
          <span className="text-neutral-900 text-xs font-mono font-medium uppercase tracking-wide">
            {label}
            {required && ' *'}
          </span>
          {meta && (
            <span className="text-zinc-400 text-xs font-mono uppercase tracking-wide">
              {meta}
            </span>
          )}
        </div>
        {metaRight && (
          <span className="text-zinc-400 text-xs font-mono uppercase tracking-wide">
            {metaRight}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-zinc-500 text-xs font-mono leading-4">{children}</p>
  );
}

interface FlagCardProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  code: string;
}

function FlagCard({
  checked,
  onChange,
  icon,
  title,
  subtitle,
  code,
}: FlagCardProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`p-3 rounded-sm border flex items-start gap-3 text-left transition-colors ${checked
        ? 'bg-violet-100 border-blue-700'
        : 'bg-neutral-100 border-zinc-200 hover:bg-zinc-50'
        }`}
    >
      <span
        className={`mt-0.5 size-3 rounded-sm shrink-0 flex items-center justify-center ${checked ? 'bg-blue-700' : 'bg-white border border-neutral-500'
          }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="w-2 h-2 text-white fill-current">
            <path d="M4.5 8.5L2 6l1-1 1.5 1.5L9 3l1 1z" />
          </svg>
        )}
      </span>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-neutral-900 text-xs font-medium">
            {title}
          </span>
        </div>
        <span className="text-zinc-500 text-xs font-mono leading-3">
          {subtitle}
        </span>
        <span className="text-zinc-400 text-[10px] font-mono">({code})</span>
      </div>
    </button>
  );
}

/* ============================================================
 * PAGE (client) — fetch kategori + submit ke API
 * ============================================================ */

function NewSnippetSkeleton() {
  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-zinc-200 rounded w-1/3" />
          <div className="h-40 bg-white border border-zinc-200 rounded-xl" />
        </div>
      </main>
    </div>
  );
}

function NewSnippetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId");
  const [categories, setCategories] = useState<Category[]>([]);

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

  const handleSubmit = async (data: SnippetFormData) => {
    await CreateSnippets({
      title: data.title,
      description: data.description.trim() || undefined,
      content: data.content,
      type: data.type,
      categoryId: data.categoryId || undefined,
      tags: data.tags,
      language: data.language.trim() || undefined,
    });
    router.push("/dashboard/snippets");
  };

  return (
    <SnippetForm
      categories={categories}
      initialData={{ categoryId: initialCategoryId }}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}

export default function NewSnippetPage() {
  return (
    <Suspense fallback={<NewSnippetSkeleton />}>
      <NewSnippetContent />
    </Suspense>
  );
}