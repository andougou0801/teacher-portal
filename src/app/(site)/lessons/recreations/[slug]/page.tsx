import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import RecreationScene from "@/components/RecreationScene";
import {
  recreations,
  getRecreationBySlug,
  sortRecreations,
  type Recreation,
} from "@/lib/recreations";
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
  if (!rec) return { title: "学級レク" };
  return {
    title: `${rec.title} | 全国教員支援ポータル`,
    description: `${rec.title}のやり方・ルール。${rec.place}／${rec.groupSize}／所要時間${rec.duration}／持ち物は${rec.materials}。${rec.grades.join("・")}むけの学級レクです。`,
  };
}

/** 同じカテゴリーの並び順で、前後のレクを取り出す。 */
function getNeighbors(rec: Recreation): { prev?: Recreation; next?: Recreation } {
  const list = sortRecreations(
    recreations.filter((item) => item.category === rec.category),
  );
  const index = list.findIndex((item) => item.slug === rec.slug);
  return { prev: list[index - 1], next: list[index + 1] };
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
  const { prev, next } = getNeighbors(rec);
  // 「同じ場所でできる」候補。前後リンクと重ならないようにし、
  // まず同じカテゴリーのものを出してから、足りなければ他のカテゴリーで補う。
  const shownSlugs = [rec.slug, prev?.slug, next?.slug];
  const placeCandidates = sortRecreations(
    recreations.filter(
      (item) =>
        !shownSlugs.includes(item.slug) &&
        item.places.some((place) => rec.places.includes(place)),
    ),
  );
  const samePlace = [
    ...placeCandidates.filter((item) => item.category === rec.category),
    ...placeCandidates.filter((item) => item.category !== rec.category),
  ].slice(0, 3);

  const meta: { icon: string; label: string; value: string }[] = [
    { icon: "⏱", label: "所要時間", value: rec.duration },
    { icon: "⏳", label: "準備", value: rec.prep },
    { icon: "📍", label: "場所", value: rec.place },
    { icon: "👥", label: "人数", value: rec.groupSize },
    { icon: "🧰", label: "持ち物", value: rec.materials },
  ];

  return (
    <section className="mx-auto max-w-2xl px-8 py-14">
      <Link
        href="/lessons/recreations"
        className="mb-6 inline-block text-sm font-bold text-accent"
      >
        ← 学級レク一覧にもどる
      </Link>

      <div className="mb-5 h-28 overflow-hidden rounded-2xl border border-line sm:h-44">
        <RecreationScene type={rec.scene} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/tags/${encodeURIComponent(rec.category)}`}
          className="inline-block rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[13px] font-bold text-navy hover:bg-accent hover:text-white"
        >
          {rec.category}
        </Link>
        <span className="rounded-full bg-background px-2.5 py-0.5 text-[13px] font-bold text-muted">
          {rec.grades.join("・")}むき
        </span>
      </div>
      <h1 className="mt-2 mb-1 text-2xl font-bold">
        <span aria-hidden="true">{rec.emoji} </span>
        {rec.title}
      </h1>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FavoriteButton kind="recreation" slug={rec.slug} />
        {rec.occasions.map((occasion) => (
          <span
            key={occasion}
            className="rounded-full border border-line px-2.5 py-0.5 text-[13px] font-bold text-muted"
          >
            {occasion}
          </span>
        ))}
      </div>

      <dl className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {meta.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-line bg-white p-2.5 text-center"
          >
            <dt className="text-[11px] text-muted">
              <span aria-hidden="true">{item.icon} </span>
              {item.label}
            </dt>
            <dd className="mt-0.5 text-[13px] font-bold text-navy">{item.value}</dd>
          </div>
        ))}
      </dl>

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
          <span aria-hidden="true">⚠️ </span>
          <span className="font-bold">安全のために：</span>
          {rec.safety}
        </div>
      )}

      {rec.tip && (
        <div className="mt-4 rounded-2xl bg-good-bg p-4 text-sm text-good">
          <span aria-hidden="true">💡 </span>
          <span className="font-bold">コツ：</span>
          {rec.tip}
        </div>
      )}

      {rec.variation && (
        <div className="mt-4 rounded-2xl bg-[#EAF2FA] p-4 text-sm text-navy">
          <span aria-hidden="true">🔄 </span>
          <span className="font-bold">アレンジ：</span>
          {rec.variation}
        </div>
      )}

      {relatedIcebreaker && (
        <Link
          href={`/lessons/icebreakers/${relatedIcebreaker.slug}`}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 hover:border-accent"
        >
          <span className="text-xl" aria-hidden="true">
            {relatedIcebreaker.emoji}
          </span>
          <span className="text-sm">
            <span className="font-bold">アイスブレイク特集にも掲載</span>
            <span className="block text-muted">
              {relatedIcebreaker.title}（{relatedIcebreaker.duration}）のやり方を見る
            </span>
          </span>
          <span className="ml-auto shrink-0 text-sm text-accent" aria-hidden="true">
            →
          </span>
        </Link>
      )}

      <nav className="mt-8 flex flex-col gap-2 sm:flex-row" aria-label="同じカテゴリーの前後のレク">
        {prev && (
          <Link
            href={`/lessons/recreations/${prev.slug}`}
            className="flex-1 rounded-2xl border border-line bg-white p-4 text-sm hover:border-accent"
          >
            <span className="block text-[13px] text-muted">← 時間が短いもの</span>
            <span className="font-bold">
              <span aria-hidden="true">{prev.emoji} </span>
              {prev.title}
            </span>
          </Link>
        )}
        {next && (
          <Link
            href={`/lessons/recreations/${next.slug}`}
            className="flex-1 rounded-2xl border border-line bg-white p-4 text-sm hover:border-accent sm:text-right"
          >
            <span className="block text-[13px] text-muted">時間が長いもの →</span>
            <span className="font-bold">
              <span aria-hidden="true">{next.emoji} </span>
              {next.title}
            </span>
          </Link>
        )}
      </nav>

      {samePlace.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-navy">
            同じ場所（{rec.places.join("・")}）でできる、ほかのレク
          </h2>
          <div className="flex flex-col gap-2">
            {samePlace.map((item) => (
              <Link
                key={item.slug}
                href={`/lessons/recreations/${item.slug}`}
                className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 hover:border-accent"
              >
                <span className="text-xl" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="text-sm font-bold">{item.title}</span>
                <span className="ml-auto shrink-0 text-[13px] text-muted">
                  {item.duration}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link
        href="/lessons/recreations"
        className="mt-8 block rounded-2xl border border-line bg-white p-4 text-center text-sm font-bold text-accent hover:border-accent"
      >
        ← 学級レク一覧（全{recreations.length}種類）にもどる
      </Link>
    </section>
  );
}
