# SEOandGEO.md — Panduan Implementasi SEO, GEO & Social Sharing Metadata

> **Instruksi untuk Agentic AI:** Baca seluruh dokumen ini sebelum menyentuh kode. Kamu bertindak sebagai **SEO & GEO Engineer profesional**. Tugasmu: mengimplementasikan metadata, structured data, file crawler, dan aset social sharing sesuai spesifikasi di bawah. Kerjakan berurutan sesuai **Fase** di bagian akhir, lalu jalankan **Checklist Validasi**.

---

## 0. Definisi Istilah

- **SEO (Search Engine Optimization):** optimasi agar web muncul di Google, Bing, dll.
- **GEO (Generative Engine Optimization):** optimasi agar web **dikutip/direkomendasikan** oleh mesin jawaban AI (ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Copilot).
- **Social sharing metadata:** Open Graph & Twitter Card agar link tampil sebagai kartu dengan gambar banner saat dibagikan di WhatsApp, Telegram, LinkedIn, X, Facebook, Discord, Slack.

---

## 1. Konteks Produk (Single Source of Truth)

Gunakan data ini secara **konsisten** di semua metadata, schema, dan konten. Konsistensi nama & deskripsi = sinyal entitas yang kuat bagi mesin pencari dan AI.

> ⚠️ Ganti semua placeholder `{{...}}` dengan nilai asli. Jika nilai belum diketahui, **tanyakan kepada pemilik proyek**, jangan mengarang.

| Variabel | Nilai |
|---|---|
| `APP_NAME` | `{{NAMA_APLIKASI}}` |
| `DOMAIN` | `https://{{domain-anda.com}}` (tanpa trailing slash) |
| `TAGLINE_ID` | Satu tempat untuk snippet kode, catatan Markdown, dan prompt AI Anda |
| `TAGLINE_EN` | One home for your code snippets, Markdown notes, and AI prompts |
| `PRIMARY_LANG` | `id` (Bahasa Indonesia) |
| `SECONDARY_LANG` | `en` |
| `CATEGORY` | DeveloperApplication / Productivity |
| `AUTHOR_NAME` | `{{NAMA_PEMBUAT}}` |
| `TWITTER_HANDLE` | `{{@handle}}` (kosongkan jika tidak ada) |
| `THEME_COLOR` | `{{#HEX}}` |

### Definisi Entitas (gunakan kalimat ini sebagai kalimat pembuka konsisten)

**ID:** *{{NAMA_APLIKASI}} adalah alat manajemen aset kode pribadi untuk developer: tempat penyimpanan terpusat untuk potongan kode (snippet), file Markdown, dan prompt AI yang dapat digunakan ulang, lengkap dengan tagging, pencarian, dan keterkaitan antar aset.*

**EN:** *{{NAMA_APLIKASI}} is a personal code asset manager for developers: one central place to store, organize, and retrieve code snippets, Markdown notes, and reusable AI prompts, with tagging, search, and cross-linking between assets.*

### Diferensiasi (wajib tersirat di copy)

1. **Tiga jenis aset dalam satu tempat** (snippet + Markdown + prompt AI), kompetitor biasanya hanya satu.
2. **Aset saling terhubung** (prompt → snippet hasilnya → catatan konteksnya).
3. **Fokus murni pada produktivitas pribadi**, bukan kolaborasi tim.

---

## 2. Riset Keyword & Intent

### 2.1 Cluster keyword

| Cluster | Contoh keyword (ID) | Contoh keyword (EN) | Intent |
|---|---|---|---|
| Snippet manager | aplikasi simpan snippet kode, code snippet manager developer | code snippet manager, snippet organizer | Transactional |
| Prompt manager | simpan prompt AI, manajemen prompt ChatGPT, prompt library pribadi | AI prompt manager, prompt library for developers | Transactional |
| Markdown notes | catatan markdown developer, simpan file .md | markdown notes for developers, developer knowledge base | Transactional |
| Alternatif | alternatif GitHub Gist, alternatif Notion untuk developer | GitHub Gist alternative, Notion alternative for developers | Commercial |
| Problem-aware | cara mengorganisir snippet kode, tempat menyimpan prompt AI | how to organize code snippets, where to save AI prompts | Informational |
| Brand | `{{NAMA_APLIKASI}}` | `{{NAMA_APLIKASI}}` | Navigational |

### 2.2 Aturan penggunaan keyword

