import type { Metadata } from "next";
import Link from "next/link";
import IcebreakerScene from "@/components/IcebreakerScene";
import { icebreakers, icebreakerCategories } from "@/lib/icebreakers";
import { getCategoryBorderColor } from "@/lib/categoryColor";

export const metadata: Metadata = {
  title: "アイスブレイク大特集 | 全国教員支援ポータル（仮称）",
  description: `時間・場所・人数・やり方が一目でわかる、すぐ使えるアイスブレイク集（全${icebreakers.length}種類）。`,
};

export default function IcebreakersPage() {
  return (
    <section className="mx-auto max-w-4xl px-8 py-14">
      <div className="mb-8 text-center">
        <Link href="/lessons" className="mb-3 inline-block text-sm font-bold text-accent">
          ← 授業・教材アイデアにもどる
        </Link>
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Ice Breakers
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">🎉 アイスブレイク大特集</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          全{icebreakers.length}種類。気になるものをタップすると、やり方をイラスト付きで詳しく紹介します。
        </p>
      </div>

      {icebreakerCategories.map((category) => {
        const items = icebreakers.filter((ib) => ib.category === category);
        return (
          <div key={category} className="mb-10">
            <h2 className="mb-3 text-sm font-bold text-navy">
              {category}（{items.length}件）
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((ib) => (
                <Link
                  key={ib.slug}
                  href={`/lessons/icebreakers/${ib.slug}`}
                  className={`overflow-hidden rounded-2xl border border-line border-l-4 bg-white ${getCategoryBorderColor(ib.category)}`}
                >
                  <div className="h-28">
                    <IcebreakerScene type={ib.scene} />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold">
                      {ib.emoji} {ib.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-background px-2 py-0.5 text-[13px] font-bold text-navy">
                        ⏱ {ib.duration}
                      </span>
                      <span className="rounded-full bg-background px-2 py-0.5 text-[13px] font-bold text-navy">
                        👥 {ib.groupSize}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
