import type { Metadata } from "next";
import Link from "next/link";
import { icebreakers } from "@/lib/icebreakers";

export const metadata: Metadata = {
  title: "アイスブレイク大特集 | 全国教員支援ポータル（仮称）",
  description:
    "時間・場所・人数・やり方が一目でわかる、すぐ使えるアイスブレイク集。",
};

export default function IcebreakersPage() {
  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <Link href="/lessons" className="mb-3 inline-block text-xs font-bold text-accent">
          ← 授業・教材アイデアにもどる
        </Link>
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Ice Breakers
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">🎉 アイスブレイク大特集</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          見てすぐ分かる・すぐ使える、{icebreakers.length}個のアイスブレイクを集めました。
          時間や場所、人数を確認して、その場に合ったものを選んでください。
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {icebreakers.map((ib) => (
          <div key={ib.slug} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FA] text-xl">
                {ib.emoji}
              </div>
              <div>
                <h2 className="text-base font-bold">{ib.title}</h2>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-[10px] font-bold text-navy">
                    ⏱ {ib.duration}
                  </span>
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-[10px] font-bold text-navy">
                    📍 {ib.place}
                  </span>
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-[10px] font-bold text-navy">
                    👥 {ib.groupSize}
                  </span>
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-[10px] font-bold text-navy">
                    🧰 {ib.materials}
                  </span>
                </div>
              </div>
            </div>

            <ol className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4 text-sm leading-relaxed">
              {ib.steps.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 font-bold text-accent">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            {ib.tip && (
              <div className="mt-3 rounded-xl bg-[#FFF7E0] px-3 py-2 text-xs text-[#8A6D00]">
                💡 {ib.tip}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
