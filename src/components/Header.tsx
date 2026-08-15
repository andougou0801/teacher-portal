import Link from "next/link";
import MobileNav from "./MobileNav";

const navItems = [
  { href: "/tools", label: "ツール" },
  { href: "/articles", label: "記事・コラム" },
  { href: "/community", label: "コミュニティ" },
  { href: "/about", label: "このサイトについて" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-navy px-8 py-4 text-white">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-base font-extrabold text-navy">
          先
        </span>
        全国教員支援ポータル（仮称）
      </Link>
      <nav className="hidden gap-7 text-sm md:flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="opacity-90 hover:opacity-100 hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/about"
          className="rounded-full bg-white px-4 py-2 text-xs font-bold text-navy"
        >
          教員登録（無料）
        </Link>
        <MobileNav />
      </div>
    </header>
  );
}
