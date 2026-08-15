import Link from "next/link";
import { categories } from "@/lib/categories";

const aboutLinks = [
  { href: "/about", label: "サイトについて" },
  { href: "/about#provide", label: "ツールを提供したい方へ" },
  { href: "/about#join", label: "運営チームに参加する" },
  { href: "/about#contact", label: "お問い合わせ" },
  { href: "/about#privacy", label: "プライバシーポリシー" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy-dark px-8 py-9 text-xs text-[#B9CEDD]">
      <div className="mx-auto mb-8 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-3 md:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.href}
            className="opacity-85 hover:opacity-100 hover:underline"
          >
            {category.icon} {category.label}
          </Link>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap justify-center gap-10 border-t border-white/10 pt-5 text-sm">
        {aboutLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="opacity-85 hover:opacity-100 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="text-center">
        © 2026 全国教員支援ポータル（仮称）・個人プロジェクトとして開発中
      </div>
    </footer>
  );
}
