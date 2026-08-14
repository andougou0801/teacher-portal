import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "教員コミュニティ | 全国教員支援ポータル（仮称）",
};

const sampleThreads = [
  {
    title: "保護者対応で困っています。良い声かけの例はありますか？",
    info: "小学校・6年担任　5時間前",
    replies: 14,
  },
  {
    title: "自作の採点補助ツール、使ってみた感想を教えてください",
    info: "中学校・国語科　昨日",
    replies: 9,
  },
  {
    title: "来年度に向けたICT研修、おすすめの内容ありますか？",
    info: "高等学校・情報科　2日前",
    replies: 6,
  },
];

export default function CommunityPage() {
  return (
    <section className="mx-auto max-w-5xl px-8 py-14">
      <div className="mb-9 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Community
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">教員コミュニティ</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          相談・情報交換の掲示板を今後実装していく予定です。
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-[#F2D98A] bg-[#FFF7E0] p-5 text-center text-sm text-[#8A6D00]">
        この掲示板は完成イメージ（サンプル）です。投稿・返信機能はまだ実装されていません。
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        {sampleThreads.map((thread, i) => (
          <div
            key={thread.title}
            className={`flex items-center justify-between gap-4 py-3.5 text-sm ${
              i !== sampleThreads.length - 1 ? "border-b border-line" : ""
            }`}
          >
            <div>
              <div className="font-bold">{thread.title}</div>
              <div className="mt-1 text-[11px] text-muted">{thread.info}</div>
            </div>
            <div className="shrink-0 rounded-lg bg-background px-3 py-1 text-[11px] font-bold text-navy">
              返信 {thread.replies}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
