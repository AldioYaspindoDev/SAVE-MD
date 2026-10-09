"use client"

import Image from "next/image"
import Link from "next/link"

interface NavbarProps {
  isLoggedIn?: boolean;
}

export default function Navbar({ isLoggedIn = false }: NavbarProps) {

  return (
    <header className="w-full bg-white border-b border-zinc-200">
      <div className="w-full h-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded flex justify-center items-center overflow-hidden">
              <Image 
                width={32}
                height={32}
                src="/Images/VaultsLogo.jpeg"
                alt="WAYDEV Logo"
                className="object-cover"
              />
            </div>
            <span className="text-neutral-900 text-base font-bold">VAULTS</span>
            <div className="pl-2 border-l border-zinc-200">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">V1.0</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/" className="text-neutral-900 text-sm font-medium hover:text-indigo-600 transition-colors">Home</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            /* Tombol Biru Dashboard jika sudah login */
            <Link 
              href="/dashboard"
              className="px-4 py-1.5 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Dashboard
            </Link>
          ) : (
            /* Tombol Masuk & Register jika belum login */
            <>
              <Link
                href="/auth/login" 
                className="px-4 py-1.5 rounded text-neutral-900 text-sm font-medium border border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                Masuk
              </Link>
              <Link 
                href="/auth/register"
                className="px-4 py-1.5 rounded bg-indigo-900 text-white text-sm font-medium hover:bg-indigo-800 transition-colors"
              >
                Mulai Sekarang
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}