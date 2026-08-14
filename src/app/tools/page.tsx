import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "自作ツールカタログ | 全国教員支援ポータル（仮称）",
};

export default function ToolsPage() {
  return (
    <section className="mx-auto max-w-5xl px-8 py-14">
      <div className="mb-9 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Tool Portal
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">自作ツールカタログ</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          校務・授業の負担を減らす自作ツールを、ブラウザですぐに使える形で公開しています。
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
  );
}
