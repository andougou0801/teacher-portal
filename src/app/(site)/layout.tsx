import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchShortcut from "@/components/SearchShortcut";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchShortcut />
      <div className="bg-warn-bg px-4 py-2 text-center text-sm text-warn border-b border-warn-line">
        このサイトは立ち上げ準備中のMVPです。掲載ツールは実際に使えますが、記事・コミュニティ機能は準備中です。
      </div>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
