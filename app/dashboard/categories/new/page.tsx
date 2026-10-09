"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Sparkles,
  Cpu,
  Layers,
  Database,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { CreateCategory } from '@/service/category/category.service';
import { ApiError } from '@/lib/api-error';
import { slugify } from '@/lib/utils/slug';
import Sidebar from '@/components/ui/sidebar';

const COLOR_OPTIONS = [
  { name: 'Cobalt', hex: '#2B3FD6' },
  { name: 'Gold', hex: '#C99A1E' },
  { name: 'Emerald', hex: '#2F6B45' },
  { name: 'Indigo', hex: '#3A4FE0' },
  { name: 'Obsidian', hex: '#111114' },
];

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

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export default function CreateCategoryForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "",
    icon: ""
  });

  const slug = slugify(formData.name);
  const colorValue = HEX_COLOR.test(formData.color) ? formData.color : "#000000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const name = formData.name.trim();
    if (!name) {
      setError("Nama wajib diisi");
      return;
    }
    if (!slug) {
      setError("Nama harus mengandung huruf atau angka");
      return;
    }

    let color = formData.color.trim();
    if (color && !color.startsWith("#")) color = "#" + color;
    if (color && !HEX_COLOR.test(color)) {
      setError("Format warna harus hex #RRGGBB");
      return;
    }

    const icon = formData.icon.trim();
    if (icon.length > 10) {
      setError("Ikon maksimal 10 karakter");
      return;
    }

    setLoading(true);
    try {
      await CreateCategory({
        name,
        description: formData.description.trim() || undefined,
        color: color || undefined,
        icon: icon || undefined
      });
      router.push('/dashboard/categories');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Terjadi kesalahan, coba lagi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

          {/* Form Container */}
          <div className="p-8 md:p-10 flex flex-col gap-8 flex-1 overflow-y-auto min-h-0">

            {/* Header Section */}
            <div className="pb-6 border-b border-zinc-200 flex flex-col gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
                  Buat Kategori Taksonomi Baru
                </h1>
                <p className="mt-1 text-sm text-zinc-500 max-w-2xl leading-relaxed">
                  Definisikan partisi taksonomi untuk mengindeks instruksi, system prompts, dan snippet kode dalam ekosistem Vault.
                </p>
              </div>
            </div>

            {/* Input Fields */}
            <div className="flex flex-col gap-6">

              {/* 1.0 NAMA KATEGORI */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center font-mono text-xs">
                  <label htmlFor="category-name" className="font-semibold text-neutral-900 uppercase tracking-wider">
                    1.0 NAMA KATEGORI <span className="text-red-600">*</span>
                  </label>
                  <span className="text-zinc-400 font-medium">{formData.name.length}/50 KARAKTER</span>
                </div>
                <input
                  id="category-name"
                  type="text"
                  required
                  maxLength={50}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama kategori..."
                  className="w-full h-10 px-3 py-2 bg-white text-neutral-900 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm font-medium"
                />
                <p className="text-xs text-zinc-500 font-mono">
                  Gunakan nama entitas deskriptif standar untuk pengelompokan repositori global.
                </p>
              </div>

              {/* 2.0 SLUG REPOSITORI (AUTO DARI NAMA) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center font-mono text-xs">
                  <label htmlFor="category-slug" className="font-semibold text-neutral-900 uppercase tracking-wider">
                    2.0 SLUG REPOSITORI
                  </label>
                  <span className="text-zinc-400 font-medium">AUTO-GENERATED DARI NAMA</span>
                </div>
                <div className="flex items-center bg-zinc-50 border border-zinc-300 rounded overflow-hidden">
                  <span className="px-3 py-2 text-xs font-mono text-zinc-500 bg-zinc-100 border-r border-zinc-300 select-none">
                    /categories/
                  </span>
                  <input
                    id="category-slug"
                    type="text"
                    readOnly
                    value={slug}
                    placeholder="otomatis mengikuti nama..."
                    className="flex-1 h-10 px-3 bg-transparent text-neutral-900 font-mono text-xs font-medium focus:outline-none"
                  />
                  <span className="px-3 text-[10px] font-mono text-zinc-400 select-none">AUTO</span>
                </div>
                <p className="text-xs text-zinc-500 font-mono">
                  Slug dihitung ulang oleh server dari nama kategori (unique index / URI safe).
                </p>
              </div>

              {/* 3.0 RINGKASAN TAKSONOMI */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center font-mono text-xs">
                  <label htmlFor="category-description" className="font-semibold text-neutral-900 uppercase tracking-wider">
                    3.0 RINGKASAN TAKSONOMI (OPSIONAL)
                  </label>
                  <span className="text-zinc-400 font-medium">
                    {formData.description.length}/200 KARAKTER
                  </span>
                </div>
                <textarea
                  id="category-description"
                  rows={3}
                  maxLength={200}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat mengenai kategori..."
                  className="w-full p-3 bg-white text-neutral-900 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs leading-relaxed resize-none"
                />
              </div>

              {/* 4.0 AKSEN WARNA TAKSONOMI */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center font-mono text-xs">
                  <label className="font-semibold text-neutral-900 uppercase tracking-wider">
                    4.0 AKSEN WARNA TAKSONOMI
                  </label>
                  <span className="text-zinc-400 font-medium">PRISMA::HEX_COLOR_TOKEN</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = formData.color.trim().toUpperCase() === c.hex.toUpperCase();
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c.hex })}
                        className={`flex items-center gap-2.5 p-2 rounded border transition-all text-left ${isSelected
                          ? 'border-blue-700 bg-blue-50/50 ring-1 ring-blue-700'
                          : 'border-zinc-300 bg-white hover:border-zinc-400'
                          }`}
                      >
                        <span
                          className="size-3.5 rounded-full shrink-0 border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="flex flex-col font-mono">
                          <span className="text-xs font-medium text-neutral-900 leading-none">{c.name}</span>
                          <span className="text-[10px] text-zinc-500 mt-1">{c.hex}</span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Dynamic HEX Input */}
                  <div className="flex items-center gap-2 p-1.5 bg-zinc-50 border border-zinc-300 rounded">
                    <input
                      type="color"
                      aria-label="Pilih warna"
                      value={colorValue}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="size-6 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <div className="flex flex-col font-mono overflow-hidden">
                      <span className="text-[10px] text-zinc-400 uppercase leading-none">HEX</span>
                      <input
                        type="text"
                        aria-label="Hex color"
                        maxLength={7}
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#2B3FD6"
                        className="text-xs font-medium text-neutral-900 bg-transparent focus:outline-none w-full uppercase mt-0.5"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 font-mono">
                  Pilih preset, gunakan color picker, atau ketik hex code manual (contoh: #2B3FD6). Kosongkan untuk tanpa warna.
                </p>
              </div>

              {/* 5.0 IKON REPRESENTASI VISUAL */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center font-mono text-xs">
                  <label htmlFor="category-icon" className="font-semibold text-neutral-900 uppercase tracking-wider">
                    5.0 IKON REPRESENTASI VISUAL
                  </label>
                  <span className="text-zinc-400 font-medium">MATERIAL_SYMBOLS_OUTLINED</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {ICON_OPTIONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = formData.icon.trim() === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.id })}
                        className={`flex flex-col items-center justify-center p-2.5 rounded border transition-all gap-1.5 ${isSelected
                          ? 'border-blue-700 bg-blue-50/50 ring-1 ring-blue-700 text-blue-700'
                          : 'border-zinc-300 bg-white hover:border-zinc-400 text-zinc-600'
                          }`}
                      >
                        <IconComp className="size-4" />
                        <span className="text-[10px] font-mono leading-none">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                <input
                  id="category-icon"
                  type="text"
                  maxLength={10}
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Atau ketik nama ikon manual... (maks 10 karakter)"
                  className="w-full h-10 px-3 bg-white text-neutral-900 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono"
                />
                <p className="text-xs text-zinc-500 font-mono">
                  Klik preset atau ketik id ikon sendiri. Pilihan preset otomatis terisi ke kolom di atas.
                </p>
              </div>

            </div>
          </div>

          {/* Footer / Actions Bar */}
          <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shrink-0">
            <div className="flex items-center gap-3 text-zinc-500">
              {error ? (
                <span className="text-red-600 font-medium">{error}</span>
              ) : (
                <>
                  <span className="px-1.5 py-0.5 bg-zinc-200 text-neutral-800 rounded text-[11px]">
                    ESC = Batal
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 font-sans">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 bg-white border border-zinc-300 text-neutral-800 rounded hover:bg-zinc-100 text-xs font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-neutral-800 text-xs font-medium flex items-center gap-2 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Menyimpan...' : 'Simpan Kategori'}</span>
                <span className="px-1 py-0.5 bg-white/20 rounded text-[10px] font-mono">⌘S</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
