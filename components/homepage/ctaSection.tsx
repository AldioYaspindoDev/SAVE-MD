import React from "react";
import Link from "next/link";

export interface CtaAction {
  label: string;
  href: string;
}

export interface CtaSectionProps {
  badgeText?: string;
  badgeSubtext?: string;
  title?: string;
  description?: string;
  primaryAction?: CtaAction;
  secondaryAction?: CtaAction;
}

/**
 * Call-to-Action Section Component untuk Next.js App Router (RSC)
 */
export default function CtaSection({
  badgeText = "DEPLOYMENT READY",
  badgeSubtext = "INSTALASI DALAM 60 DETIK",
  title = "Mulai rapihkan aset kerja AI Anda hari ini.",
  description = "Bergabunglah dengan ribuan insinyur perangkat lunak yang tidak lagi mengulang mengetik prompt panjang yang sama setiap hari.",
  primaryAction = { label: "Daftar Gratis", href: "/register" },
  secondaryAction = { label: "Lihat Demo Interaktif", href: "/demo" },
}: CtaSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto p-4 sm:p-8 md:p-14 bg-white border-b border-zinc-200">
      <div className="w-full p-6 sm:p-10 md:p-12 bg-neutral-100 border border-zinc-200 rounded-xs flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Content Area */}
        <div className="max-w-2xl flex flex-col gap-3">
          {/* Badge & Meta Header */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2 py-0.5 bg-violet-100 border border-blue-700/30 rounded-xs text-indigo-900 font-mono text-xs font-medium uppercase tracking-wide">
              {badgeText}
            </span>
            <span className="font-mono text-xs font-medium text-zinc-400 uppercase tracking-wide">
              {badgeSubtext}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-900 tracking-tight leading-tight">
            {title}
          </h2>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed">
            {description}
          </p>
        </div>

        {/* Right CTA Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="h-11 px-6 bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white text-xs font-medium rounded-xs transition-colors flex items-center justify-center text-center tracking-wide"
            >
              {primaryAction.label}
            </Link>
          )}

          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="h-11 px-6 bg-white hover:bg-neutral-50 active:bg-neutral-100 border border-zinc-300 text-neutral-900 text-xs font-normal rounded-xs transition-colors flex items-center justify-center text-center tracking-wide"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}