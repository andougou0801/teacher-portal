import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/lib/tools";
import { getCategoryBorderColor } from "@/lib/categoryColor";
import FavoriteButton from "@/components/FavoriteButton";

export const metadata: Metadata = {
  title: "子どもの便利ツール | 全国教員支援ポータル（仮称）",
  description:
    "漢字・計算・タイピングなど、子どもが学校や家庭で使える学習ツールをまとめるページです。",
};

export default function KidsPage() {
  const kidsTools = tools.filter((tool) => tool.audience === "student");
  const liveTools = kidsTools.filter((tool) => tool.status === "live");
  const plannedTools = kidsTools.filter((tool) => tool.status === "planned");

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

      <div className="grid gap-4.5 md:grid-cols-3">
        {liveTools.map((tool) => (
          <div
            key={tool.slug}
            className={`flex flex-col overflow-hidden rounded-2xl border border-line border-l-4 bg-white ${getCategoryBorderColor(tool.tags[0])}`}
          >
            <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-[#EAF2FA] to-[#DCE6F1] text-3xl text-navy">
              {tool.icon}
              <FavoriteButton
                kind="tool"
                slug={tool.slug}
                className="absolute top-1 right-1 bg-white/70"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[13px] font-bold text-navy hover:bg-accent hover:text-white"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <h3 className="text-sm font-bold">{tool.name}</h3>
              <p className="flex-1 text-sm text-muted">{tool.description}</p>
              <div className="flex items-center gap-1 text-[13px] font-bold text-good">
                ✓ 開発者本人による自作ツール
              </div>
            </div>
            <Link
              href={`/tools/${tool.slug}`}
              className="bg-cta py-3 text-center text-sm font-bold text-white hover:bg-cta-dark"
            >
              ツールを開く
            </Link>
          </div>
        ))}
      </div>

      {plannedTools.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-center text-sm font-bold text-navy">
            作成予定のツール
          </h2>
          <div className="grid gap-3.5 md:grid-cols-3">
            {plannedTools.map((tool) => (
              <div
                key={tool.slug}
                className="flex flex-col gap-1.5 rounded-2xl border border-dashed border-line bg-white p-4 opacity-80"
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span>{tool.icon}</span>
                  {tool.name}
                </div>
                <p className="text-sm text-muted">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
