import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchShortcut from "@/components/SearchShortcut";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchShortcut />
      <div className="bg-warn-bg px-4 py-2 text-center text-sm text-warn border-b border-warn-line">
        このサイトは開発中のプロジェクトです。ツール・記事・Q&Aなど掲載しているものは実際にお使いいただけます。少しずつ改良を続けていますので、ご意見・ご要望はQ&Aからお気軽にどうぞ。
      </div>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
