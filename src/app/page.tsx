import Link from "next/link";
import { tools } from "@/lib/tools";

const pillars = [
  {
    icon: "🛠",
    title: "自作ツールポータル",
    body: "成績処理・時間割作成・プリント生成など、現場発の自作ツールをブラウザですぐに使える形で公開。",
  },
  {
    icon: "📰",
    title: "情報発信メディア",
    body: "ICT活用事例、授業アイデア、時短術など、明日から使える情報を発信。",
  },
  {
    icon: "💬",
    title: "教員コミュニティ",
    body: "悩みや工夫を投稿・相談できる掲示板。全国の先生同士がゆるやかにつながる場所。",
  },
];

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-br from-navy to-navy-dark px-8 pt-14 pb-20 text-center text-white">
        <h1 className="mx-auto mb-4 text-3xl font-extrabold tracking-wide text-balance md:text-4xl">
          先生の「時間」と「工夫」を、
          <br />
          もっとシェアできる場所へ。
        </h1>
        <p className="mx-auto mb-7 max-w-xl text-sm text-[#DCE8F2]">
          校務・授業を助ける自作ツール、現場のノウハウ、教員同士のつながり。
          <br />
          日本中の教員が使いやすい情報とツールを、ここに集めます。
        </p>
        <div className="mx-auto flex max-w-lg gap-1.5 rounded-full bg-white p-1.5 shadow-xl">
          <input
            type="text"
            placeholder="例）成績処理　時間割　プリント作成 で検索"
            className="flex-1 rounded-full border-none px-4 py-2.5 text-sm text-[#1E2732] outline-none"
          />
          <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white">
            検索する
          </button>
        </div>
        <div className="mt-9 flex flex-wrap justify-center gap-12">
          <div className="text-center">
            <div className="text-2xl font-extrabold">{tools.length}</div>
            <div className="text-xs text-[#B9CEDD]">公開中の自作ツール</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold">準備中</div>
            <div className="text-xs text-[#B9CEDD]">掲載記事・実践事例</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold">全国</div>
            <div className="text-xs text-[#B9CEDD]">対応校種：小・中・高</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-8 py-14">
        <div className="mb-9 text-center">
          <div className="text-xs font-bold tracking-widest text-accent uppercase">
            Three Pillars
          </div>
          <h2 className="mt-2 mb-2 text-2xl font-bold">サイトの3つの柱</h2>
          <p className="mx-auto max-w-lg text-sm text-muted">
            「使えるツール」「読める情報」「頼れる仲間」を1つの場所に。
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2FA] text-xl text-navy">
                {pillar.icon}
              </div>
              <h3 className="mb-2 text-base font-bold">{pillar.title}</h3>
              <p className="text-sm text-muted">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-5xl px-8 py-14">
        <div className="mb-9 text-center">
          <div className="text-xs font-bold tracking-widest text-accent uppercase">
            Tool Portal
          </div>
          <h2 className="mt-2 mb-2 text-2xl font-bold">自作ツールカタログ</h2>
          <p className="mx-auto max-w-lg text-sm text-muted">
            現場で実際に使えるツールを、これからも増やしていきます。
          </p>
        </div>
        <div className="grid gap-4.5 md:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
            >
              <div className="flex h-24 items-center justify-center bg-gradient-to-br from-[#EAF2FA] to-[#DCE6F1] text-3xl text-navy">
                {tool.icon}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[10px] font-bold text-navy"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="text-sm font-bold">{tool.name}</h4>
                <p className="flex-1 text-xs text-muted">{tool.description}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-good">
                  ✓ 開発者本人による自作ツール
                </div>
              </div>
              <Link
                href={`/tools/${tool.slug}`}
                className="bg-navy py-2.5 text-center text-xs font-bold text-white"
              >
                ツールを開く
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="articles" className="mx-auto max-w-5xl px-8 py-14">
        <div className="mb-9 text-center">
          <div className="text-xs font-bold tracking-widest text-accent uppercase">
            Media
          </div>
          <h2 className="mt-2 mb-2 text-2xl font-bold">記事・コラム</h2>
          <p className="mx-auto max-w-lg text-sm text-muted">
            準備中です。教員の「困った」を解決する記事を今後発信していきます。
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted">
          記事は現在準備中です。公開までしばらくお待ちください。
          <div className="mt-4">
            <Link href="/articles" className="font-bold text-accent hover:underline">
              記事ページ（準備中）を見る →
            </Link>
          </div>
        </div>
      </section>

      <section id="community" className="mx-auto max-w-5xl px-8 py-14">
        <div className="mb-9 text-center">
          <div className="text-xs font-bold tracking-widest text-accent uppercase">
            Community
          </div>
          <h2 className="mt-2 mb-2 text-2xl font-bold">教員コミュニティ</h2>
          <p className="mx-auto max-w-lg text-sm text-muted">
            準備中です。相談・情報交換の掲示板を今後実装していきます。
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted">
          コミュニティ機能は現在準備中です。
          <div className="mt-4">
            <Link href="/community" className="font-bold text-accent hover:underline">
              コミュニティページ（準備中）を見る →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
