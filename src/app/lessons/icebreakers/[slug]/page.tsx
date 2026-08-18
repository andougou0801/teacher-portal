import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import IcebreakerScene from "@/components/IcebreakerScene";
import { icebreakers, getIcebreakerBySlug } from "@/lib/icebreakers";

export function generateStaticParams() {
  return icebreakers.map((ib) => ({ slug: ib.slug }));
}

export async function generateMetadata(
  props: PageProps<"/lessons/icebreakers/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const ib = getIcebreakerBySlug(slug);
  return {
    title: ib ? `${ib.title} | 全国教員支援ポータル（仮称）` : "アイスブレイク",
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
        className="mb-6 inline-block text-xs font-bold text-accent"
      >
        ← アイスブレイク一覧にもどる
      </Link>

      <div className="mb-5 h-48 overflow-hidden rounded-2xl border border-line">
        <IcebreakerScene type={ib.scene} />
      </div>

      <span className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[10px] font-bold text-navy">
        {ib.category}
      </span>
      <h1 className="mt-2 mb-4 text-2xl font-bold">
        {ib.emoji} {ib.title}
      </h1>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg">⏱</div>
          <div className="mt-1 text-[11px] font-bold text-navy">{ib.duration}</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg">📍</div>
          <div className="mt-1 text-[11px] font-bold text-navy">{ib.place}</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg">👥</div>
          <div className="mt-1 text-[11px] font-bold text-navy">{ib.groupSize}</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 text-center">
          <div className="text-lg">🧰</div>
          <div className="mt-1 text-[11px] font-bold text-navy">{ib.materials}</div>
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
        <div className="mt-4 rounded-2xl bg-[#FFF7E0] p-4 text-sm text-[#8A6D00]">
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
