import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import RecreationScene from "@/components/RecreationScene";
import { recreations, getRecreationBySlug } from "@/lib/recreations";
import { getIcebreakerBySlug } from "@/lib/icebreakers";
import FavoriteButton from "@/components/FavoriteButton";

export function generateStaticParams() {
  return recreations.map((rec) => ({ slug: rec.slug }));
}

export async function generateMetadata(
  props: PageProps<"/lessons/recreations/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const rec = getRecreationBySlug(slug);
  return {
    title: rec ? `${rec.title} | 全国教員支援ポータル` : "学級レク",
  };
}

export default async function RecreationDetailPage(
  props: PageProps<"/lessons/recreations/[slug]">,
) {
  const { slug } = await props.params;
  const rec = getRecreationBySlug(slug);

  if (!rec) {
    notFound();
  }

  const relatedIcebreaker = rec.icebreakerSlug
    ? getIcebreakerBySlug(rec.icebreakerSlug)
    : undefined;

  return (
    <section className="mx-auto max-w-2xl px-8 py-14">
      <Link
        href="/lessons/recreations"
        className="mb-6 inline-block text-sm font-bold text-accent"
      >
        ← 学級レク一覧にもどる
      </Link>

      <div className="mb-5 h-48 overflow-hidden rounded-2xl border border-line">
        <RecreationScene type={rec.scene} />
      </div>

      <Link
        href={`/tags/${encodeURIComponent(rec.category)}`}
        className="inline-block rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[13px] font-bold text-navy hover:bg-accent hover:text-white"
      >
        {rec.category}
      </Link>
      <h1 className="mt-2 mb-4 flex items-center gap-2 text-2xl font-bold">
        {rec.emoji} {rec.title}
        <FavoriteButton kind="recreation" slug={rec.slug} />
      </h1>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg" aria-hidden="true">⏱</div>
          <div className="text-[11px] text-muted">所要時間</div>
          <div className="mt-0.5 text-[13px] font-bold text-navy">{rec.duration}</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg" aria-hidden="true">📍</div>
          <div className="text-[11px] text-muted">場所</div>
          <div className="mt-0.5 text-[13px] font-bold text-navy">{rec.place}</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg" aria-hidden="true">👥</div>
          <div className="text-[11px] text-muted">人数</div>
          <div className="mt-0.5 text-[13px] font-bold text-navy">{rec.groupSize}</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg" aria-hidden="true">🧰</div>
          <div className="text-[11px] text-muted">持ち物</div>
          <div className="mt-0.5 text-[13px] font-bold text-navy">{rec.materials}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5">
        <h2 className="mb-3 text-sm font-bold text-navy">やり方</h2>
        <ol className="flex flex-col gap-2.5 text-sm leading-relaxed">
          {rec.steps.map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {rec.safety && (
        <div className="mt-4 rounded-2xl border border-warn-line bg-warn-bg p-4 text-sm text-warn">
          ⚠️ <span className="font-bold">安全のために：</span>
          {rec.safety}
        </div>
      )}

      {rec.tip && (
        <div className="mt-4 rounded-2xl bg-good-bg p-4 text-sm text-good">
          💡 <span className="font-bold">コツ：</span>
          {rec.tip}
        </div>
      )}

      {rec.variation && (
        <div className="mt-4 rounded-2xl bg-[#EAF2FA] p-4 text-sm text-navy">
          🔄 <span className="font-bold">アレンジ：</span>
          {rec.variation}
        </div>
      )}

      {relatedIcebreaker && (
        <Link
          href={`/lessons/icebreakers/${relatedIcebreaker.slug}`}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-white p-4"
        >
          <span className="text-xl">{relatedIcebreaker.emoji}</span>
          <span className="text-sm">
            <span className="font-bold">アイスブレイク特集にも掲載</span>
            <span className="block text-muted">
              アイスブレイクとしての進め方（{relatedIcebreaker.duration}）はこちら
            </span>
          </span>
          <span className="ml-auto shrink-0 text-sm text-accent">見る →</span>
        </Link>
      )}
    </section>
  );
}
