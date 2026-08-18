import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "全国教員支援ポータル（仮称）",
  description:
    "現場発の自作ツール・実践記事・教員コミュニティを1つにまとめた、全国の教員のための支援ポータルサイト。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="bg-warn-bg px-4 py-1.5 text-center text-xs text-warn border-b border-warn-line">
          このサイトは立ち上げ準備中のMVPです。掲載ツールは実際に使えますが、記事・コミュニティ機能は準備中です。
        </div>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
