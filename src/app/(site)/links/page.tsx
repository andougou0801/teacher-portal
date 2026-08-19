import type { Metadata } from "next";
import {
  officialLinks,
  officialLinksNote,
  type OfficialLink,
} from "@/lib/officialLinks";

export const metadata: Metadata = {
  title: "便利な公式サイト集 | 全国教員支援ポータル（仮称）",
  description:
    "文部科学省・NHK for Schoolなど、教員が必要とする公式サイトをまとめて紹介します。",
};

const categories: OfficialLink["category"][] = [
  "教育委員会・公的機関",
  "プリント・ドリル",
  "ぬりえ",
  "めいろ・なぞなぞ",
];

export default function LinksPage() {
  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Official Links
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">🔗 便利な公式サイト集</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          教員が必要とする公式サイトを、何ができるか・どんなときに使うかとあわせて紹介します。
        </p>
      </div>

      {categories.map((category) => {
        const links = officialLinks.filter((link) => link.category === category);
        if (links.length === 0) return null;
        return (
          <div key={category} className="mb-10">
            <h2 className="mb-3 text-sm font-bold text-navy">
              {category}（{links.length}件）
            </h2>
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-line bg-white p-4"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">{link.name}</h3>
                    <span className="rounded-full bg-background px-2 py-0.5 text-[13px] font-bold text-muted">
                      外部サイト ↗
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted">{link.description}</p>
                  <p className="mt-1 text-sm font-bold text-navy">
                    使うタイミング：{link.whenToUse}
                  </p>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-center text-sm text-muted">{officialLinksNote}</p>
    </section>
  );
}
