import type { Metadata } from "next";
import { getLifeContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "忙しい先生のためのページ | 全国教員支援ポータル",
  description: "休暇や育児・介護に関する制度の名前と意味を、パッと見てわかる形でまとめたページ。",
};

export const revalidate = 60;

export default async function LifePage() {
  const { termGroups, officialLinksForLife } = await getLifeContent();
  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Teacher&apos;s Life
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">💼 忙しい先生のためのページ</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          「これって何のこと？」を、困ったときにパッと見てわかるようにまとめました。
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-warn-line bg-warn-bg p-4 text-sm text-warn">
        ここで紹介している制度・日数は、国家公務員の基準を「一例」として使っています。
        休暇の種類の数・分類・日数は都道府県・市区町村ごとに条例で定められており、
        この一例とは異なることが珍しくありません。まずは大まかなイメージをつかむための
        参考として使い、実際に使うときは必ずお勤め先の都道府県・市区町村の公式サイトや
        教育委員会・共済組合でご確認ください。
      </div>

      <div className="flex flex-col gap-8">
        {termGroups.map((group) => (
          <div key={group.groupTitle}>
            <h2 className="mb-1 flex items-center gap-2 text-base font-bold">
              <span>{group.icon}</span>
              {group.groupTitle}
            </h2>
            {group.groupNote && (
              <p className="mb-3 text-sm text-muted">{group.groupNote}</p>
            )}
            <div className="flex flex-col gap-3">
              {group.terms.map((term) => (
                <div key={term.name} className="rounded-2xl border border-line bg-white p-4">
                  <h3 className="text-sm font-bold text-navy">{term.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {term.description}
                  </p>
                  {term.subItems && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-bold text-accent">
                        特別休暇の種類を全て見る（{term.subItems.length}種類）
                      </summary>
                      <p className="mt-3 mb-2 text-[13px] text-muted">
                        🟡 黄色マーカーは、多くの人が働く中で実際に使う場面がある休暇です。
                      </p>
                      <div className="flex flex-col gap-2">
                        {term.subItems.map((item) => (
                          <div
                            key={item.name}
                            className={`rounded-xl border p-3 ${
                              item.common
                                ? "border-warn-line bg-warn-bg"
                                : "border-line bg-background"
                            }`}
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span className="text-sm font-bold">{item.name}</span>
                              <span className="text-[13px] text-muted">
                                人規15-14 {item.article}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-muted">{item.duration}</p>
                            {item.note && (
                              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                                {item.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-line bg-white p-5">
        <h2 className="mb-3 text-sm font-bold text-navy">
          正確な日数・金額・手続きを知りたいとき
        </h2>
        <p className="mb-3 text-sm text-muted">
          全国共通で使える、国の公式窓口をまとめています。
        </p>
        <div className="flex flex-col gap-3">
          {officialLinksForLife.map((link) => (
            <div key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-accent hover:underline"
              >
                {link.linkName} →
              </a>
              <span className="mt-0.5 block text-sm text-muted">{link.note}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          休暇の種類・日数は都道府県・市区町村ごとの条例で決まっているため、正式な日数を
          確認したいときは、お住まいの都道府県・市区町村名＋「職員 勤務時間 休暇 条例」で
          検索すると、公式の条例・規則のページが見つかります。共済組合の支部や互助会の
          窓口を探すときは、都道府県名＋「教職員 共済組合」または「教職員 互助会」で
          検索してください。
        </p>
      </div>
    </section>
  );
}
