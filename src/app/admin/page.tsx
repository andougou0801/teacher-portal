"use client";

import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";

const menu = [
  {
    href: "/admin/articles",
    icon: "📝",
    title: "記事・コラム",
    description: "記事やコラムの追加・編集・削除、下書き保存ができます。",
  },
  {
    href: "/admin/tools",
    icon: "🧰",
    title: "ツールの表示設定",
    description:
      "ツールをサイトに表示するかどうかと、並び順を変更できます。ツール本体の追加は開発者へご依頼ください。",
  },
  {
    href: "/admin/qa",
    icon: "💬",
    title: "Q&Aの管理",
    description:
      "投稿された質問・回答を確認し、不適切なものを非表示にしたり削除したりできます。",
  },
];

export default function AdminHomePage() {
  return (
    <AdminShell title="管理メニュー">
      <div className="flex flex-col gap-3">
        {menu.map((item) => (
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
      <p className="mt-6 text-sm text-muted">
        変更内容は、サイト側には最大1分ほどで反映されます。
      </p>
    </AdminShell>
  );
}
