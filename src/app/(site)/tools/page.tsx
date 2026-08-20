import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/lib/tools";
import { getCategoryBorderColor } from "@/lib/categoryColor";

export const metadata: Metadata = {
  title: "先生の便利ツール | 全国教員支援ポータル（仮称）",
  description: "採点・プリント作成・時間割など、教員の仕事をすぐ効率化できるツール一覧。",
};

export default function ToolsPage() {
  const teacherTools = tools.filter((tool) => tool.audience === "teacher");
  const liveTools = teacherTools.filter((tool) => tool.status === "live");
  const plannedTools = teacherTools.filter((tool) => tool.status === "planned");

  return (
    <section className="mx-auto max-w-5xl px-8 py-14">
      <div className="mb-9 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Tool Portal
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">🧰 先生の便利ツール</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          校務・授業の負担を減らすツールを、ブラウザですぐに使える形で公開しています。
        </p>
      </div>

      <div className="grid gap-4.5 md:grid-cols-3">
        {liveTools.map((tool) => (
          <div
            key={tool.slug}
            className={`flex flex-col overflow-hidden rounded-2xl border border-line border-l-4 bg-white ${getCategoryBorderColor(tool.tags[0])}`}
          >
            <div className="flex h-24 items-center justify-center bg-gradient-to-br from-[#EAF2FA] to-[#DCE6F1] text-3xl text-navy">
              {tool.icon}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[13px] font-bold text-navy"
                  >
                    {tag}
                  </span>
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
