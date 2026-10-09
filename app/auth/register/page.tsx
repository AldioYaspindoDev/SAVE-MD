"use client"

import React, { useState } from 'react';
import {
  // Github, 
  Copy,
  Check,
  ArrowRight,
  FileText,
  Code2,
  Terminal
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api-error';
import { registerUser } from '@/service/auth/auth.service';

export default function WorkspaceOnboarding() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    workspaceName: '',
    password: ''
  });

  const cliCommand = "npx vault-cli fetch my-snippets";

  const handleCopy = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerUser({
        email: formData.email,
        name: formData.fullName,
        password: formData.password
      });
      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Terjadi kesalahan, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 md:p-8 font-sans antialiased text-slate-800">
      {/* Container Utama Card */}
      <div className="w-full max-w-[1100px] bg-white border border-slate-200 shadow-lg rounded-sm overflow-hidden">

        {/* Header Status Ringkas */}
        <header className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <span className="font-semibold text-slate-700">CODE & MARKDOWN VAULT</span>
            <span className="text-slate-300">|</span>
            <span>PENYIMPANAN TEKS SILENT</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span>STATUS: <strong className="text-slate-700 font-medium">AKTIF</strong></span>
          </div>
        </header>

        {/* Content Grid: Form Kiri & Info Penyimpanan Kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">

          {/* KOLOM KIRI: Form Pendaftaran */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between border-r border-slate-200 bg-white">
            <div className="max-w-xl mx-auto w-full space-y-6">

              {/* Header Judul */}
              <div className="space-y-2">
                <div className='flex items-center gap-2'>
                  <Link
                    href="/"
                    className="inline-block text-slate-700 text-[11px] font-mono font-medium rounded-xs">
                    <Image
                      width={30}
                      height={30}
                      alt='Logo'
                      src="/Images/VaultsLogo.jpeg"
                      className='rounded'
                    />
                  </Link>

                  <h1 className='text-bold'>Vaults</h1>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  Simpan Catatan, Prompt <br />
                  & Snippet Kode.
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Platform sederhana untuk mengorganisir dokumen Markdown (`.md`), koleksi prompt teks, dan potongan kode favorit Anda di satu tempat.
                </p>
              </div>

              {/* Tombol Akses Cepat */}
              {/* <div className="space-y-2.5">
                <button
                  type="button"
                  className="w-full h-10 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xs flex items-center justify-between transition-colors text-xs font-medium text-slate-800"
                >
                  <div className="flex items-center gap-2.5"> */}
                    {/* <Github className="w-4 h-4 text-slate-900" /> */}
                    {/* <span>Masuk dengan Akun GitHub</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  type="button"
                  className="w-full h-10 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xs flex items-center justify-between transition-colors text-xs font-medium text-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Masuk dengan Akun Google</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div> */}

              {/* Pembatas */}
              {/* <div className="relative flex items-center justify-center my-3">
                <div className="w-full border-t border-slate-200" />
                <span className="absolute px-3 bg-white text-[11px] font-mono text-slate-400 uppercase">
                  Atau Buat Akun Manual
                </span>
              </div> */}

              {/* Form Manual */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Nama */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-medium text-slate-600 uppercase">
                    Nama / Alias
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xs text-xs font-sans text-slate-900 focus:outline-none focus:border-slate-800"
                    placeholder="Nama Anda"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-medium text-slate-600 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xs text-xs font-sans text-slate-900 focus:outline-none focus:border-slate-800"
                    placeholder="email@domain.com"
                  />
                </div>

                {/* Kata Sandi */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-medium text-slate-600 uppercase">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xs text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-800"
                    placeholder="Minimal 8 karakter"
                  />
                </div>

                {error && (
                  <p className="text-[11px] font-mono text-red-600 bg-red-50 border border-red-200 rounded-xs px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Tombol Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-blue-700 hover:bg-slate-800 text-white font-medium text-xs rounded-xs shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Mendaftar...' : 'Registrasi Akun'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Login Footer */}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500">Sudah punya workspace?</span>
                <a href="/auth/login" className="text-slate-900 font-medium hover:underline">
                  Masuk di sini
                </a>
              </div>

            </div>
          </div>

          {/* KOLOM KANAN: Detail Fitur Penyimpanan */}
          <div className="lg:col-span-5 p-6 sm:p-10 bg-blue-700 text-white flex flex-col justify-between">

            <div className="space-y-6">

              {/* Header Panel */}
              <div className="pb-3 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-mono font-medium text-slate-400 uppercase">
                  Yang Dapat Anda Simpan
                </span>
                <span className="text-[10px] font-mono text-slate-400">FORMAT BERSIH</span>
              </div>

              {/* List Tipe File yang Disimpan */}
              <div className="space-y-3.5">

                {/* 1. Markdown (.md) */}
                <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-200">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>01 / Dokumen Markdown (.md)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">
                    Simpan catatan teknis, dokumentasi proyek, list tugas, atau panduan singkat tanpa format yang rumit.
                  </p>
                </div>

                {/* 2. Prompt Teks */}
                <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-200">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span>02 / Koleksi Prompt</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">
                    Kumpulkan instruksi teks, template prompt, dan catatan sintaks khusus untuk Anda gunakan kembali dengan cepat.
                  </p>
                </div>

                {/* 3. Snippet Kode */}
                <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-200">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <span>03 / Snippet Kode</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">
                    Arsip potongan kode (JS, Python, SQL, Shell Script, dll) yang sering dipakai agar tidak perlu diketik ulang.
                  </p>
                </div>

              </div>

              {/* Ringkasan Ringkas */}
              <div className="grid grid-cols-3 bg-slate-800/40 border border-slate-800 rounded-xs text-center divide-x divide-slate-800">
                <div className="p-2.5">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">FORMAT</span>
                  <span className="text-sm font-mono text-slate-200 font-semibold mt-0.5 block">.MD / TEXT</span>
                </div>
                <div className="p-2.5">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">SALIN</span>
                  <span className="text-sm font-mono text-slate-200 font-semibold mt-0.5 block">1-KLIK</span>
                </div>
                <div className="p-2.5">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">AKSES</span>
                  <span className="text-sm font-mono text-slate-200 font-semibold mt-0.5 block">WEB / CLI</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}