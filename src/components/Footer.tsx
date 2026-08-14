import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "サイトについて" },
  { href: "/about#provide", label: "ツールを提供したい方へ" },
  { href: "/about#join", label: "運営チームに参加する" },
  { href: "/about#contact", label: "お問い合わせ" },
  { href: "/about#privacy", label: "プライバシーポリシー" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy-dark px-8 py-9 text-center text-xs text-[#B9CEDD]">
      <div className="mb-5 flex flex-wrap justify-center gap-10 text-sm">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="opacity-85 hover:opacity-100 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div>© 2026 全国教員支援ポータル（仮称）・個人プロジェクトとして開発中</div>
    </footer>
  );
}
