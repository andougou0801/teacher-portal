"use client";

import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";

/**
 * 記事は掲載先ごとに入り口を分けている。
 * 1つの画面にまとめると、別の場所に出すつもりの記事を取りちがえやすいため
 * （2026-11-03、運営者の指示）。
 */
const groups = [
  {
    title: "記事を書く・直す",
    note: "ページごとに入り口が分かれています。開いた入り口の記事だけが並びます。",
    items: [
      {
        href: "/admin/articles?area=lesson",
        icon: "📚",
        title: "授業・教材アイデアの記事",
        description: "/lessons に並ぶ記事。教科のタグを付けられます。",
      },
      {
        href: "/admin/articles?area=classroom",
        icon: "🏫",
        title: "学級経営の記事",
        description: "/classroom に並ぶ記事。場面のタグと、行事の記事なら時期を付けられます。",
      },
      {
        href: "/admin/articles?area=column",
        icon: "✏️",
        title: "先生のコラム",
        description: "/column に並ぶコラム。",
      },
      {
        href: "/admin/articles?area=other",
        icon: "📄",
        title: "そのほかの記事",
        description: "どのページにも並べず、記事一覧（/articles）にだけ出す記事。",
      },
      {
        href: "/admin/articles?area=all",
        icon: "🗃",
        title: "すべての記事をまとめて見る",
        description: "掲載先を気にせず、ぜんぶの記事を一覧にします。",
      },
    ],
  },
  {
    title: "サイトの設定",
    note: null,
    items: [
      {
        href: "/admin/tools",
        icon: "🧰",
        title: "ツールの表示設定",
        description:
          "ツールをサイトに表示するかどうかと、並び順を変更できます。ツール本体の追加は開発者へご依頼ください。",
      },
      {
        href: "/admin/links",
        icon: "🔗",
        title: "便利な公式サイト集",
        description: "サイト集に出すリンクの追加・編集・削除、並べかえ、表示/非表示ができます。",
      },
      {
        href: "/admin/ai",
        icon: "🤖",
        title: "先生のAI活用ガイド",
        description: "AI活用ガイドの追加・編集・削除、並べかえ、表示/非表示ができます。",
      },
      {
        href: "/admin/life",
        icon: "💼",
        title: "忙しい先生のためのページ",
        description: "休暇や育児・介護の制度の説明を、まとまりごとに追加・編集・削除できます。",
      },
      {
        href: "/admin/categories",
        icon: "🗂",
        title: "カテゴリーとページ",
        description:
          "「学級経営」「授業・教材アイデア」などの名前・絵文字・説明・並び順と、そのページを開いた中の見出し・紹介文・テーマ一覧を変えられます。",
      },
      {
        href: "/admin/activities",
        icon: "🎲",
        title: "アイスブレイク・学級レク",
        description: "遊びの中身の追加・編集・削除、並べかえ、表示/非表示ができます。",
      },
      {
        href: "/admin/qa",
        icon: "💬",
        title: "Q&Aの管理",
        description:
          "投稿された質問・回答を確認し、不適切なものを非表示にしたり削除したりできます。",
      },
    ],
  },
];

export default function AdminHomePage() {
  return (
    <AdminShell title="管理メニュー">
      {groups.map((group) => (
        <div key={group.title} className="mb-8 last:mb-0">
          <h2 className="mb-1 text-sm font-bold text-navy">{group.title}</h2>
          {group.note && <p className="mb-3 text-sm text-muted">{group.note}</p>}
          <div className="flex flex-col gap-3">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex gap-3 rounded-2xl border border-line bg-white p-4 hover:border-accent"
              >
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <div className="text-sm font-bold">{item.title}</div>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <p className="mt-6 text-sm text-muted">
        変更内容は、サイト側には最大1分ほどで反映されます。
      </p>
    </AdminShell>
  );
}
