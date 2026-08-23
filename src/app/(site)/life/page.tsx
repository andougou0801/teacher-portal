import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "忙しい先生のためのページ | 全国教員支援ポータル",
  description: "休暇や育児・介護に関する制度の名前と意味を、パッと見てわかる形でまとめたページ。",
};

type TermGroup = {
  icon: string;
  groupTitle: string;
  groupNote?: string;
  terms: { name: string; description: string }[];
};

const termGroups: TermGroup[] = [
  {
    icon: "🌴",
    groupTitle: "休みたいときに使える休暇の種類",
    terms: [
      {
        name: "年次有給休暇（年休）",
        description:
          "理由を問わず、自分の都合で自由に取得できる休暇です。「休みたいから休む」で使えるのはこれです。多くの自治体で、常勤の教職員には年間20日前後が付与されます（前年の残日数を一部繰り越せる場合もあります）。",
      },
      {
        name: "病気休暇",
        description:
          "本人がケガや病気で療養が必要なときに取る休暇です。年休とは別枠で、医師の診断書などが必要になることが多く、年休より要件が厳しめです。",
      },
      {
        name: "特別休暇",
        description:
          "結婚・忌引（親族が亡くなったとき）・出産の付き添い・生理休暇・公務中のケガなど、特別な事情があるときに認められる休暇です。年休や病気休暇とは別枠で、種類・日数は自治体の条例で定められています。",
      },
      {
        name: "介護休暇",
        description:
          "家族の介護が必要になったときに取れる休暇です。対象になる家族の範囲や取得できる期間は、育児関連の制度と同様に定めがあります。",
      },
    ],
  },
  {
    icon: "👶",
    groupTitle: "育児・介護と仕事を両立するための制度",
    groupNote:
      "似た名前の制度が多く混同しやすいので、代表的な3つの違いをまとめました。",
    terms: [
      {
        name: "育児休業",
        description:
          "子が3歳になるまで取得できる、仕事を完全に休む制度です。ただし育児休業手当金（給与の代わりに支給されるお金）が出るのは、原則子が1歳になるまで（両親で交代して取る「パパ・ママプラス」を使うと1歳2か月まで）という点に注意が必要です。",
      },
      {
        name: "育児短時間勤務（育短）",
        description:
          "子が小学校に入学するまでの間、常勤のまま1日の勤務時間そのものを短くできる制度です。原則1年以内の単位で申請しますが、間隔をあけて申請し直せば、通算で最大2年ほど利用できます。",
      },
      {
        name: "部分休業（部分休）",
        description:
          "子が小学校に入学するまでの間、1日2時間を超えない範囲で（30分単位で）勤務時間を短くできる制度です。育短と似ていますが、短くできる時間の上限や仕組みが異なります。休んだ時間分は給与から差し引かれ、ボーナスの査定にも影響することがあります。",
      },
    ],
  },
];

const officialLinksForLife = [
  {
    linkName: "岐阜県教育委員会「教職員の働き方改革」",
    url: "https://www.pref.gifu.lg.jp/site/edu/16206.html",
  },
  {
    linkName: "公立学校共済組合 岐阜支部（医療費・出産・弔慰金などの給付）",
    url: "https://www.kouritu.or.jp/gifu/",
  },
  {
    linkName: "岐阜県教職員互助会（共済組合とは別の福利厚生事業）",
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
          「これって何のこと？」を、困ったときにパッと見てわかるようにまとめました。
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-warn-line bg-warn-bg p-4 text-sm text-warn">
        ここでは、制度の名前と大まかな意味を紹介しています。日数・金額・対象条件の
        正確な数字は都道府県・市区町村によって異なるため、実際に使うときは
        お勤め先の教育委員会・共済組合に必ずご確認ください。
      </div>

      <div className="flex flex-col gap-8">
        {termGroups.map((group) => (
          <div key={group.groupTitle}>
            <h2 className="mb-1 flex items-center gap-2 text-base font-bold">
              <span>{group.icon}</span>
              {group.groupTitle}
            </h2>
            {group.groupNote && (
              <p className="mb-3 text-sm text-muted">{group.groupNote}</p>
            )}
            <div className="flex flex-col gap-3">
              {group.terms.map((term) => (
                <div key={term.name} className="rounded-2xl border border-line bg-white p-4">
                  <h3 className="text-sm font-bold text-navy">{term.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {term.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-line bg-white p-5">
        <h2 className="mb-3 text-sm font-bold text-navy">
          正確な日数・金額・手続きを知りたいとき
        </h2>
        <p className="mb-3 text-sm text-muted">
          岐阜県のケースを例に、公式の窓口をまとめています。
        </p>
        <div className="flex flex-col gap-2">
          {officialLinksForLife.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-accent hover:underline"
            >
              {link.linkName} →
            </a>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          岐阜県以外の先生は、お住まいの都道府県・市区町村名＋「教職員 共済組合」または
          「教職員 互助会」で検索すると、同じような制度の窓口が見つかります。
        </p>
      </div>
    </section>
  );
}