- **Satu halaman = satu intent utama** + 2–4 keyword sekunder. Jangan memaksakan semua keyword di homepage.
- Letakkan keyword utama di: `<title>`, `<h1>`, 100 kata pertama, URL slug, meta description, alt text gambar utama.
- **Dilarang keyword stuffing.** Tulis natural untuk manusia terlebih dahulu.
- Buat variasi bahasa Indonesia **dan** Inggris karena developer Indonesia sering mencari dengan istilah Inggris.

---

## 3. Arsitektur Rendering (KRITIS)

AI crawler dan banyak bot social sharing **tidak mengeksekusi JavaScript**. Jika metadata hanya dirender di client, preview WhatsApp akan kosong dan konten tidak dibaca AI.

**Aturan:**

1. Semua halaman **publik** (landing, fitur, blog, docs, FAQ, pricing) harus **SSR atau SSG**. Metadata harus ada di **HTML awal** (view-source), bukan disuntik via JS.
2. Halaman **privat** (dashboard, editor, pengaturan, vault pengguna) → `noindex, nofollow` dan **diblokir di robots.txt**. Aset pribadi pengguna **tidak boleh pernah** terindeks atau muncul di sitemap.
3. Jika proyek adalah SPA murni (React/Vite tanpa SSR), sarankan migrasi halaman publik ke Next.js / Astro / Nuxt / SvelteKit, atau gunakan prerender. **Laporkan ini ke pemilik proyek sebelum lanjut.**
4. Deteksi framework yang dipakai proyek, lalu gunakan API metadata native-nya (lihat Bagian 4.5).

---

## 4. Metadata Halaman

### 4.1 Aturan Title & Description

| Elemen | Aturan |
|---|---|
| `<title>` | 50–60 karakter. Format: `Keyword Utama — Manfaat \| {{APP_NAME}}`. Unik di setiap halaman. |
| `meta description` | 140–160 karakter. Ada value proposition + ajakan bertindak. Unik di setiap halaman. |
| `<h1>` | Tepat **satu** per halaman, selaras dengan intent title. |
| URL slug | huruf kecil, kata dipisah `-`, pendek, deskriptif, tanpa parameter tak perlu. |
| `canonical` | Wajib di semua halaman, URL absolut, self-referencing kecuali ada duplikat. |
| `lang` | `<html lang="id">` (atau `en` pada versi Inggris). |

### 4.2 Template Homepage (siap pakai)

**Bahasa Indonesia**

```
Title (±58): {{APP_NAME}} — Simpan Snippet Kode, Markdown & Prompt AI
Description (±155): Kelola snippet kode, catatan Markdown, dan prompt AI di satu tempat. Cari, beri tag, dan hubungkan semua aset developer Anda. Coba gratis.
```

**English**

```
Title: {{APP_NAME}} — Code Snippets, Markdown Notes & AI Prompts in One Place
Description: Store, tag, and search your code snippets, Markdown notes, and reusable AI prompts in one place. A personal asset manager built for developers.
```

> Hitung ulang jumlah karakter setelah placeholder diganti. Jika melebihi batas, pangkas bagian akhir, bukan keyword utama.

### 4.3 Blok `<head>` Dasar (HTML murni)

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>{{TITLE}}</title>
  <meta name="description" content="{{DESCRIPTION}}">
  <link rel="canonical" href="{{DOMAIN}}{{PATH}}">

  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="author" content="{{AUTHOR_NAME}}">
  <meta name="theme-color" content="{{THEME_COLOR}}">

  <!-- Bahasa alternatif (hanya jika versi EN benar-benar ada) -->
  <link rel="alternate" hreflang="id" href="{{DOMAIN}}/">
  <link rel="alternate" hreflang="en" href="{{DOMAIN}}/en/">
  <link rel="alternate" hreflang="x-default" href="{{DOMAIN}}/">

  <!-- Icons -->
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png"> <!-- 180x180 -->
  <link rel="manifest" href="/manifest.webmanifest">

  <!-- Open Graph + Twitter: lihat Bagian 5 -->
