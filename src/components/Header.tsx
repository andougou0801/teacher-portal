import Link from "next/link";
import MobileNav from "./MobileNav";
import { navItems } from "@/lib/nav";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-navy px-5 py-4 text-white sm:px-8">
      <Link
        href="/"
        className="flex items-center gap-2 text-base font-bold whitespace-nowrap sm:text-xl"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-base font-extrabold text-navy">
          先
        </span>
        全国教員支援ポータル
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
        {/*
          スマートフォンの幅では、この丸いボタンを置くと題名と並びきらず、
          文字が1文字ずつ縦に折り返されてしまう。幅の狭い画面では隠し、
          代わりに「☰」のメニューの中に「サイトについて」を入れている。
        */}
        <Link
          href="/about"
          className="hidden rounded-full bg-cta px-4 py-2 text-sm font-bold whitespace-nowrap text-white hover:bg-cta-dark md:inline-block"
        >
          サイトについて
        </Link>
        <MobileNav />
      </div>
    </header>
  );
}
