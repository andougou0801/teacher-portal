import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import IcebreakerScene from "@/components/IcebreakerScene";
import { icebreakers, getIcebreakerBySlug } from "@/lib/icebreakers";
import FavoriteButton from "@/components/FavoriteButton";

export function generateStaticParams() {
  return icebreakers.map((ib) => ({ slug: ib.slug }));
}

export async function generateMetadata(
  props: PageProps<"/lessons/icebreakers/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const ib = getIcebreakerBySlug(slug);
  return {
    title: ib ? `${ib.title} | 全国教員支援ポータル` : "アイスブレイク",
  };
}

export default async function IcebreakerDetailPage(
  props: PageProps<"/lessons/icebreakers/[slug]">,
) {
  const { slug } = await props.params;
  const ib = getIcebreakerBySlug(slug);

  if (!ib) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-2xl px-8 py-14">
      <Link
        href="/lessons/icebreakers"
        className="mb-6 inline-block text-sm font-bold text-accent"
      >
        ← アイスブレイク一覧にもどる
      </Link>

      <div className="mb-5 h-48 overflow-hidden rounded-2xl border border-line">
        <IcebreakerScene type={ib.scene} />
      </div>

      <Link
        href={`/tags/${encodeURIComponent(ib.category)}`}
        className="inline-block rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[13px] font-bold text-navy hover:bg-accent hover:text-white"
      >
        {ib.category}
      </Link>
      <h1 className="mt-2 mb-4 flex items-center gap-2 text-2xl font-bold">
        {ib.emoji} {ib.title}
        <FavoriteButton kind="icebreaker" slug={ib.slug} />
      </h1>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg" aria-hidden="true">⏱</div>
          <div className="text-[11px] text-muted">所要時間</div>
          <div className="mt-0.5 text-[13px] font-bold text-navy">{ib.duration}</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg" aria-hidden="true">📍</div>
          <div className="text-[11px] text-muted">場所</div>
          <div className="mt-0.5 text-[13px] font-bold text-navy">{ib.place}</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg" aria-hidden="true">👥</div>
          <div className="text-[11px] text-muted">人数</div>
          <div className="mt-0.5 text-[13px] font-bold text-navy">{ib.groupSize}</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg" aria-hidden="true">🧰</div>
          <div className="text-[11px] text-muted">持ち物</div>
          <div className="mt-0.5 text-[13px] font-bold text-navy">{ib.materials}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5">
        <h2 className="mb-3 text-sm font-bold text-navy">やり方</h2>
        <ol className="flex flex-col gap-2.5 text-sm leading-relaxed">
          {ib.steps.map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {ib.tip && (
        <div className="mt-4 rounded-2xl bg-warn-bg p-4 text-sm text-warn">
          💡 <span className="font-bold">コツ：</span>
          {ib.tip}
        </div>
      )}

      {ib.variation && (
        <div className="mt-4 rounded-2xl bg-[#EAF2FA] p-4 text-sm text-navy">
          🔄 <span className="font-bold">アレンジ：</span>
          {ib.variation}
        </div>
      )}
    </section>
  );
}
