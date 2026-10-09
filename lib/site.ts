export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

export const APP_NAME = "Vaults";

export const SITE_DESCRIPTION =
  "Kelola snippet kode, catatan Markdown, dan prompt AI di satu tempat. Cari, beri tag, dan hubungkan semua aset developer Anda.";

export const SITE_DESCRIPTION_EN =
  "Store, tag, and search your code snippets, Markdown notes, and reusable AI prompts in one place. A personal asset manager built for developers.";

export const SITE_KEYWORDS = [
  "code snippet manager",
  "prompt AI",
  "catatan markdown",
  "manajemen prompt",
  "developer tools",
  "simpan snippet kode",
];

export const THEME_COLOR = "#312e81";
