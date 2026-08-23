import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "忙しい先生のためのページ | 全国教員支援ポータル",
  description: "福利厚生・休暇・手当など、先生自身の生活を支える制度への入り口をまとめたページ。",
};

type LifeLink = {
  icon: string;
  title: string;
  description: string;
  linkName: string;
  url: string;
};

const lifeLinks: LifeLink[] = [
  {
    icon: "🌴",
    title: "休暇制度",
    description:
      "年次休暇・病気休暇・特別休暇（結婚・忌引・出産補助など）といった、教職員が使える休暇の種類は自治体の規則で定められています。",
    linkName: "岐阜県教育委員会「教職員の働き方改革」",
    url: "https://www.pref.gifu.lg.jp/site/edu/16206.html",
  },
  {
    icon: "👶",
    title: "育児・介護に関する制度",
    description:
      "育児休業・育児短時間勤務・育児休業支援手当金・介護休暇など、子育てや家族の介護と仕事を両立するための制度です。",
    linkName: "公立学校共済組合 岐阜支部",
    url: "https://www.kouritu.or.jp/gifu/about/index.html",
  },
  {
    icon: "🏥",
    title: "共済組合の各種給付",
    description:
      "医療費の給付、健康診断・保健指導、出産・弔慰金など、公立学校共済組合を通じて受けられる保障です。",
    linkName: "公立学校共済組合 岐阜支部",
    url: "https://www.kouritu.or.jp/gifu/",
  },
  {
    icon: "🤝",
    title: "教職員互助会の福利厚生事業",
    description:
      "共済組合とは別に、教職員互助会が独自に行っている福利厚生事業（生活支援・レクリエーション等）があります。",
    linkName: "岐阜県教職員互助会",
    url: "https://www.gikyogo.jp/",
  },
];

export default function LifePage() {
  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Teacher&apos;s Life
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">💼 忙しい先生のためのページ</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          「先生の仕事」だけでなく「先生自身の生活」を支える制度への入り口をまとめました。
          まずは岐阜県のケースを例に、どんな制度があるかを紹介しています。
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-warn-line bg-warn-bg p-4 text-sm text-warn">
        休暇の日数・手当の金額・対象条件などの具体的な内容は、都道府県・市区町村ごとに異なります。
        このページは「こういう制度がある」という入り口の紹介にとどめ、正確な最新情報は必ず
        リンク先の公式サイトや、お勤め先の教育委員会・共済組合にご確認ください。
      </div>

      <div className="flex flex-col gap-4">
        {lifeLinks.map((item) => (
          <div key={item.title} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <h2 className="text-base font-bold">{item.title}</h2>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-bold text-accent hover:underline"
                >
                  {item.linkName}を見る →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        岐阜県以外の先生は、お住まいの都道府県・市区町村名＋「教職員 共済組合」または
        「教職員 互助会」で検索すると、同じような制度の窓口が見つかります。
      </p>
    </section>
  );
}
