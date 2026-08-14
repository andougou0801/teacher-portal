import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "記事・コラム | 全国教員支援ポータル（仮称）",
};

const sampleArticles = [
  {
    category: "ICT活用",
    title: "採点・所見作成を半分の時間にした3つの工夫",
    meta: "現職教員の実践レポート・5分で読める",
    big: true,
  },
  {
    category: "授業アイデア",
    title: "盛り上がる係活動の決め方",
    meta: "3分で読める",
    big: false,
  },
  {
    category: "時短術",
    title: "職員会議の資料作りを効率化する",
    meta: "4分で読める",
    big: false,
  },
];

export default function ArticlesPage() {
  return (
    <section className="mx-auto max-w-5xl px-8 py-14">
      <div className="mb-9 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Media
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">記事・コラム</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          教員の「困った」を解決する記事や、現場発のアイデアを紹介していく予定です。
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-[#F2D98A] bg-[#FFF7E0] p-5 text-center text-sm text-[#8A6D00]">
        この記事一覧は今後掲載予定の記事イメージ（サンプル）です。実際の記事はまだ公開されていません。
      </div>

      <div className="grid gap-4.5 md:grid-cols-3">
        {sampleArticles.map((article) => (
          <div
            key={article.title}
            className={`overflow-hidden rounded-2xl border border-line bg-white ${
              article.big ? "md:col-span-1" : ""
            }`}
          >
            <div
              className={`bg-gradient-to-br from-[#F0F4F8] to-line ${
                article.big ? "h-50" : "h-30"
              }`}
            />
            <div className="p-4">
              <div className="text-[10px] font-extrabold tracking-wide text-accent">
                {article.category}
              </div>
              <h4
                className={`my-1.5 font-bold ${
                  article.big ? "text-lg" : "text-sm"
                }`}
              >
                {article.title}
              </h4>
              <div className="text-[11px] text-muted">{article.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
