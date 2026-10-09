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
  title = "Mulai rapihkan aset kerja AI Anda hari ini.",
  description = "Bergabunglah dengan ribuan insinyur perangkat lunak yang tidak lagi mengulang mengetik prompt panjang yang sama setiap hari.",
  primaryAction = { label: "Coba Sekarang", href: "/auth/register" },
}: CtaSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto p-4 sm:p-8 md:p-14 bg-white border-b border-zinc-200">
      <div className="w-full p-6 sm:p-10 md:p-12 bg-neutral-100 border border-zinc-200 rounded-xs flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Content Area */}
        <div className="max-w-2xl flex flex-col gap-3">

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
              className="h-11 px-20 bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white text-xs font-medium rounded-xs transition-colors flex items-center justify-center text-center tracking-wide"
            >
              {primaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}