</head>
```

### 4.4 Metadata per Tipe Halaman

| Halaman | Robots | Schema | Catatan |
|---|---|---|---|
| Landing `/` | index, follow | WebSite, Organization/Person, SoftwareApplication, FAQPage | Halaman terpenting |
| Fitur `/fitur/*` | index, follow | SoftwareApplication (feature) / WebPage | Satu halaman per jenis aset (snippet, markdown, prompt) |
| Pricing | index, follow | Offer (di dalam SoftwareApplication) | Sertakan harga atau "Gratis" secara eksplisit |
| Blog / Panduan | index, follow | Article/BlogPosting + BreadcrumbList | Konten GEO utama |
| FAQ | index, follow | FAQPage | Pertanyaan nyata |
| Changelog | index, follow | WebPage | Sinyal freshness |
| Login / Register | **noindex, follow** | — | Hindari thin page terindeks |
| Dashboard / App / Vault | **noindex, nofollow** | — | Wajib, plus blok di robots.txt |
| 404 | noindex | — | Status HTTP asli 404 |

### 4.5 Implementasi per Framework

**Next.js (App Router)**

```ts
// app/layout.tsx
import type { Metadata, Viewport } from "next";

const SITE_URL = "https://{{domain-anda.com}}";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "{{APP_NAME}} — Simpan Snippet Kode, Markdown & Prompt AI",
    template: "%s | {{APP_NAME}}",
  },
  description:
    "Kelola snippet kode, catatan Markdown, dan prompt AI di satu tempat. Cari, beri tag, dan hubungkan semua aset developer Anda.",
  applicationName: "{{APP_NAME}}",
  authors: [{ name: "{{AUTHOR_NAME}}" }],
  creator: "{{AUTHOR_NAME}}",
  keywords: ["code snippet manager", "prompt AI", "catatan markdown", "developer tools"],
  alternates: {
    canonical: "/",
    languages: { id: "/", en: "/en" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "{{APP_NAME}}",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    title: "{{APP_NAME}} — Snippet, Markdown & Prompt AI dalam Satu Tempat",
    description: "Alat manajemen aset kode pribadi untuk developer.",
    images: [
      {
        url: "/og/og-default.png", // dibuat absolut otomatis lewat metadataBase
        width: 1200,
        height: 630,
        alt: "{{APP_NAME}}: manajemen snippet kode, Markdown, dan prompt AI untuk developer",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "{{APP_NAME}} — Snippet, Markdown & Prompt AI dalam Satu Tempat",
    description: "Alat manajemen aset kode pribadi untuk developer.",
    images: ["/og/og-default.png"],
    // creator: "@handle",
  },
  manifest: "/manifest.webmanifest",
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "{{THEME_COLOR}}",
  width: "device-width",
  initialScale: 1,
};
```

- Gunakan `generateMetadata()` untuk halaman dinamis (blog, docs).
- Buat `app/sitemap.ts`, `app/robots.ts`, dan `app/manifest.ts` bila memungkinkan.
- Opsional: `opengraph-image.tsx` dengan `ImageResponse` untuk OG dinamis per artikel.

**Astro:** buat komponen `<SEO />` di `<head>` layout. **Nuxt:** `useSeoMeta()` + `useHead()`. **SvelteKit:** `<svelte:head>`. **Vite SPA:** `react-helmet-async` hanya sebagai langkah darurat, dengan catatan SSR/prerender tetap wajib (Bagian 3).

---

## 5. Open Graph, Twitter Card & Preview WhatsApp

Tujuan: saat link dibagikan di WhatsApp dll., muncul **kartu banner profesional**: gambar besar + judul + deskripsi + domain.

### 5.1 Tag wajib

```html
<!-- Open Graph (dipakai WhatsApp, Facebook, LinkedIn, Telegram, Discord, Slack) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="{{APP_NAME}}">
<meta property="og:url" content="{{DOMAIN}}/">
<meta property="og:title" content="{{OG_TITLE}}">
<meta property="og:description" content="{{OG_DESCRIPTION}}">
<meta property="og:locale" content="id_ID">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:image" content="{{DOMAIN}}/og/og-default.png">
<meta property="og:image:secure_url" content="{{DOMAIN}}/og/og-default.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{{ALT_BANNER}}">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{OG_TITLE}}">
<meta name="twitter:description" content="{{OG_DESCRIPTION}}">
<meta name="twitter:image" content="{{DOMAIN}}/og/og-default.png">
<meta name="twitter:image:alt" content="{{ALT_BANNER}}">
<!-- <meta name="twitter:site" content="@handle"> -->
```

Untuk artikel blog tambahkan: `og:type=article`, `article:published_time`, `article:modified_time`, `article:author`, `article:tag`.

### 5.2 Aturan gambar OG (penentu keberhasilan preview WhatsApp)

| Aturan | Nilai |
|---|---|
| Rasio & ukuran | **1200 × 630 px** (1.91:1) → tampil sebagai banner lebar. |
| Ukuran file | **Idealnya < 300 KB**, maksimal 600 KB. WhatsApp sering **gagal memuat gambar berat**. |
| Format | **PNG atau JPG.** Hindari WebP/SVG/AVIF untuk `og:image` (dukungan tidak konsisten). |
| URL | **Absolut, HTTPS**, publik (tanpa login, tanpa redirect berantai, tanpa blokir robots). |
| Konten | Tampilkan nama/logo aplikasi + tagline + cuplikan UI (mockup editor snippet / vault). Teks besar, kontras tinggi. |
| Safe zone | Jaga elemen penting ≥ 60 px dari tepi (beberapa platform memotong sisi). |
| Alt | Selalu isi `og:image:alt`. |
| Cache-busting | Jika gambar diganti, ubah nama file / tambah `?v=2`. WhatsApp dan Facebook meng-cache agresif. |
| Per halaman | Minimal 1 gambar default + gambar khusus untuk halaman penting (fitur, blog). |

### 5.3 Spesifikasi desain banner OG default

```
Canvas      : 1200 x 630 px
Background  : gradient gelap bertema developer (sesuai THEME_COLOR) atau dark UI
Kiri (55%)  : Logo + {{APP_NAME}}
              Headline (maks 2 baris, 64–72px, bold):
              "Snippet, Markdown & Prompt AI. Satu Tempat."
              Subline (28–32px): "Aset kode pribadi developer, rapi dan mudah ditemukan."
Kanan (45%) : Mockup UI aplikasi (kartu snippet dengan syntax highlighting,
              tag, dan ikon tiga tipe aset: </> , .md , ✦ prompt)
Footer      : domain {{domain-anda.com}} (kecil, kanan bawah)
Font        : sans-serif tebal yang terbaca (mis. Inter / Geist), kode pakai monospace
```

**Jika agent tidak bisa membuat gambar desain:** buat template HTML/SVG 1200×630 dan render ke PNG menggunakan script (Playwright/Puppeteer/`satori`/`sharp`), simpan di `public/og/og-default.png`, lalu kompres (`sharp`, `squoosh`, atau `pngquant`) hingga < 300 KB. **Jangan** memakai URL gambar placeholder eksternal.

### 5.4 Ukuran aset ikon yang harus ada

| File | Ukuran |
|---|---|
| `favicon.ico` | 48×48 (multi-size) |
| `icon.svg` | vektor |
| `apple-touch-icon.png` | 180×180 |
| `icon-192.png`, `icon-512.png` | untuk manifest/PWA |
| `icon-maskable-512.png` | maskable, padding aman |

### 5.5 `manifest.webmanifest`

```json
{
  "name": "{{APP_NAME}}",
  "short_name": "{{APP_NAME}}",
  "description": "Alat manajemen aset kode pribadi: snippet, Markdown, dan prompt AI.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "{{THEME_COLOR}}",
  "theme_color": "{{THEME_COLOR}}",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

---

## 6. Structured Data (JSON-LD)

Sisipkan sebagai `<script type="application/ld+json">` di HTML awal (server-rendered). Gunakan `@id` agar entitas saling terhubung dalam satu `@graph`. Data harus **cocok persis** dengan konten yang terlihat di halaman.

### 6.1 Homepage `@graph`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "{{DOMAIN}}/#website",
      "url": "{{DOMAIN}}/",
      "name": "{{APP_NAME}}",
      "description": "Alat manajemen aset kode pribadi untuk developer: snippet, Markdown, dan prompt AI.",
      "inLanguage": ["id", "en"],
      "publisher": { "@id": "{{DOMAIN}}/#organization" }
    },
    {
      "@type": "Organization",
      "@id": "{{DOMAIN}}/#organization",
      "name": "{{APP_NAME}}",
      "url": "{{DOMAIN}}/",
      "logo": {
        "@type": "ImageObject",
        "url": "{{DOMAIN}}/icon-512.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://github.com/{{github}}",
        "https://x.com/{{handle}}",
        "https://www.linkedin.com/in/{{linkedin}}"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "{{DOMAIN}}/#software",
      "name": "{{APP_NAME}}",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web",
      "url": "{{DOMAIN}}/",
      "description": "Simpan, organisir, dan temukan kembali potongan kode, file Markdown, dan prompt AI yang dapat digunakan ulang, dengan tagging, pencarian, dan keterkaitan antar aset.",
      "inLanguage": ["id", "en"],
      "image": "{{DOMAIN}}/og/og-default.png",
      "author": { "@id": "{{DOMAIN}}/#organization" },
      "featureList": [
        "Penyimpanan snippet kode dengan syntax highlighting",
        "Penyimpanan dan pengelolaan file Markdown",
        "Perpustakaan prompt AI yang dapat dipakai ulang",
        "Tagging dan pencarian cepat",
        "Menghubungkan prompt, snippet, dan catatan"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]
}
```

> `offers` hanya boleh dicantumkan jika harga/gratis benar-benar tertera di situs. **Jangan** menambahkan `aggregateRating`/`review` kecuali ada ulasan nyata yang tampil di halaman (melanggar pedoman Google jika dipalsukan).

### 6.2 FAQPage (juga kuat untuk GEO)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Apa itu {{APP_NAME}}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{APP_NAME}} adalah alat manajemen aset kode pribadi untuk developer. Anda dapat menyimpan snippet kode, file Markdown, dan prompt AI di satu tempat, lalu mencari dan menghubungkannya satu sama lain."
      }
    },
    {
      "@type": "Question",
      "name": "Apa bedanya dengan GitHub Gist atau Notion?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GitHub Gist berfokus pada snippet kode dan Notion pada catatan umum. {{APP_NAME}} menyatukan snippet, Markdown, dan prompt AI, serta memungkinkan ketiganya saling terhubung."
      }
    },
    {
      "@type": "Question",
      "name": "Apakah {{APP_NAME}} cocok untuk tim?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{APP_NAME}} dirancang untuk produktivitas pribadi developer dalam mengelola aset digitalnya sendiri, bukan untuk kolaborasi tim."
      }
    }
  ]
}
```

Catatan: Google sejak 2023 membatasi tampilan rich result FAQ hanya untuk situs otoritatif tertentu. Tetap pasang karena membantu pemahaman mesin dan AI, tetapi **jangan** menjadikannya satu-satunya strategi.

### 6.3 Halaman lain

- **Artikel blog:** `BlogPosting` (`headline`, `datePublished`, `dateModified`, `author` → `Person`, `image`, `mainEntityOfPage`).
- **Semua halaman dalam:** `BreadcrumbList`.
- **Tutorial langkah demi langkah:** `HowTo` hanya bila konten benar-benar berbentuk langkah.
- **Halaman author:** `Person` dengan `sameAs` ke GitHub/LinkedIn (sinyal E-E-A-T).

Validasi semua JSON-LD sebelum selesai (lihat Bagian 11).

---

## 7. File Teknis Crawler

### 7.1 `robots.txt` (di `{{DOMAIN}}/robots.txt`)

```txt
# Crawler umum
User-agent: *
Allow: /
Disallow: /app/
Disallow: /dashboard/
Disallow: /vault/
Disallow: /settings/
Disallow: /api/
Disallow: /login
Disallow: /register

# Crawler AI: IZINKAN konten publik agar bisa dikutip (GEO)
User-agent: GPTBot
Allow: /
Disallow: /app/
Disallow: /dashboard/
Disallow: /vault/
Disallow: /api/

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: {{DOMAIN}}/sitemap.xml
```

> Sesuaikan path `Disallow` dengan struktur route aplikasi yang sebenarnya. Jika pemilik **tidak** ingin kontennya dipakai melatih model AI, tanyakan dulu dan pisahkan keputusan **training** (`GPTBot`, `Google-Extended`, `Applebot-Extended`) dari **pencarian/sitasi** (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`). Daftar user-agent AI sering berubah; verifikasi dengan dokumentasi resmi masing-masing vendor. `robots.txt` bukan mekanisme keamanan, karena data privat harus dilindungi autentikasi.

### 7.2 `sitemap.xml`

- Hanya URL publik, canonical, status 200, dan boleh diindeks.
- Sertakan `<lastmod>` **akurat** (tanggal perubahan konten nyata, bukan tanggal build).
- Jika ada versi bahasa, sertakan `xhtml:link rel="alternate" hreflang`.
- Pecah menjadi sitemap index jika > 50.000 URL.
- Otomatis ter-generate saat build.

### 7.3 `llms.txt` (di `{{DOMAIN}}/llms.txt`)

Berkas Markdown ringkas sebagai "peta" situs untuk LLM. Ini **standar usulan**, belum dijamin dibaca semua AI, tetapi murah dibuat dan tidak merugikan.

```markdown
# {{APP_NAME}}

> {{APP_NAME}} adalah alat manajemen aset kode pribadi untuk developer: tempat penyimpanan terpusat untuk snippet kode, file Markdown, dan prompt AI yang dapat digunakan ulang, dengan tagging, pencarian, dan keterkaitan antar aset.

Fokus: produktivitas pribadi developer (bukan kolaborasi tim). Mendukung Bahasa Indonesia dan English.

## Halaman Utama
- [Beranda]({{DOMAIN}}/): Ringkasan produk dan fitur
- [Fitur]({{DOMAIN}}/fitur): Penjelasan snippet, Markdown, dan prompt AI
- [Harga]({{DOMAIN}}/harga): Paket dan harga
- [FAQ]({{DOMAIN}}/faq): Pertanyaan umum

## Panduan
- [Cara mengorganisir snippet kode]({{DOMAIN}}/blog/...): ...
- [Cara menyimpan dan menyusun prompt AI]({{DOMAIN}}/blog/...): ...

## Opsional
- [Changelog]({{DOMAIN}}/changelog)
```

Opsional: sediakan `llms-full.txt` berisi konten dokumentasi lengkap dalam Markdown. Pertimbangkan juga versi `.md` bersih dari halaman penting.

### 7.4 Lain-lain

- Redirect 301 untuk `http → https`, `www ↔ non-www` (pilih satu), dan trailing slash konsisten.
- Halaman 404 benar-benar mengembalikan status **404** (bukan 200).
- Header: `X-Robots-Tag: noindex` untuk area privat sebagai lapisan tambahan.
- Tambahkan `humans.txt` dan `/.well-known/security.txt` bila relevan (opsional).

---

## 8. Strategi GEO (Generative Engine Optimization)

Mesin AI memilih sumber yang **jelas, faktual, terstruktur, dan mudah dikutip**. Terapkan pada konten, bukan hanya metadata.

### 8.1 Prinsip konten

1. **Answer-first.** Jawab pertanyaan inti di 1–2 kalimat pertama setiap bagian, lalu jelaskan detail. Contoh: heading "Apa itu {{APP_NAME}}?" langsung diikuti definisi 40–60 kata yang berdiri sendiri.
2. **Heading berbentuk pertanyaan nyata** yang ditanyakan pengguna ("Bagaimana cara menyimpan prompt AI agar mudah ditemukan?").
3. **Potongan mandiri (chunkable).** Setiap paragraf/bagian harus bisa dipahami tanpa konteks lain. Hindari "seperti disebut di atas".
4. **Struktur semantik:** satu `<h1>`, hierarki `h2/h3` logis, daftar `<ul>/<ol>`, tabel `<table>` untuk perbandingan, `<code>` untuk kode.
5. **Fakta spesifik & terverifikasi:** angka, nama fitur, batasan, harga. Hindari klaim kosong ("terbaik di dunia").
6. **Entitas konsisten:** nama produk, definisi, dan kategori ditulis sama di seluruh situs, README, GitHub, dan profil sosial.
7. **Freshness:** tampilkan "Terakhir diperbarui: tanggal" dan perbarui `dateModified` hanya saat konten benar-benar berubah.
8. **Sinyal E-E-A-T:** halaman About/Author dengan identitas pembuat nyata, link GitHub/LinkedIn, dan cerita mengapa produk dibuat.
9. **Kejujuran perbandingan:** halaman "vs/alternatif" harus adil dan menyebut kekurangan produk sendiri. AI cenderung mengutip sumber yang seimbang.
10. **Sitasi data original:** publikasikan insight asli (mis. benchmark, hasil survei kecil) agar layak dikutip.

### 8.2 Halaman yang harus dibuat

| Halaman | Tujuan GEO/SEO |
|---|---|
| Beranda | Definisi entitas + diferensiasi |
| `/fitur/snippet-kode` | Query: code snippet manager |
| `/fitur/catatan-markdown` | Query: catatan markdown developer |
| `/fitur/prompt-ai` | Query: prompt library / manajemen prompt AI |
| `/alternatif/github-gist` | Query: alternatif GitHub Gist |
| `/alternatif/notion-untuk-developer` | Query: alternatif Notion developer |
| `/bandingkan` | Tabel perbandingan: Gist vs Notion vs {{APP_NAME}} |
| `/faq` | Pertanyaan umum + FAQPage schema |
| `/blog/*` | Panduan informasional (lihat 8.3) |
| `/tentang` | Identitas pembuat, E-E-A-T |
| `/changelog` | Sinyal aktivitas & freshness |

### 8.3 Ide konten blog (informasional)

- Cara mengorganisir snippet kode agar mudah ditemukan kembali
- Cara menyimpan dan menyusun prompt AI yang terbukti berguna
- Struktur folder & tagging terbaik untuk catatan teknis `.md`
- Membangun "second brain" untuk developer
- Template prompt AI untuk code review, debugging, dan refactoring
- Kesalahan umum developer dalam menyimpan aset kode

Setiap artikel: jawaban ringkas di awal → langkah/penjelasan → contoh nyata → FAQ kecil → CTA ke produk.

### 8.4 Contoh tabel perbandingan (format yang disukai AI)

```markdown
| Kriteria | GitHub Gist | Notion | {{APP_NAME}} |
|---|---|---|---|
| Snippet kode + syntax highlighting | Ya | Terbatas | Ya |
| Catatan Markdown | Terbatas | Ya | Ya |
| Perpustakaan prompt AI | Tidak | Manual | Ya |
| Relasi antar aset | Tidak | Terbatas | Ya |
| Fokus | Berbagi kode | Catatan umum | Aset developer pribadi |
```

> Pastikan isi tabel akurat dan bisa diverifikasi. Jangan membuat klaim tentang kompetitor yang tidak benar.

### 8.5 Distribusi & sinyal eksternal

AI sering mengutip sumber yang **disebut di tempat lain**. Rekomendasikan ke pemilik: README GitHub yang kuat (definisi entitas identik), listing di Product Hunt, Hacker News (Show HN), dev.to, Hashnode, daftar "awesome" di GitHub, komunitas developer Indonesia, serta backlink dari artikel teknis. (Ini aktivitas manual pemilik; agent cukup menyiapkan materinya.)

---

## 9. Performa & Aksesibilitas (Faktor Ranking)

- **Core Web Vitals target:** LCP < 2.5 dtk, INP < 200 ms, CLS < 0.1.
- Gambar: format modern (WebP/AVIF) untuk konten, `width`/`height` eksplisit, `loading="lazy"` (kecuali hero/LCP), `fetchpriority="high"` untuk hero.
- Font: `font-display: swap`, subset, preload font kritis.
- Kurangi JS di halaman publik; tunda skrip pihak ketiga.
- Semua `<img>` punya `alt` deskriptif (dekoratif: `alt=""`).
- Kontras warna WCAG AA, navigasi keyboard, label form, landmark HTML (`header/nav/main/footer`).
- Mobile-first, tanpa interstitial mengganggu.
- HTTPS, HSTS, dan kompresi Brotli/Gzip.

---

## 10. Internal Linking & Struktur Situs

- Homepage → halaman fitur → artikel pendukung → kembali ke fitur (topic cluster).
- Anchor text deskriptif (hindari "klik di sini").
- Maksimal kedalaman 3 klik dari homepage.
- Breadcrumb visual + `BreadcrumbList`.
- Tidak ada halaman yatim (orphan page); semua URL publik tertaut dari minimal satu halaman lain.

---

## 11. Checklist Validasi (Wajib Dijalankan Sebelum Selesai)

### Otomatis (jalankan lewat script/CLI bila bisa)

- [ ] `view-source` halaman publik menampilkan `<title>`, description, canonical, OG, Twitter, dan JSON-LD **tanpa JS**.
- [ ] `curl -I {{DOMAIN}}/og/og-default.png` → status 200, `content-type: image/png|jpeg`, ukuran < 300 KB.
- [ ] `og:image` berupa URL absolut HTTPS.
- [ ] `robots.txt`, `sitemap.xml`, `llms.txt`, `manifest.webmanifest` dapat diakses (200).
- [ ] Tidak ada URL privat di sitemap; area privat memiliki `noindex`.
- [ ] Semua title & description **unik** dan sesuai batas karakter.
- [ ] Hanya satu `<h1>` per halaman; tidak ada gambar tanpa `alt`.
- [ ] JSON-LD valid (parse JSON berhasil, tipe & properti sesuai schema.org).
- [ ] Lighthouse (mobile): SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 90.

### Manual (minta pemilik menjalankan setelah deploy)

| Tujuan | Alat |
|---|---|
| Preview WhatsApp | Kirim link ke diri sendiri / grup uji (untuk refresh cache, tambahkan `?v=2`) |
| Preview Facebook & cache | Facebook Sharing Debugger |
| Preview LinkedIn | LinkedIn Post Inspector |
| Preview X/Twitter | Bagikan draft post atau gunakan alat preview kartu |
| Structured data | Google Rich Results Test, Schema Markup Validator (validator.schema.org) |
| Indexing | Google Search Console (kirim sitemap, cek URL Inspection), Bing Webmaster Tools |
| Performa | PageSpeed Insights, Lighthouse |
| GEO | Uji prompt nyata di ChatGPT, Perplexity, Gemini, Claude: "alat terbaik untuk menyimpan snippet kode dan prompt AI" → catat apakah situs disebut/dikutip, ulangi tiap bulan |

---

## 12. Larangan Keras (Anti-Pattern)

1. ❌ Jangan memakai **keyword stuffing**, teks tersembunyi, atau cloaking.
2. ❌ Jangan memalsukan **rating, review, jumlah pengguna, atau penghargaan** di schema/konten.
3. ❌ Jangan membuat metadata duplikat di banyak halaman.
4. ❌ Jangan mengindeks halaman privat/vault pengguna atau memasukkannya ke sitemap.
5. ❌ Jangan memakai URL gambar OG relatif, HTTP, atau berasal dari sumber yang butuh login.
6. ❌ Jangan memakai WebP/SVG untuk `og:image`.
7. ❌ Jangan mengisi `{{placeholder}}` dengan data karangan; tanyakan kepada pemilik.
8. ❌ Jangan mengubah `lastmod`/`dateModified` tanpa perubahan konten nyata.
9. ❌ Jangan menulis konten massal berkualitas rendah hasil AI tanpa nilai tambah. Setiap halaman harus punya tujuan jelas dan fakta spesifik.
10. ❌ Jangan memblokir seluruh crawler AI jika tujuan adalah dikutip AI (kecuali keputusan sadar pemilik).

---

## 13. Urutan Eksekusi untuk Agent

**Fase 1 — Audit & Klarifikasi**
1. Deteksi framework, struktur route, dan mode rendering (SSR/SSG/SPA).
2. Daftar halaman publik vs privat.
3. Tanyakan hal yang belum diketahui: nama aplikasi, domain, warna brand, logo, handle sosial, apakah ada versi EN, apakah ada pricing.

**Fase 2 — Fondasi Teknis**
4. Perbaiki rendering halaman publik (SSR/SSG/prerender) bila perlu.
5. Implementasi `metadataBase`, title template, canonical, robots meta, `lang`.
6. Buat `robots.txt`, `sitemap`, `manifest`, `llms.txt`.
7. Pasang `noindex` pada route privat.

**Fase 3 — Social Sharing**
8. Buat banner OG 1200×630 (< 300 KB) sesuai Bagian 5.3 dan semua ikon (Bagian 5.4).
9. Implementasi OG + Twitter tags di layout dan per halaman penting.

**Fase 4 — Structured Data**
10. Pasang JSON-LD homepage (`WebSite`, `Organization`, `SoftwareApplication`), `FAQPage`, `BreadcrumbList`, `BlogPosting`.

**Fase 5 — Konten GEO**
11. Buat/rapikan halaman di Bagian 8.2 dengan prinsip answer-first.
12. Tulis minimal 3 artikel pilar dari Bagian 8.3.

**Fase 6 — Validasi & Laporan**
13. Jalankan Checklist Bagian 11 (otomatis).
14. Berikan laporan akhir: file yang dibuat/diubah, hasil validasi, item yang butuh tindakan manual pemilik (Search Console, uji WhatsApp, distribusi eksternal), dan daftar `{{placeholder}}` yang masih kosong.

---

## 14. Format Laporan Akhir yang Diharapkan

```markdown
## Ringkasan
- Framework & mode rendering:
- Halaman publik/privat:

## Perubahan
| File | Perubahan |
|---|---|

## Hasil Validasi
| Pemeriksaan | Status | Catatan |
|---|---|---|

## Butuh Tindakan Pemilik
1.
2.

## Placeholder Belum Terisi
-
```

---

*Catatan: SEO dan GEO tidak memberi jaminan peringkat atau sitasi. Hasil bergantung pada kualitas konten, otoritas domain, dan waktu. Dokumen ini memaksimalkan kesiapan teknis dan kejelasan entitas agar peluang tersebut terbuka.*
