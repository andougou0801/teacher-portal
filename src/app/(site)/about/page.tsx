import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "このサイトについて | 全国教員支援ポータル（仮称）",
};

const roadmap = [
  {
    phase: "フェーズ0：企画・チーム編成",
    detail: "ビジョン確定、役割分担、技術選定",
    status: "done" as const,
  },
  {
    phase: "フェーズ1：MVP開発",
    detail: "トップページ＋自作ツール掲載＋簡易記事",
    status: "current" as const,
  },
  {
    phase: "フェーズ2：クローズドβ",
    detail: "知人の教員10〜30名に試用してもらいフィードバック収集",
    status: "next" as const,
  },
  {
    phase: "フェーズ3：正式公開",
    detail: "SNS・教育委員会・教員向けポータル等への掲載依頼",
    status: "next" as const,
  },
  {
    phase: "フェーズ4：運用・拡大",
    detail: "新規ツール追加、コミュニティ活性化、法人化検討",
    status: "next" as const,
  },
];

const references = [
  {
    name: "SENSEIポータル",
    note: "全国の教員向け研修・セミナー情報を集約。検索・ブックマーク機能を参考にしています。",
  },
  {
    name: "グローバル教師ポータルサイト",
    note: "在外教育施設の教員向け実践事例・動画共有。実践事例の蓄積・共有の仕組みを参考にしています。",
  },
  {
    name: "文部科学省 校長・教職員学習情報ポータル",
    note: "国が運営する研修・学習情報の公式ポータル。信頼性の担保のあり方を参考にしています。",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-10 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          About
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">このサイトについて</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          日本中の教員が「使いやすい」と感じられる、大規模な情報・ツール共有サイトを目指しています。
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <h2 className="mb-2 text-lg font-bold text-navy">ビジョン</h2>
          <p className="text-sm text-muted">
            単なる情報発信にとどまらず、開発者自身が制作した自作ツール（校務効率化・授業支援ツールなど）を実際に配信し、全国の現場で活用してもらうことを核とします。
            個人開発から始まり、志を共にする仲間を集めたプロジェクトチームによって継続的に運営・拡張されるプラットフォームを目指しています。
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-navy">対象ユーザー</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>小学校・中学校・高等学校の現職教員</li>
            <li>教育委員会・管理職</li>
            <li>教職志望者・講師</li>
            <li>個人でツールを開発している教員・エンジニア</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-navy">参考にしている先行事例</h2>
          <p className="mb-3 text-sm text-muted">
            すでに教員向けに情報発信・共有を行っている、以下のようなサイトを参考にしながら企画しています。
          </p>
          <ul className="flex flex-col gap-3">
            {references.map((ref) => (
              <li
                key={ref.name}
                className="rounded-xl border border-line bg-white p-3.5 text-sm"
              >
                <span className="font-bold">{ref.name}</span>
                <span className="mt-1 block text-sm text-muted">{ref.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div id="provide">
          <h2 className="mb-2 text-lg font-bold text-navy">
            ツールを提供したい方へ
          </h2>
          <p className="text-sm text-muted">
            校務・授業を助ける自作ツールをお持ちの方は、ぜひ掲載にご協力ください。ブラウザですぐ使える形であれば、カテゴリ別にカタログ掲載します。
            詳細な掲載フローは準備中です。まずは下記の連絡先までご相談ください。
          </p>
        </div>

        <div id="join">
          <h2 className="mb-2 text-lg font-bold text-navy">
            運営チームに参加する
          </h2>
          <p className="mb-2 text-sm text-muted">
            現在、以下のような役割で一緒に進めてくれる仲間を探しています。
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>プロジェクトマネージャー（全体統括・渉外）</li>
            <li>プロダクト企画（教員経験者が望ましい）</li>
            <li>フロントエンド／バックエンドエンジニア</li>
            <li>UI/UXデザイナー</li>
            <li>コンテンツ編集（現職・元教員が理想）</li>
            <li>コミュニティ運営、広報・SNS担当</li>
            <li>法務・個人情報保護アドバイザー</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold text-navy">ロードマップ</h2>
          <p className="mb-3 text-sm text-muted">
            現在はフェーズ1（MVP開発）の段階です。今後の流れは以下を予定しています。
          </p>
          <ol className="flex flex-col gap-2.5">
            {roadmap.map((step) => (
              <li
                key={step.phase}
                className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm ${
                  step.status === "current"
                    ? "border-accent bg-[#EAF2FA]"
                    : "border-line bg-white"
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[13px] font-bold ${
                    step.status === "done"
                      ? "bg-[#E7F3EC] text-good"
                      : step.status === "current"
                        ? "bg-accent text-white"
                        : "bg-background text-muted"
                  }`}
                >
                  {step.status === "done"
                    ? "完了"
                    : step.status === "current"
                      ? "進行中"
                      : "予定"}
                </span>
                <div>
                  <div className="font-bold">{step.phase}</div>
                  <div className="mt-0.5 text-sm text-muted">{step.detail}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div id="contact">
          <h2 className="mb-2 text-lg font-bold text-navy">お問い合わせ</h2>
          <p className="text-sm text-muted">
            ツール掲載のご相談・運営チームへの参加希望など、お気軽にご連絡ください。
            （お問い合わせフォームは準備中です）
          </p>
        </div>

        <div id="privacy">
          <h2 className="mb-2 text-lg font-bold text-navy">
            プライバシーポリシー
          </h2>
          <p className="mb-2 text-sm text-muted">
            本サイトは開発中のMVPです。現時点では、氏名・住所・成績など児童生徒の個人情報をサーバーに
            保存する機能は実装していません。掲載しているツールは、入力されたデータを可能な限りブラウザ内
            だけで処理する設計を優先しています。
          </p>
          <p className="text-sm text-muted">
            将来的に会員登録などの機能を追加する場合は、個人情報保護法に対応したセキュリティ設計を
            あらためて行った上で、本ポリシーを更新します。
          </p>
        </div>
      </div>
    </section>
  );
}
