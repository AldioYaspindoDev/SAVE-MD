"use client";

import Link from "next/link";
import { FolderPlus, Code2, Plus, Sparkles } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-zinc-50/50 flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full flex flex-col items-center text-center space-y-8">
          
          {/* Header / Empty State Info */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Simpan & Kelola Resource Anda
            </h1>
            <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
              Pilih aksi di bawah untuk membuat pengelompokan kategori baru atau menyimpan potongan kode pertama Anda.
            </p>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            
            {/* Button 1: Tambah Kategori */}
            <Link
              href="/dashboard/categories/new"
              className="group relative flex flex-col items-center justify-center p-8 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200"
            >
              <div className="size-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FolderPlus className="size-6" />
              </div>
              <h2 className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                Tambah Kategori
              </h2>
              <p className="text-xs text-zinc-400 mt-1 text-center">
                Buat direktori baru untuk mengelompokkan kode
              </p>
              <span className="mt-4 text-[11px] font-mono font-medium text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="size-3" /> Buat Kategori
              </span>
            </Link>

            {/* Button 2: Tambah Snippet */}
            <Link
              href="/dashboard/snippets/new"
              className="group relative flex flex-col items-center justify-center p-8 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200"
            >
              <div className="size-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Code2 className="size-6" />
              </div>
              <h2 className="text-sm font-semibold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                Tambah Snippet
              </h2>
              <p className="text-xs text-zinc-400 mt-1 text-center">
                Simpan potongan kode, prompt, atau rule
              </p>
              <span className="mt-4 text-[11px] font-mono font-medium text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="size-3" /> Buat Snippet
              </span>
            </Link>

          </div>

        </div>
      </main>
    </div>
  );
}