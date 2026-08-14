import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "このサイトについて | 全国教員支援ポータル（仮称）",
};

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
          <p className="text-sm text-muted">
            本サイトは開発中のMVPです。児童生徒の個人情報を扱うツールは特に厳重な取り扱いを必須とし、個人情報保護法に対応したポリシーを正式公開に向けて整備していきます。
          </p>
        </div>
      </div>
    </section>
  );
}
