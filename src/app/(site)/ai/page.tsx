import type { Metadata } from "next";
import { getAiGuides, getPageText } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageText("ai");
  return {
    title: `${page.heading} | 全国教員支援ポータル`,
    description: page.lead,
  };
}

export default async function AiPage() {
  const [page, aiGuides] = await Promise.all([getPageText("ai"), getAiGuides()]);
  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          {page.eyebrow}
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">
          {page.emoji} {page.heading}
        </h1>
        <p className="mx-auto max-w-lg text-sm text-muted">{page.lead}</p>
      </div>

      <div className="flex flex-col gap-5">
        {aiGuides.map((guide) => (
          <div key={guide.slug} className="rounded-2xl border border-line bg-white p-5">
            <span className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[13px] font-bold text-navy">
              {guide.tool}
            </span>
            <h3 className="my-1.5 text-base font-bold">{guide.title}</h3>
            <p className="mb-3 text-sm text-muted">{guide.summary}</p>

            <div className="mb-3">
              <div className="mb-1 text-sm font-bold text-navy">何ができる？</div>
              <p className="text-sm text-muted">{guide.whatItDoes}</p>
            </div>

            <div className="mb-3">
              <div className="mb-1 text-sm font-bold text-navy">どう使う？</div>
              <ol className="list-decimal space-y-1 pl-4 text-sm text-muted">
                {guide.howToUse.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="mb-3">
              <div className="mb-1 text-sm font-bold text-navy">実際のプロンプト例</div>
              <p className="rounded-xl bg-background p-3 text-sm text-[#1E2732]">
                {guide.samplePrompt}
              </p>
            </div>

            <div className="rounded-xl border border-warn-line bg-warn-bg p-3 text-sm text-warn">
              ⚠ {guide.caution}
            </div>
          </div>
        ))}
      </div>

      {page.topics.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-navy">{page.topicsTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {page.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-muted"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
