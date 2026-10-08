const results = [
  { title: "Prompt: Generator Zod Schema dari SQL DDL", sub: "Prompt Coding / PostgreSQL", key: "⌘1" },
  { title: "Tailwind v4 Clean Bento Grid Template", sub: "UI Snippet / CSS Architecture", key: "⌘2" },
  { title: "Workflow: Multi-agent PR Review Protocol", sub: "Agent Workflows / CI Automation", key: "⌘3" },
];

function FeatureNumber({ no }: { no: string }) {
  return (
    <div className="inline-flex items-start rounded-xs bg-violet-100 px-2 pt-px pb-0.5 outline outline-1 outline-offset-[-1px] outline-blue-700/30">
      <span className="text-xs font-medium font-mono leading-3 tracking-wide text-blue-700">{no}</span>
    </div>
  );
}

function CodeChip({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-xs bg-zinc-100 px-1.5 py-0.5 text-xs font-mono font-medium text-neutral-900">
      {children}
    </span>
  );
}

export default function FilosofiSection() {
  return (
    <section className="w-full border-b border-zinc-200 mb-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-start gap-12 px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-3xl flex-col items-start gap-2.5">
          <p className="text-xs font-medium font-mono uppercase leading-3 tracking-wide text-zinc-400">
            01 / Filosofi Eksekusi
          </p>
          <h2 className="text-4xl font-medium leading-snug text-neutral-900 md:text-5xl">
            Didesain untuk kecepatan penulisan kode,
            <br />
            <span className="text-zinc-400">bukan sekadar penimbunan file yang terlupakan.</span>
          </h2>
        </div>

        <div className="w-full rounded-xs bg-white outline outline-1 outline-offset-[-1px] outline-zinc-200 lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-between gap-8 p-8">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <FeatureNumber no="01" />
                <div>
                  <h3 className="text-lg font-medium leading-6 text-neutral-900">Pencarian Sub-Milidetik</h3>
                  <p className="mt-1 max-w-md text-base leading-6 text-zinc-500">
                    Mesin pencari berbasis WASM client-side yang memindai puluhan ribu token prompt tanpa lag
                    keyboard dan tanpa bergantung pada round-trip server.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <FeatureNumber no="02" />
                <div>
                  <h3 className="flex flex-wrap items-center gap-2 text-lg font-medium leading-6 text-neutral-900">
                    Variabel Dinamis <CodeChip>{"{{nama}}"}</CodeChip>
                  </h3>
                  <p className="mt-1 max-w-md text-base leading-6 text-zinc-500">
                    Sematkan parameter kontekstual ke dalam prompt dan template. Vault secara otomatis meminta
                    value isian sebelum menyalin langsung ke clipboard sistem.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <FeatureNumber no="03" />
                <div>
                  <h3 className="text-lg font-medium leading-6 text-neutral-900">
                    Ekspor Sekali Klik untuk Claude &amp; Cursor
                  </h3>
                  <p className="mt-1 max-w-md text-base leading-6 text-zinc-500">
                    Sinkronkan bundel aturan arsitektur ke file <CodeChip>.cursorrules</CodeChip> atau{" "}
                    <CodeChip>CLAUDE.md</CodeChip> di root direktori project hanya dengan satu shortcut keyboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6">
              <span className="text-xs font-mono font-medium tracking-wide text-zinc-400">INDEX TIME: 0.44MS</span>
              <span className="text-xs font-mono font-medium tracking-wide text-green-800">LOCAL CACHE READY</span>
            </div>
          </div>

          <div className="flex w-full flex-col items-start justify-center gap-8 border-l border-zinc-200 bg-neutral-100 px-6 py-10 sm:px-8 lg:py-20">
            <div className="w-full overflow-hidden rounded-xs bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-3 py-3">
                <span className="truncate text-xs leading-5 text-neutral-900">nextjs auth rules</span>
                <span className="rounded-xs bg-zinc-100 px-1.5 pt-px pb-0.5 text-xs font-mono font-medium text-zinc-500 outline outline-1 outline-offset-[-1px] outline-zinc-300">
                  ESC
                </span>
              </div>

              <div className="flex flex-col p-2">
                <div className="flex items-center justify-between gap-3 rounded-xs bg-violet-100 p-2 outline outline-1 outline-offset-[-1px] outline-blue-700/40">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2.5 w-3.5 bg-indigo-900" />
                    <div>
                      <p className="text-xs font-medium leading-4 text-indigo-900">
                        Next.js 15 Server Action Security Rule
                      </p>
                      <p className="mt-1 text-xs font-mono font-medium leading-3 tracking-wide text-blue-800">
                        CLAUDE.md / Authentication / Zero-Trust
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-xs bg-white px-1.5 pt-px pb-0.5 text-xs font-mono font-medium leading-3 tracking-wide text-indigo-900 outline outline-1 outline-offset-[-1px] outline-blue-700/20">
                    ↵ SALIN
                  </span>
                </div>

                {results.map((r) => (
                  <div
                    key={r.key}
                    className="flex items-center justify-between gap-3 border-t border-zinc-100 px-2 py-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-2.5 w-3 bg-zinc-400" />
                      <div>
                        <p className="text-xs font-medium leading-4 text-neutral-900">{r.title}</p>
                        <p className="mt-1 text-xs font-mono font-medium leading-3 tracking-wide text-zinc-400">
                          {r.sub}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-normal leading-3 tracking-wide text-zinc-400">
                      {r.key}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 bg-neutral-100 px-3 py-2">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs font-mono tracking-wide text-zinc-400">
                    NAVIGASI
                    <span className="rounded-xs bg-white px-1 py-px text-zinc-500 outline outline-1 outline-offset-[-1px] outline-zinc-300">
                      ↑↓
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono tracking-wide text-zinc-400">
                    PILIH
                    <span className="rounded-xs bg-white px-1 py-px text-zinc-500 outline outline-1 outline-offset-[-1px] outline-zinc-300">
                      ENTER
                    </span>
                  </span>
                </div>
                <span className="text-xs font-mono tracking-wide text-zinc-400">HASIL: 4 DARI 429 DITEMUKAN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}