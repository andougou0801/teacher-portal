import type { Metadata } from "next";
import Link from "next/link";
import RecreationFilter from "@/components/RecreationFilter";
import { recreations } from "@/lib/recreations";

export const metadata: Metadata = {
  title: "学級レク特集 | 全国教員支援ポータル",
  description: `〇〇鬼などのそとあそびから、ハンカチ落としなどの室内遊びまで。場面・場所・学年で絞り込める学級レク集（全${recreations.length}種類）。所要時間・準備・安全面の確認つき。`,
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
          「こんなときに」「場所」「学年」で絞り込めます。
        </p>
        <p className="mx-auto mt-2 max-w-lg text-[13px] text-muted">
          「はじめる前に決めておくこと」と「45分1コマの組み立て例」は、ページのいちばん下にまとめています。
        </p>
      </div>

      <RecreationFilter items={recreations} />

      <div className="mb-6 flex flex-col gap-2">
        <details className="rounded-2xl border border-line bg-white px-5 py-3">
          <summary className="cursor-pointer text-sm font-bold text-navy">
            はじめる前に決めておくこと（4つ）
          </summary>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted">
            <li>・遊んでよい範囲（コート）と、終わりの合図を先に伝える。</li>
            <li>
              ・<strong className="font-bold text-navy">「あと1回」は最初に約束しておく。</strong>
              「時計の〇分で終わり」「あと2回やったら終わり」と先に言っておくと、「もう1回！」で長引きません。
            </li>
            <li>・勝ち負けのあるレクは、負けた人が長く待たない終わり方にしておく。</li>
            <li>
              ・
              <strong className="font-bold text-navy">
                参加がむずかしい子がいたら、役割よりも先にルールの変更を考える。
              </strong>
              「転がす」「座ったまま」「歩くだけ」に変えれば、一緒に遊べることがほとんどです（各ページの「みんなが入れるように」を参照）。
            </li>
          </ul>
        </details>

        <details className="rounded-2xl border border-line bg-white px-5 py-3">
          <summary className="cursor-pointer text-sm font-bold text-navy">
            45分1コマの組み立て例
          </summary>
          <ol className="mt-2 flex flex-col gap-1.5 text-sm text-muted">
            <li>
              <span className="font-bold text-navy">① 準備・説明（10分）</span>
              ：机を下げる、ルールを全員で確認する。
            </li>
            <li>
              <span className="font-bold text-navy">② 短いもので体をほぐす（5〜10分）</span>
              ：じゃんけん列車、ボール送りリレーなど、全員がすぐ動けるもの。
            </li>
            <li>
              <span className="font-bold text-navy">③ メイン（15〜20分）</span>
              ：ドッジボール、けいどろ、ビンゴ大会など、盛り上がるものを1つだけ。
            </li>
            <li>
              <span className="font-bold text-navy">④ 静かに終わる（5分）</span>
              ：10秒ぴったりチャレンジなど。次の授業への切りかえがしやすくなります。
            </li>
          </ol>
          <p className="mt-2 text-[13px] text-muted">
            ※各レクの「所要時間」に準備・片づけは入っていません。詳細ページの「準備」の目安と合わせて計画してください。
          </p>
        </details>
      </div>

      <div className="rounded-2xl border border-accent bg-[#EAF2FA] p-5 text-center">
        <p className="text-sm text-navy">
          朝の会や授業の導入に使う、もっと短い活動をお探しなら、
          <Link href="/lessons/icebreakers" className="font-bold text-accent underline">
            アイスブレイク大特集
          </Link>
          もあわせてどうぞ。
        </p>
      </div>
    </section>
  );
}
