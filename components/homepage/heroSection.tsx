export default function HeroSection() {
    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
            <div className="relative w-full bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-950 p-8 lg:p-12 min-h-[550px] flex flex-col justify-between">
                
                {/* Top Bar (Status & Tags) */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-4">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full">
                            <div className="w-1.5 h-1.5 bg-blue-800 rounded-full" />
                            <span className="text-indigo-900 text-xs font-bold uppercase tracking-wide">Prompt Coding</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/30">
                            <div className="w-1.5 h-1.5 bg-green-800 rounded-full" />
                            <span className="text-white text-xs font-medium uppercase tracking-wide">Rules .MD</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/30">
                            <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                            <span className="text-white text-xs font-medium uppercase tracking-wide">UI Snippets</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/30">
                            <div className="w-1.5 h-1.5 bg-white/70 rounded-full" />
                            <span className="text-white text-xs font-medium uppercase tracking-wide">System Prompt</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-start gap-6 max-w-3xl py-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded border border-zinc-200">
                        <div className="w-1.5 h-1.5 bg-green-800 rounded-full" />
                        <span className="text-zinc-600 text-xs font-bold tracking-wide uppercase">Your code. Your prompts. Your rules. Your vault.</span>
                    </div>

                    <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        Arsip untuk Aset<br className="hidden md:block" /> Coding AI Anda.
                    </h1>

                    <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl">
                        Platform pribadi untuk mengelola prompt LLM, spesifikasi rules <span className="inline-block px-1.5 py-0.5 bg-violet-100 text-indigo-900 rounded font-bold text-sm mx-1">.md</span>, dan snippet UI dengan instan.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <button className="px-6 py-3 bg-neutral-900 text-white text-sm font-bold rounded hover:bg-neutral-800 transition-colors">
                            Jelajahi Vault
                        </button>
                        <button className="px-6 py-3 bg-white text-neutral-900 text-sm font-bold rounded border border-zinc-300 hover:bg-zinc-50 transition-colors">
                            Dokumentasi API
                        </button>
                    </div>
                </div>

                {/* Bottom Bar / CLI Hint */}
                {/* <div className="bg-white rounded p-3 flex flex-wrap items-center justify-between gap-4 mt-auto">
                    <div className="flex items-center flex-wrap gap-3">
                        <span className="px-2 py-1 bg-violet-100 text-indigo-900 text-xs font-bold uppercase rounded">CLI Tool</span>
                        <span className="text-indigo-900 text-sm font-medium">Buka Vault langsung dari terminal kerja Anda:</span>
                        <code className="px-2 py-1 bg-zinc-100 text-neutral-900 text-sm font-bold rounded">
                            npx vault-cli@latest fetch #0842
                        </code>
                    </div>
                    <button className="text-blue-800 text-xs font-bold uppercase tracking-wide hover:text-blue-600 transition-colors flex items-center gap-1">
                        Buka Terminal / CLI <span aria-hidden="true">&rarr;</span>
                    </button>
                </div> */}

            </div>
        </section>
    )
}