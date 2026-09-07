import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理画面 | 全国教員支援ポータル",
  // 管理画面は検索結果に出さない
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-background">{children}</div>;
}
