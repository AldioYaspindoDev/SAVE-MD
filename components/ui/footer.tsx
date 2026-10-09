import React from "react";
import Link from "next/link";
import Image from "next/image";
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  operationalStatus?: string;
  copyrightText?: string;
  statusText?: string;
  systemId?: string;
  columns?: FooterColumn[];
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "PRODUK",
    links: [
      { label: "Fitur", href: "/fitur" },
      { label: "Cara Pakai", href: "/cara-pakai" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "SUMBER DAYA",
    links: [
      { label: "Dokumentasi", href: "/docs" },
      { label: "Panduan", href: "/panduan" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "DATA",
    links: [
      { label: "Penyimpanan Lokal", href: "/data/lokal" },
      { label: "Ekspor", href: "/data/ekspor" },
      { label: "Backup", href: "/data/backup" },
    ],
  },
  {
    title: "LAINNYA",
    links: [
      { label: "Lisensi", href: "/lisensi" },
      { label: "Privasi", href: "/privasi" },
      { label: "Kontak", href: "/kontak" },
    ],
  },
];

/**
 * Technical Modular Footer Component untuk Next.js App Router (RSC)
 */
export default function Footer({
  brandName = "VAULT",
  brandDescription = "Tempat penyimpanan pribadi untuk kode, prompt, dan catatan.",
  operationalStatus = "TERSEDIA",
  copyrightText = "© 2026 VAULT.",
  statusText = "STATUS: NORMAL",
  systemId = "VERSI 0.1",
  columns = DEFAULT_COLUMNS,
}: FooterProps) {
  return (
    <footer className="w-full max-w-8xl mx-auto px-4 sm:px-8 md:px-14 bg-white border-t border-zinc-200 font-sans">
      <div className="w-full border-x border-zinc-200 flex flex-col">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 border-b border-zinc-200">
          {/* Brand & System Status Column */}
          <div className="p-4 sm:p-6 lg:col-span-1 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/Images/VaultsLogo.jpeg"
                  alt={brandName}
                  height={30}
                  width={30}
                />

                
                <span className="text-base font-medium text-neutral-900 tracking-tight">
                  {brandName}
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {brandDescription}
              </p>
            </div>

            {/* Live Status Badge */}
            <div className="flex items-center gap-2 font-mono text-xs font-medium text-emerald-800 tracking-wide pt-2">
              <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full shrink-0" />
              <span>{operationalStatus}</span>
            </div>
          </div>

          {/* Navigation Link Columns */}
          {columns.map((col, index) => (
            <div key={index} className="p-4 sm:p-6 flex flex-col gap-3">
              <h3 className="font-mono text-xs font-medium uppercase text-zinc-400 tracking-wide">
                {col.title}
              </h3>
              <nav aria-label={col.title}>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-xs font-normal text-zinc-500 hover:text-neutral-900 transition-colors leading-relaxed block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="px-4 sm:px-6 py-3 bg-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-zinc-500">
          <p className="tracking-wide uppercase text-center sm:text-left">
            {copyrightText}
          </p>
          <div className="flex items-center gap-4 text-zinc-400 tracking-wide shrink-0">
            <span>{statusText}</span>
            <span>{systemId}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}