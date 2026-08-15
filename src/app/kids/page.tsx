import type { Metadata } from "next";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "子どもの便利ツール | 全国教員支援ポータル（仮称）",
  description:
    "漢字・計算・タイピングなど、子どもが学校や家庭で使える学習ツールをまとめるページです（準備中）。",
};

export default function KidsPage() {
  const kidsTools = tools.filter((tool) => tool.audience === "student");

  return (
    <section className="mx-auto max-w-5xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          For Kids
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">🎮 子どもの便利ツール</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          漢字・計算・タイピングなど、子どもが学校や家庭で楽しく使える学習ツールをここに集めます。
          大きなボタンとシンプルな操作で、スマホ・タブレットでも使いやすい形を目指します。
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-[#F2D98A] bg-[#FFF7E0] p-5 text-center text-sm text-[#8A6D00]">
        子ども向けツールは現在準備中です。下記は今後追加予定のツールの一覧です。
      </div>

      <div className="grid gap-4.5 md:grid-cols-3">
        {kidsTools.map((tool) => (
          <div
            key={tool.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-dashed border-line bg-white opacity-80"
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
