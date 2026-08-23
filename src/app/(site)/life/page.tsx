import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "忙しい先生のためのページ | 全国教員支援ポータル",
  description: "休暇や育児・介護に関する制度の名前と意味を、パッと見てわかる形でまとめたページ。",
};

type SubItem = { name: string; article: string; duration: string };

type Term = {
  name: string;
  description: string;
  subItems?: SubItem[];
};

type TermGroup = {
  icon: string;
  groupTitle: string;
  groupNote?: string;
  terms: Term[];
};

// 国家公務員の休暇制度（人事院規則15-14）をもとにした一覧。
// 地方公務員（教員含む）の条例も、通常この基準に準じて定められているが、
// 正式な条文番号・日数は自治体の条例で確認する必要がある。
const tokubetsuKyukaItems: SubItem[] = [
  { name: "公民権行使（選挙の投票など）", article: "第22条1項1号", duration: "必要と認められる期間" },
  { name: "官公署への出頭", article: "第22条1項2号", duration: "必要と認められる期間" },
  { name: "骨髄移植のためのドナー登録・提供", article: "第22条1項3号", duration: "必要と認められる期間" },
  { name: "ボランティア活動", article: "第22条1項4号", duration: "1年に5日以内" },
  { name: "結婚", article: "第22条1項5号", duration: "連続5暦日以内（結婚の5日前〜結婚後1か月まで）" },
  { name: "出生サポート（不妊治療の通院等）", article: "第22条1項5号の2", duration: "1年に5日以内（体外受精・顕微授精は10日）" },
  { name: "産前休暇", article: "第22条1項6号", duration: "6週間（多胎妊娠は14週間）" },
  { name: "産後休暇", article: "第22条1項7号", duration: "8週間" },
  { name: "保育時間（生後1年未満の子の授乳等）", article: "第22条1項8号", duration: "1日2回、各30分以内" },
  { name: "妻の出産に伴う休暇", article: "第22条1項9号", duration: "2日以内" },
  { name: "男性の育児参加のための休暇", article: "第22条1項10号", duration: "5日以内" },
  { name: "子の看護（就学前の子の病気・予防接種等）", article: "第22条1項11号", duration: "1年に5日以内（子2人以上は10日）" },
  { name: "短期の介護", article: "第22条1項12号", duration: "1年に5日以内（要介護者2人以上は10日）" },
  { name: "忌引（親族が亡くなったとき）", article: "第22条1項13号", duration: "親族との続柄により日数が異なる" },
  { name: "父母の追悼（祥月命日など）", article: "第22条1項14号", duration: "1日以内（父母の死後15年まで）" },
  { name: "夏季休暇", article: "第22条1項15号", duration: "7〜9月の間で連続3日以内" },
  { name: "現住居の滅失・破損（災害等）", article: "第22条1項16号", duration: "連続7暦日以内" },
  { name: "出勤困難（交通機関の途絶等）", article: "第22条1項17号", duration: "必要と認められる期間" },
  { name: "退勤途上の危険回避（災害等）", article: "第22条1項18号", duration: "必要と認められる期間" },
];

const termGroups: TermGroup[] = [
  {
    icon: "🌴",
    groupTitle: "休みたいときに使える休暇の種類",
    groupNote:
      "以下は国家公務員の基準（人事院規則15-14）をもとにした一覧です。教員も含めた地方公務員は、通常これに準じた条例が自治体ごとに定められていますが、条文番号や日数が異なる場合があるので、正確なところは勤務先の条例でご確認ください。",
    terms: [
      {
        name: "年次有給休暇（年休）",
        description:
          "理由を問わず、自分の都合で自由に取得できる休暇です。「休みたいから休む」で使えるのはこれです。国家公務員の基準では年20日（人事院規則15-14 第18〜20条）で、多くの自治体もこれに準じています。",
      },
      {
        name: "病気休暇",
        description:
          "本人がケガや病気で療養が必要なときに取る休暇です（人事院規則15-14 第21条）。私傷病・妊産疾病は原則連続90日まで、生理日の就業困難や公務・通勤上の傷病、勤務軽減措置も同じ条文でまとめて定められています。年休とは別枠で、医師の診断書などが必要になることが多いです。",
      },
      {
        name: "特別休暇",
        description:
          "結婚・忌引・出産・介護・災害など、特別な事情があるときに認められる休暇です（人事院規則15-14 第22条）。実は下記のように号（条文の中の項目番号）ごとに細かく種類が分かれています。号をタップすると詳細が開きます。",
        subItems: tokubetsuKyukaItems,
      },
      {
        name: "介護休暇・介護時間",
        description:
          "家族の介護が必要になったときに取れる制度です。「介護休暇」はまとまった期間仕事を休む制度（通算6か月以内、3回まで分割可）、「介護時間」は働きながら1日2時間まで勤務時間を短くできる制度（連続3年以内）で、それぞれ別に定められています。",
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
                  {term.subItems && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-bold text-accent">
                        特別休暇の種類を全て見る（{term.subItems.length}種類）
                      </summary>
                      <div className="mt-2 flex flex-col gap-2">
                        {term.subItems.map((item) => (
                          <div
                            key={item.name}
                            className="rounded-xl border border-line bg-background p-3"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span className="text-sm font-bold">{item.name}</span>
                              <span className="text-[13px] text-muted">
                                人規15-14 {item.article}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-muted">{item.duration}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
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
