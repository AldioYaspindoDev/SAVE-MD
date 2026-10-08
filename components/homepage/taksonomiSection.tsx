export interface TaxonomyCategory {
    id: string;
    categoryNumber: string;
    title: string;
    description: string;
    gradientClass: string;
    dotColorClass: string;
    presets: string[];
    metaLabel: string;
    metaValue: string;
    archiveCount: number;
    archiveLabel: string;
}

export default function TaksonomiSection() {

    const TAXONOMY_DATA: TaxonomyCategory[] = [
        {
            id: "prompt-coding",
            categoryNumber: "KATEGORI 01",
            title: "Prompt Coding & Agen",
            description:
                "Instruksi terstruktur untuk codegen bebas halusinasi dengan format output deterministik.",
            gradientClass: "from-amber-600 to-amber-700",
            dotColorClass: "bg-amber-600",
            presets: [
                "Optimasi Query PostgreSQL EXPLAIN ANALYZE",
                "Generator Next.js 15 Server Action Safe Handler",
                "Refactoring TypeScript Strict Mode AST",
            ],
            metaLabel: "CONTOH TEMPLATE VARIABEL:",
            metaValue:
                '"Analisis skema {{table}} lalu generate Zod validator dengan validasi email regex RFC5322."',
            archiveCount: 184,
            archiveLabel: "PROMPT",
        },
        {
            id: "ui-snippets",
            categoryNumber: "KATEGORI 02",
            title: "Snippet UI & Komponen",
            description:
                "Komponen frontend modular bersih tanpa bloated dependency siap tempel ke workspace.",
            gradientClass: "from-indigo-600 to-blue-800",
            dotColorClass: "bg-blue-600",
            presets: [
                "Navigasi Header Sticky dengan Border Hairline 1px",
                "Data Table Monospace dengan Sort Column Header",
                "Dialog Overlay Minimalis dengan Keyboard Escape",
            ],
            metaLabel: "DESIGN TOKENS INTEGRASI:",
            metaValue: '"Tokens CSS: #111114, #2B3FD6, #E2E2E6, 1px collapsed borders."',
            archiveCount: 142,
            archiveLabel: "SNIPPET",
        },
        {
            id: "rules-spec",
            categoryNumber: "KATEGORI 03",
            title: "Rules .md & Spec Doc",
            description:
                "File instruksi sistem untuk memandu Claude, Cursor, dan Copilot agar patuh konvensi tim.",
            gradientClass: "from-emerald-800 to-emerald-900",
            dotColorClass: "bg-emerald-700",
            presets: [
                "Konvensi Unit Testing Vitest & Test Coverage 90%",
                "Pedoman Larangan Any & Type-safety TypeScript",
                "Protokol Arsitektur Folder Screaming DDD",
            ],
            metaLabel: "TARGET SYNC DIREKTORI:",
            metaValue: "./.cursorrules  |  ./.github/copilot-instructions.md",
            archiveCount: 98,
            archiveLabel: "RULES",
        },
    ];


    return (
        <section className="w-full border-b border-zinc-200">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-start px-4 py-14 sm:px-6 lg:px-8">
                {/* Top Header Bar */}
                <header className="flex items-center justify-between px-6 py-4 bg-neutral-100 border-b border-zinc-200 font-mono text-xs font-medium tracking-wide">
                    <div className="flex items-center gap-2 text-neutral-900">
                        <span className="w-2 h-2 bg-neutral-900 rounded-xs" />
                        <span className="uppercase">TAKSONOMI ARSIP RESMI</span>
                    </div>
                    <div className="text-zinc-400 uppercase">KLASIFIKASI 3-PILAR</div>
                </header>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
                    {TAXONOMY_DATA.map((item) => (
                        <div key={item.id} className="flex flex-col justify-between">
                            {/* Main Content Area */}
                            <div>
                                {/* Category Gradient Header */}
                                <div
                                    className={`p-6 bg-gradient-to-br ${item.gradientClass} border-b border-zinc-200 text-white flex flex-col gap-2`}
                                >
                                    <span className="font-mono text-xs font-medium uppercase text-white/80 tracking-wide">
                                        {item.categoryNumber}
                                    </span>
                                    <h3 className="text-2xl lg:text-3xl font-medium leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-white/90 leading-relaxed pt-1">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Category Body */}
                                <div className="p-6 flex flex-col gap-6">
                                    {/* Presets List */}
                                    <div className="flex flex-col gap-2.5">
                                        <span className="font-mono text-xs font-medium text-zinc-400 uppercase tracking-wide">
                                            PRESET REKOMENDASI
                                        </span>
                                        <ul className="flex flex-col gap-2">
                                            {item.presets.map((preset, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2.5 p-2 bg-neutral-100 rounded-xs border border-zinc-200 text-xs text-neutral-900"
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.dotColorClass}`}
                                                    />
                                                    <span className="line-clamp-2 leading-snug">{preset}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Variable/Token Snippet Box */}
                                    <div className="p-3 bg-neutral-100 rounded-xs border border-zinc-200 flex flex-col gap-1.5 font-mono text-xs">
                                        <span className="text-zinc-400 font-medium tracking-wide uppercase">
                                            {item.metaLabel}
                                        </span>
                                        <p className="text-neutral-900 font-medium leading-relaxed break-words">
                                            {item.metaValue}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Button Action */}
                            <div className="px-6 pb-6 pt-2">
                                <button
                                    type="button"
                                    className="w-full h-9 px-4 bg-white hover:bg-neutral-100 active:bg-neutral-200 rounded-xs border border-zinc-300 text-center font-mono text-xs font-medium text-neutral-900 transition-colors tracking-wide cursor-pointer"
                                >
                                    LIHAT ARSIP {item.archiveLabel} ({item.archiveCount}) &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};