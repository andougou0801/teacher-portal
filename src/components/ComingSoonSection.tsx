type ComingSoonSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  topics?: string[];
};

export default function ComingSoonSection({
  eyebrow,
  title,
  description,
  topics,
}: ComingSoonSectionProps) {
  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          {eyebrow}
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">{title}</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">{description}</p>
      </div>

      <div className="rounded-2xl border border-[#F2D98A] bg-[#FFF7E0] p-6 text-center text-sm text-[#8A6D00]">
        このページは準備中です。公開までしばらくお待ちください。
      </div>

      {topics && topics.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-navy">掲載予定の内容（例）</h2>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-muted"
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
