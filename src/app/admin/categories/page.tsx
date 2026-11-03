"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseClient } from "@/lib/supabaseClient";

type Card = {
  href: string;
  emoji: string;
  title: string;
  description: string;
  countFrom: string;
};

type CategoryRow = {
  id: string;
  slug: string;
  label: string;
  icon: string;
  description: string;
  href: string;
  status: string;
  sort_order: number;
  hidden: boolean;
};

/** そのカテゴリーのページの中身（ある3ページだけ） */
type PageRow = {
  id: string;
  slug: string;
  eyebrow: string;
  lead: string;
  topics_title: string;
  topics: string[];
  cards: Card[];
};

type Draft = {
  category: CategoryRow;
  page: PageRow | null;
  topicsText: string;
};

const SETUP_MESSAGE =
  "この画面を使うには、supabase/007_site_categories.sql をSupabaseのSQL Editorで1回実行してください。";

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<CategoryRow[] | null>(null);
  const [pages, setPages] = useState<Record<string, PageRow>>({});
  const [draft, setDraft] = useState<Draft | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const load = useCallback(async () => {
    if (!supabase) {
      setMessage("Supabaseの設定が見つかりません。");
      setRows([]);
      return;
    }
    const { data, error } = await supabase
      .from("site_categories")
      .select("id,slug,label,icon,description,href,status,sort_order,hidden")
      .order("sort_order", { ascending: true });
    if (error) {
      setMessage(
        error.message.includes("site_categories")
          ? SETUP_MESSAGE
          : `読み込みに失敗しました：${error.message}`,
      );
      setRows([]);
      return;
    }
    setRows((data ?? []) as CategoryRow[]);

    // ページの中身は、ある3ページぶんだけ入っている（無くても画面は動く）
    const { data: pageData } = await supabase
      .from("page_texts")
      .select("id,slug,eyebrow,lead,topics_title,topics,cards");
    const map: Record<string, PageRow> = {};
    ((pageData ?? []) as PageRow[]).forEach((p) => {
      map[p.slug] = p;
    });
    setPages(map);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  function startEdit(row: CategoryRow) {
    const page = pages[row.slug] ?? null;
    setDraft({
      category: { ...row },
      page: page ? { ...page, topics: [...page.topics], cards: page.cards.map((c) => ({ ...c })) } : null,
      topicsText: page ? page.topics.join("\n") : "",
    });
    setMessage(null);
  }

  async function save() {
    if (!supabase || !draft) return;
    const { category, page } = draft;
    if (!category.label.trim()) {
      setMessage("名前は必ず入れてください。");
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();

    const { error } = await supabase
      .from("site_categories")
      .update({
        label: category.label.trim(),
        icon: category.icon.trim(),
        description: category.description.trim(),
        status: category.status,
        updated_at: now,
      })
      .eq("id", category.id);

    if (error) {
      setSaving(false);
      setMessage(`保存できませんでした：${error.message}`);
      return;
    }

    if (page) {
      const topics = draft.topicsText
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      // 名前と絵文字はカテゴリー側が正。ここへは同じものを写しておく
      const { error: pageError } = await supabase
        .from("page_texts")
        .update({
          eyebrow: page.eyebrow.trim(),
          emoji: category.icon.trim(),
          heading: category.label.trim(),
          lead: page.lead.trim(),
          topics_title: page.topics_title.trim(),
          topics,
          cards: page.cards,
          updated_at: now,
        })
        .eq("id", page.id);
      if (pageError) {
        setSaving(false);
        setMessage(`ページの中身を保存できませんでした：${pageError.message}`);
        return;
      }
    }

    setSaving(false);
    setMessage("保存しました。サイトには最大1分で反映されます。");
    setDraft(null);
    load();
  }

  async function toggleHidden(row: CategoryRow) {
    if (!supabase) return;
    const { error } = await supabase
      .from("site_categories")
      .update({ hidden: !row.hidden, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) {
      setMessage(`変更できませんでした：${error.message}`);
      return;
    }
    load();
  }

  async function move(index: number, direction: -1 | 1) {
    if (!supabase || !rows) return;
    const row = rows[index];
    const partner = rows[index + direction];
    if (!row || !partner) return;
    await Promise.all([
      supabase.from("site_categories").update({ sort_order: partner.sort_order }).eq("id", row.id),
      supabase.from("site_categories").update({ sort_order: row.sort_order }).eq("id", partner.id),
    ]);
    load();
  }

  function updateCard(index: number, patch: Partial<Card>) {
    if (!draft?.page) return;
    const cards = draft.page.cards.map((card, i) => (i === index ? { ...card, ...patch } : card));
    setDraft({ ...draft, page: { ...draft.page, cards } });
  }

  const btn =
    "rounded-full border border-line bg-white px-3 py-1 text-[13px] font-bold hover:bg-background";
  const field = "rounded-xl border border-line px-3 py-2 text-sm font-normal";
  const sectionBox = "rounded-xl border border-line bg-white p-4";
  const sectionTitle = "mb-1 text-[13px] font-bold text-navy";
  const sectionNote = "mb-3 text-[13px] text-muted";

  return (
    <AdminShell title="カテゴリーとページの管理">
      <p className="mb-4 text-sm text-muted">
        トップページのカテゴリーと、それぞれのページを開いた中の見出し・紹介文を、ここでまとめて変えられます。
        <br />
        ページに並ぶ記事は「記事・コラム」、アイスブレイクと学級レクは「アイスブレイク・学級レク」から変えてください。
        <br />
        <strong>リンク先（アドレス）は変えられません。</strong>実際のページと結びついているためです。
      </p>

      {message && (
        <p className="mb-4 rounded-xl bg-warn-bg px-4 py-2.5 text-sm text-warn">{message}</p>
      )}

      {draft && (
        <div className="mb-6 rounded-2xl border border-accent bg-[#F7FAFF] p-5">
          <h2 className="mb-3 text-sm font-bold text-navy">
            「{draft.category.label}」を編集する
            <span className="ml-2 font-normal text-muted">（{draft.category.href}）</span>
          </h2>

          <div className="mb-4 flex flex-col gap-3">
            <div className={sectionBox}>
              <div className={sectionTitle}>① トップページのカードに出るもの</div>
              <p className={sectionNote}>
                絵文字と名前は、ページを開いた中の見出しにも同じものが使われます。
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-4">
                  <label className="flex w-24 flex-col gap-1 text-[13px] font-bold">
                    絵文字
                    <input
                      type="text"
                      value={draft.category.icon}
                      onChange={(e) =>
                        setDraft({ ...draft, category: { ...draft.category, icon: e.target.value } })
                      }
                      className={field}
                    />
                  </label>
                  <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                    名前
                    <input
                      type="text"
                      value={draft.category.label}
                      onChange={(e) =>
                        setDraft({ ...draft, category: { ...draft.category, label: e.target.value } })
                      }
                      className={field}
                    />
                  </label>
                  <label className="flex w-40 flex-col gap-1 text-[13px] font-bold">
                    状態
                    <select
                      value={draft.category.status}
                      onChange={(e) =>
                        setDraft({ ...draft, category: { ...draft.category, status: e.target.value } })
                      }
                      className={field}
                    >
                      <option value="live">公開中</option>
                      <option value="coming-soon">準備中と表示</option>
                    </select>
                  </label>
                </div>
                <label className="flex flex-col gap-1 text-[13px] font-bold">
                  カードの説明（トップページのカードの中に出る一行）
                  <textarea
                    value={draft.category.description}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        category: { ...draft.category, description: e.target.value },
                      })
                    }
                    className={`${field} min-h-16`}
                  />
                </label>
              </div>
            </div>

            {draft.page ? (
              <div className={sectionBox}>
                <div className={sectionTitle}>② ページを開いた中に出るもの</div>
                <p className={sectionNote}>
                  見出しは①の絵文字と名前がそのまま出ます。ここでは、その下の文章などを変えます。
                </p>
                <div className="flex flex-col gap-3">
                  <label className="flex flex-col gap-1 text-[13px] font-bold">
                    紹介文（見出しの下。検索結果の説明文にも使われます）
                    <textarea
                      value={draft.page.lead}
                      onChange={(e) =>
                        setDraft({ ...draft, page: { ...draft.page!, lead: e.target.value } })
                      }
                      className={`${field} min-h-20`}
                    />
                  </label>
                  <label className="flex w-56 flex-col gap-1 text-[13px] font-bold">
                    見出しの上の英字
                    <input
                      type="text"
                      value={draft.page.eyebrow}
                      onChange={(e) =>
                        setDraft({ ...draft, page: { ...draft.page!, eyebrow: e.target.value } })
                      }
                      className={field}
                    />
                  </label>

                  {draft.page.cards.length > 0 && (
                    <div className="rounded-xl border border-line bg-background p-3">
                      <div className="mb-2 text-[13px] font-bold text-navy">
                        大きなカード（ページの上のほう）
                      </div>
                      <p className="mb-3 text-[13px] text-muted">
                        リンク先と「○個掲載」の数は変えられません。
                      </p>
                      {draft.page.cards.map((card, i) => (
                        <div key={card.href} className="mb-3 flex flex-col gap-2 last:mb-0">
                          <div className="text-[13px] text-muted">{card.href}</div>
                          <div className="flex flex-wrap gap-3">
                            <label className="flex w-24 flex-col gap-1 text-[13px] font-bold">
                              絵文字
                              <input
                                type="text"
                                value={card.emoji}
                                onChange={(e) => updateCard(i, { emoji: e.target.value })}
                                className={field}
                              />
                            </label>
                            <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                              カードの見出し
                              <input
                                type="text"
                                value={card.title}
                                onChange={(e) => updateCard(i, { title: e.target.value })}
                                className={field}
                              />
                            </label>
                          </div>
                          <label className="flex flex-col gap-1 text-[13px] font-bold">
                            カードの説明
                            <textarea
                              value={card.description}
                              onChange={(e) => updateCard(i, { description: e.target.value })}
                              className={`${field} min-h-16`}
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="flex flex-col gap-1 text-[13px] font-bold">
                    テーマ一覧の見出し
                    <input
                      type="text"
                      value={draft.page.topics_title}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          page: { ...draft.page!, topics_title: e.target.value },
                        })
                      }
                      className={field}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[13px] font-bold">
                    テーマ（1行に1つ。すべて消すと、このまとまりごと出なくなります）
                    <textarea
                      value={draft.topicsText}
                      onChange={(e) => setDraft({ ...draft, topicsText: e.target.value })}
                      className={`${field} min-h-40`}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className={sectionBox}>
                <div className={sectionTitle}>② ページを開いた中に出るもの</div>
                <p className="text-[13px] text-muted">
                  このページは、中身が記事やツールの一覧そのものなので、ここから変えるものはありません。
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-full bg-cta px-6 py-2 text-sm font-bold text-white hover:bg-cta-dark disabled:opacity-60"
            >
              {saving ? "保存中..." : "保存する"}
            </button>
            <button type="button" onClick={() => setDraft(null)} className={btn}>
              やめる
            </button>
          </div>
        </div>
      )}

      {rows === null ? (
        <p className="text-sm text-muted">読み込み中です…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted">まだ登録がありません。</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((row, i) => (
            <div
              key={row.id}
              className={`rounded-2xl border bg-white p-4 ${
                row.hidden ? "border-warn-line bg-warn-bg" : "border-line"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg">{row.icon}</span>
                <span className="text-sm font-bold">{row.label}</span>
                <span className="text-[13px] text-muted">{row.href}</span>
                {pages[row.slug] && (
                  <span className="rounded-full bg-[#EAF2FA] px-2 py-0.5 text-[13px] font-bold text-navy">
                    ページの中も変えられます
                  </span>
                )}
                {row.status === "coming-soon" && (
                  <span className="rounded-full bg-background px-2 py-0.5 text-[13px] font-bold text-muted">
                    準備中
                  </span>
                )}
                {row.hidden && (
                  <span className="rounded-full bg-cta px-2 py-0.5 text-[13px] font-bold text-white">
                    非表示中
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-muted">{row.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => startEdit(row)} className={`${btn} text-navy`}>
                  編集
                </button>
                <a href={row.href} target="_blank" rel="noreferrer" className={`${btn} text-navy`}>
                  ページを見る
                </a>
                <button type="button" onClick={() => toggleHidden(row)} className={`${btn} text-navy`}>
                  {row.hidden ? "再表示する" : "非表示にする"}
                </button>
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className={`${btn} disabled:opacity-40`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1}
                  className={`${btn} disabled:opacity-40`}
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
