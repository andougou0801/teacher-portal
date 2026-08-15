import type { Metadata } from "next";
import { aiGuides } from "@/lib/aiGuides";

export const metadata: Metadata = {
  title: "先生のAI活用 | 全国教員支援ポータル（仮称）",
  description: "生成AIを授業準備や校務に活かすための入門ガイド。",
};

const upcomingTopics = [
  "Claude Code", "Canva", "AIによるアイデア出し", "AIを使った学級経営",
  "教育現場でのAI活用事例",
];

export default function AiPage() {
  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          AI for Teachers
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">🤖 先生のAI活用</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          「何ができる？」「どう使う？」「実際のプロンプト」まで、初心者にも分かる形で紹介します。
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {aiGuides.map((guide) => (
          <div key={guide.slug} className="rounded-2xl border border-line bg-white p-5">
            <span className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[10px] font-bold text-navy">
              {guide.tool}
            </span>
            <h2 className="my-1.5 text-base font-bold">{guide.title}</h2>
            <p className="mb-3 text-xs text-muted">{guide.summary}</p>

            <div className="mb-3">
              <div className="mb-1 text-xs font-bold text-navy">何ができる？</div>
              <p className="text-xs text-muted">{guide.whatItDoes}</p>
            </div>

            <div className="mb-3">
              <div className="mb-1 text-xs font-bold text-navy">どう使う？</div>
              <ol className="list-decimal space-y-1 pl-4 text-xs text-muted">
                {guide.howToUse.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="mb-3">
              <div className="mb-1 text-xs font-bold text-navy">実際のプロンプト例</div>
              <p className="rounded-xl bg-background p-3 text-xs text-[#1E2732]">
                {guide.samplePrompt}
              </p>
            </div>

            <div className="rounded-xl border border-[#F2D98A] bg-[#FFF7E0] p-3 text-xs text-[#8A6D00]">
              ⚠ {guide.caution}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-navy">今後扱っていくテーマ（例）</h2>
        <div className="flex flex-wrap gap-2">
          {upcomingTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-muted"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
