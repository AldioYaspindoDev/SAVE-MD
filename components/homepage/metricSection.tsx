import React from "react";

export interface MetricItem {
  value: string;
  label: string;
  description: string;
}

export interface TelemetryMetricsData {
  subtitle?: string;
  title?: string;
  samplingRate?: string;
  dataSource?: string;
  integrations?: string[];
  metrics?: MetricItem[];
}

interface MetricsSectionProps {
  data?: TelemetryMetricsData[];
}

const DEFAULT_METRICS: MetricItem[] = [
  {
    value: "25,000+",
    label: "SNIPPET & PROMPT TERINDEKS",
    description: "Diaudit bebas syntax error",
  },
  {
    value: "< 5ms",
    label: "LATENSI EKSEKUSI ⌘K",
    description: "Client-side instant index",
  },
  {
    value: "100%",
    label: "FORMAT MARKDOWN TERBUKA",
    description: "Nol risiko vendor lock-in",
  },
  {
    value: "0.12s",
    label: "AKSES KE CLIPBOARD",
    description: "Rata-rata waktu aksi developer",
  },
];

const DEFAULT_VALUE_ITEMS: TelemetryMetricsData[] = [
  {
    subtitle: "METRIK EFISIENSI GLOBAL",
    title: "Diverifikasi Melalui Telemetri Nyata",
    samplingRate: "SAMPLING: 1.4M REQ/HARI",
    dataSource: "SUMBER DATA: AUDIT PRODUKSI Q1 2025",
    integrations: ["OPENAI", "ANTHROPIC", "CURSOR", "OLLAMA"],
    metrics: DEFAULT_METRICS,
  },
];

/**
 * Modern Next.js App Router Component (React Server Component)
 */
export default function MetricsSection({
  data = DEFAULT_VALUE_ITEMS,
}: MetricsSectionProps) {
  return (
   <section className="w-full border-b border-zinc-200">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-start px-4 py-14 sm:px-6 lg:px-8">
        {data.map((item, dataIndex) => {
          const metrics = item.metrics ?? DEFAULT_METRICS;
          const integrations = item.integrations ?? [];

          return (
            <div
              key={dataIndex}
              className="w-full p-6 sm:p-8 md:p-10 bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 border border-white/30 rounded-sm shadow-xl text-white flex flex-col gap-8 overflow-hidden"
            >
              {/* Header Section */}
              <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/20 gap-4">
                <div className="flex flex-col gap-1">
                  {item.subtitle && (
                    <span className="font-mono text-xs font-medium text-white/70 uppercase tracking-wide">
                      {item.subtitle}
                    </span>
                  )}
                  {item.title && (
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                      {item.title}
                    </h2>
                  )}
                </div>

                {/* Status Badge */}
                {item.samplingRate && (
                  <div className="self-start md:self-auto inline-flex items-center gap-2.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-xs font-mono text-xs font-medium text-white tracking-wide">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>{item.samplingRate}</span>
                  </div>
                )}
              </header>

              {/* Metrics Grid */}
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/20 py-2 border-t border-b border-white/20">
                {metrics.map((metric, metricIndex) => (
                  <div
                    key={metricIndex}
                    className={`flex flex-col gap-1 py-4 ${
                      metricIndex === 0
                        ? "sm:pr-6"
                        : metricIndex === metrics.length - 1
                        ? "sm:pl-6"
                        : "sm:px-6"
                    }`}
                  >
                    <dt className="order-2 pt-1 font-mono text-xs font-medium text-white/80 uppercase tracking-wide">
                      {metric.label}
                    </dt>
                    <dd className="order-1 font-mono text-4xl sm:text-5xl lg:text-6xl font-normal leading-none tracking-tight">
                      {metric.value}
                    </dd>
                    <dd className="order-3 font-sans text-xs text-white/60 leading-normal">
                      {metric.description}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Footer Info */}
              <footer className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 font-mono text-xs text-white/70 tracking-wide gap-2">
                {item.dataSource && <div>{item.dataSource}</div>}
                {integrations.length > 0 && (
                  <div>INTEGRASI: {integrations.join(", ")}</div>
                )}
              </footer>
            </div>
          );
        })}
      </div>
    </section>
  );
}