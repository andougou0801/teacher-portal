import type { Metadata } from "next";
import {
  officialLinks,
  officialLinksNote,
  type OfficialLink,
} from "@/lib/officialLinks";

export const metadata: Metadata = {
  title: "便利な公式サイト集 | 全国教員支援ポータル",
  description:
    "プリント・ぬりえ・なぞなぞから、教科の理解を深めるサイト、教科書会社の授業サポート、朝の会で使える毎日の話題まで、教員に役立つサイトをまとめて紹介します。",
};

const categories: OfficialLink["category"][] = [
  "教育委員会・公的機関",
  "プリント・ドリル",
  "教科の理解を深める",
  "教科書会社の授業サポート",
  "毎日の話題（朝の会・帰りの会）",
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
          授業準備に使えるサイトを、何ができるか・どんなときに使うかとあわせて紹介します。
          プリントやぬりえだけでなく、教科の理解を深めるサイト、教科書会社の授業サポート、
          朝の会で紹介できる毎日の話題も集めました。
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
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold">{link.name}</h3>
                    {link.subject && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[13px] font-bold text-accent">
                        {link.subject}
                      </span>
                    )}
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
