"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "/tools", label: "ツール" },
  { href: "/articles", label: "記事・コラム" },
  { href: "/community", label: "コミュニティ" },
  { href: "/about", label: "このサイトについて" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-white"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <nav className="absolute top-full right-0 left-0 flex flex-col gap-1 bg-navy px-8 pb-4 text-sm shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 opacity-90 hover:bg-navy-dark hover:opacity-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
