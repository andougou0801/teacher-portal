import type { Metadata } from "next";
import { qaItems } from "@/lib/qa";

export const metadata: Metadata = {
  title: "先生の「困った！」Q&A | 全国教員支援ポータル（仮称）",
  description: "教員が検索しそうな悩みをQ&A形式でまとめたページ。",
};

const upcomingTopics = [
  "保護者に電話するとき何を話せばいい？",
  "個人懇談で何を話せばいい？",
  "学級開きで何をすればいい？",
];

export default function QaPage() {
  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Q&A
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">
          ❓ 先生の「困った！」Q&A
        </h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          教員が検索しそうな悩みを、Q&A形式でまとめています。気になる質問をタップして開いてください。
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {qaItems.map((item) => (
          <details
            key={item.slug}
            className="group rounded-2xl border border-line bg-white p-5"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
              <span>
                <span className="mr-2 rounded-full bg-[#EAF2FA] px-2 py-0.5 text-[10px] font-bold text-navy">
                  {item.category}
                </span>
                <span className="text-sm font-bold">Q. {item.question}</span>
              </span>
              <span className="shrink-0 text-muted transition-transform group-open:rotate-45">
                ＋
              </span>
            </summary>
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3 text-sm leading-loose text-muted">
              {item.answer.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-navy">今後追加予定の質問（例）</h2>
        <div className="flex flex-col gap-2">
          {upcomingTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-xl border border-line bg-white px-3 py-2 text-xs text-muted"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
