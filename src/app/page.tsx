import Link from "next/link";
import { tools } from "@/lib/tools";
import { articles } from "@/lib/articles";
import { categories } from "@/lib/categories";

export default function Home() {
  const [featuredArticle] = articles;
  const liveTools = tools.filter((tool) => tool.status === "live");
  const featuredTools = liveTools
    .filter((tool) => tool.audience === "teacher")
    .slice(0, 3);

  return (
    <>
      <section className="bg-gradient-to-br from-navy to-navy-dark px-8 pt-14 pb-20 text-center text-white">
        <h1 className="mx-auto mb-4 text-3xl font-extrabold tracking-wide text-balance md:text-4xl">
          先生の困ったを、すぐ解決。
        </h1>
        <p className="mx-auto mb-7 max-w-xl text-sm text-[#DCE8F2]">
          授業・学級経営・教材・学校生活をサポートする教育ポータル。
        </p>
        <form
          action="/search"
          method="get"
          className="mx-auto flex max-w-lg gap-1.5 rounded-full bg-white p-1.5 shadow-xl"
        >
          <input
            type="text"
            name="q"
            placeholder="何を探していますか？ 例：算数プリント、学級開き、保護者対応"
            className="flex-1 rounded-full border-none px-4 py-2.5 text-sm text-[#1E2732] outline-none"
          />
          <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white">
            検索する
          </button>
        </form>
        <div className="mt-9 flex flex-wrap justify-center gap-12">
          <div className="text-center">
            <div className="text-2xl font-extrabold">{liveTools.length}</div>
            <div className="text-xs text-[#B9CEDD]">公開中の自作ツール</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold">{articles.length}</div>
            <div className="text-xs text-[#B9CEDD]">掲載記事・実践事例</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold">全国</div>
            <div className="text-xs text-[#B9CEDD]">対応校種：小・中・高</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-8 py-14">
        <div className="mb-9 text-center">
          <div className="text-xs font-bold tracking-widest text-accent uppercase">
            Categories
          </div>
          <h2 className="mt-2 mb-2 text-2xl font-bold">どこから探しますか？</h2>
          <p className="mx-auto max-w-lg text-sm text-muted">
            困りごとから、カテゴリーごとにすぐたどり着けます。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="relative flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-4 text-center"
            >
              {category.status === "coming-soon" && (
                <span className="absolute top-2 right-2 rounded-full bg-background px-2 py-0.5 text-[9px] font-bold text-muted">
                  準備中
                </span>
              )}
              <div className="text-2xl">{category.icon}</div>
              <div className="text-xs font-bold">{category.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-5xl px-8 py-14">
        <div className="mb-9 text-center">
          <div className="text-xs font-bold tracking-widest text-accent uppercase">
            Tool Portal
          </div>
          <h2 className="mt-2 mb-2 text-2xl font-bold">先生の便利ツール</h2>
          <p className="mx-auto max-w-lg text-sm text-muted">
            現場で実際に使えるツールを、これからも増やしていきます。
          </p>
        </div>
        <div className="grid gap-4.5 md:grid-cols-3">
          {featuredTools.map((tool) => (
            <div
              key={tool.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
            >
              <div className="flex h-24 items-center justify-center bg-gradient-to-br from-[#EAF2FA] to-[#DCE6F1] text-3xl text-navy">
                {tool.icon}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[10px] font-bold text-navy"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="text-sm font-bold">{tool.name}</h4>
                <p className="flex-1 text-xs text-muted">{tool.description}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-good">
                  ✓ 開発者本人による自作ツール
                </div>
              </div>
              <Link
                href={`/tools/${tool.slug}`}
                className="bg-navy py-2.5 text-center text-xs font-bold text-white"
              >
                ツールを開く
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/tools" className="font-bold text-accent hover:underline">
            先生の便利ツール一覧を見る →
          </Link>
        </div>
      </section>

      <section id="articles" className="mx-auto max-w-5xl px-8 py-14">
        <div className="mb-9 text-center">
          <div className="text-xs font-bold tracking-widest text-accent uppercase">
            Media
          </div>
          <h2 className="mt-2 mb-2 text-2xl font-bold">記事・コラム</h2>
          <p className="mx-auto max-w-lg text-sm text-muted">
            教員の「困った」を解決する記事を発信していきます。
          </p>
        </div>
        {featuredArticle && (
          <Link
            href={`/articles/${featuredArticle.slug}`}
            className="block overflow-hidden rounded-2xl border border-line bg-white md:flex"
          >
            <div className="h-40 bg-gradient-to-br from-[#F0F4F8] to-line md:h-auto md:w-64 md:shrink-0" />
            <div className="p-6">
              <div className="text-[10px] font-extrabold tracking-wide text-accent">
                {featuredArticle.category}
              </div>
              <h4 className="my-2 text-lg font-bold">{featuredArticle.title}</h4>
              <p className="text-sm text-muted">{featuredArticle.summary}</p>
              <div className="mt-3 text-[11px] text-muted">
                {featuredArticle.author}・{featuredArticle.readTime}
              </div>
            </div>
          </Link>
        )}
        <div className="mt-4 text-center">
          <Link href="/articles" className="font-bold text-accent hover:underline">
            記事一覧を見る →
          </Link>
        </div>
      </section>

      <section id="community" className="mx-auto max-w-5xl px-8 py-14">
        <div className="mb-9 text-center">
          <div className="text-xs font-bold tracking-widest text-accent uppercase">
            Community
          </div>
          <h2 className="mt-2 mb-2 text-2xl font-bold">教員コミュニティ</h2>
          <p className="mx-auto max-w-lg text-sm text-muted">
            準備中です。相談・情報交換の掲示板を今後実装していきます。
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted">
          コミュニティ機能は現在準備中です。
          <div className="mt-4">
            <Link href="/community" className="font-bold text-accent hover:underline">
              コミュニティページ（準備中）を見る →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
