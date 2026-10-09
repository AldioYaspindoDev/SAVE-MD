import { APP_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

export function GET() {
  const body = `# ${APP_NAME}

> ${SITE_DESCRIPTION}

${APP_NAME} adalah alat manajemen aset kode pribadi untuk developer: tempat penyimpanan terpusat untuk snippet kode, file Markdown, dan prompt AI yang dapat digunakan ulang, dengan tagging, pencarian, dan keterkaitan antar aset.

Fokus: produktivitas pribadi developer (bukan kolaborasi tim). Mendukung Bahasa Indonesia.

## Halaman Utama
- [Beranda](${SITE_URL}/): Ringkasan produk dan fitur
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
