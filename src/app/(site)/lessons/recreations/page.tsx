import type { Metadata } from "next";
import Link from "next/link";
import RecreationScene from "@/components/RecreationScene";
import {
  recreations,
  recreationCategories,
  sortRecreations,
} from "@/lib/recreations";
import { getCategoryBorderColor } from "@/lib/categoryColor";

export const metadata: Metadata = {
  title: "学級レク特集 | 全国教員支援ポータル",
  description: `〇〇鬼などのそとあそびから、ハンカチ落としなどの室内遊びまで。時間・場所・人数・やり方が一目でわかる学級レク集（全${recreations.length}種類）。`,
};

export default function RecreationsPage() {
  return (
    <section className="mx-auto max-w-4xl px-8 py-14">
      <div className="mb-8 text-center">
        <Link href="/lessons" className="mb-3 inline-block text-sm font-bold text-accent">
          ← 授業・教材アイデアにもどる
        </Link>
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Class Recreations
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">🏃 学級レク特集</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          全{recreations.length}種類。〇〇鬼などのそとあそびから、ハンカチ落としのような室内レクまで、
          気になるものをタップするとやり方をイラスト付きで紹介します。
        </p>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          各カテゴリーの中は、短い時間でできるものから順に並んでいます（同じ時間なら準備物が要らないものが先）。
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-line bg-white p-5">
        <h2 className="mb-2 text-sm font-bold text-navy">はじめる前に決めておくこと</h2>
        <ul className="flex flex-col gap-1.5 text-sm text-muted">
          <li>・遊んでよい範囲（コート）と、終わりの合図を先に伝える。</li>
          <li>・勝ち負けのあるレクは、負けた人が長く待たない終わり方にしておく。</li>
          <li>・見学の子には「音楽係」「得点係」など、参加できる役割を用意しておく。</li>
        </ul>
      </div>

      {recreationCategories.map((category) => {
        const items = sortRecreations(
          recreations.filter((rec) => rec.category === category),
        );
        return (
          <div key={category} className="mb-10">
            <h2 className="mb-3 text-sm font-bold text-navy">
              {category}（{items.length}件）
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((rec) => (
                <Link
                  key={rec.slug}
                  href={`/lessons/recreations/${rec.slug}`}
                  className={`overflow-hidden rounded-2xl border border-line border-l-4 bg-white ${getCategoryBorderColor(rec.category)}`}
                >
                  <div className="h-28">
                    <RecreationScene type={rec.scene} />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold">
                      {rec.emoji} {rec.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-background px-2 py-0.5 text-[13px] font-bold text-navy">
                        ⏱ {rec.duration}
                      </span>
                      <span className="rounded-full bg-background px-2 py-0.5 text-[13px] font-bold text-navy">
                        👥 {rec.groupSize}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <div className="rounded-2xl border border-accent bg-[#EAF2FA] p-5 text-center">
        <p className="text-sm text-navy">
          5分以内でできる短い活動をお探しなら、
          <Link href="/lessons/icebreakers" className="font-bold text-accent underline">
            アイスブレイク大特集
          </Link>
          もあわせてどうぞ。
        </p>
      </div>
    </section>
  );
}
