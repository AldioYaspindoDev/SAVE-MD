import { Suspense } from "react";
import CategoryDetailClient from "./category-detail-client";

type SlugParams = Promise<{ slug: string }>;

async function CategoryDetail({ params }: { params: SlugParams }) {
  const { slug } = await params;
  return <CategoryDetailClient slug={slug} />;
}

function CategoryDetailFallback() {
  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans">
      <main className="flex-1 h-full overflow-y-auto p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-zinc-200 rounded w-1/3" />
          <div className="h-4 bg-zinc-100 rounded w-1/2" />
          <div className="h-40 bg-white border border-zinc-200 rounded-xl" />
        </div>
      </main>
    </div>
  );
}

export default function CategoryDetailPage({ params }: { params: SlugParams }) {
  return (
    <Suspense fallback={<CategoryDetailFallback />}>
      <CategoryDetail params={params} />
    </Suspense>
  );
}