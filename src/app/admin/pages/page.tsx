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

type Row = {
  id: string;
  slug: string;
  eyebrow: string;
  emoji: string;
  heading: string;
  lead: string;
  topics_title: string;
  topics: string[];
  cards: Card[];
  sort_order: number;
};

/** 管理画面での呼び名と、実際のページのアドレス */
const PAGE_INFO: Record<string, { name: string; path: string }> = {
  lessons: { name: "授業・教材アイデア", path: "/lessons" },
  classroom: { name: "学級経営", path: "/classroom" },
  ai: { name: "先生のAI活用", path: "/ai" },
};

const SETUP_MESSAGE =
  "この画面を使うには、supabase/009_page_texts.sql をSupabaseのSQL Editorで1回実行してください。";

export default function AdminPagesPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [draft, setDraft] = useState<Row | null>(null);
  const [topicsText, setTopicsText] = useState("");
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
      .from("page_texts")
      .select("id,slug,eyebrow,emoji,heading,lead,topics_title,topics,cards,sort_order")
      .order("sort_order", { ascending: true });
    if (error) {
      setMessage(
        error.message.includes("page_texts")
          ? SETUP_MESSAGE
          : `読み込みに失敗しました：${error.message}`,
      );
      setRows([]);
      return;
    }
    setRows((data ?? []) as Row[]);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  function startEdit(row: Row) {
    setDraft({ ...row, topics: [...row.topics], cards: row.cards.map((c) => ({ ...c })) });
    setTopicsText(row.topics.join("\n"));
    setMessage(null);
  }

  async function save() {
    if (!supabase || !draft) return;
    if (!draft.heading.trim()) {
      setMessage("見出しは必ず入れてください。");
      return;
    }
    const topics = topicsText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    setSaving(true);
    const { error } = await supabase
      .from("page_texts")
      .update({
        eyebrow: draft.eyebrow.trim(),
        emoji: draft.emoji.trim(),
        heading: draft.heading.trim(),
        lead: draft.lead.trim(),
        topics_title: draft.topics_title.trim(),
        topics,
        cards: draft.cards,
        updated_at: new Date().toISOString(),
      })
      .eq("id", draft.id);
    setSaving(false);
    if (error) {
      setMessage(`保存できませんでした：${error.message}`);
      return;
    }
    setMessage("保存しました。サイトには最大1分で反映されます。");
    setDraft(null);
    load();
  }

  function updateCard(index: number, patch: Partial<Card>) {
    if (!draft) return;
    const cards = draft.cards.map((card, i) => (i === index ? { ...card, ...patch } : card));
    setDraft({ ...draft, cards });
  }

  const btn =
    "rounded-full border border-line bg-white px-3 py-1 text-[13px] font-bold hover:bg-background";
  const field = "rounded-xl border border-line px-3 py-2 text-sm font-normal";

  return (
    <AdminShell title="ページの見出し・紹介文の管理">
      <p className="mb-4 text-sm text-muted">
        「授業・教材アイデア」などの一覧ページの、見出し・紹介文・
        「今後扱っていくテーマ（例）」を変えられます。
        <br />
        ページに並ぶ記事そのものは「記事・コラムの管理」、アイスブレイクと学級レクは
        「アイスブレイク・学級レクの管理」から変えてください。
      </p>

      {message && (
        <p className="mb-4 rounded-xl bg-warn-bg px-4 py-2.5 text-sm text-warn">{message}</p>
      )}

      {draft && (
        <div className="mb-6 rounded-2xl border border-accent bg-[#F7FAFF] p-5">
          <h2 className="mb-3 text-sm font-bold text-navy">
            「{PAGE_INFO[draft.slug]?.name ?? draft.slug}」を編集する
            <span className="ml-2 font-normal text-muted">
              （{PAGE_INFO[draft.slug]?.path ?? ""}）
            </span>
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex w-28 flex-col gap-1 text-[13px] font-bold">
                絵文字
                <input
                  type="text"
                  value={draft.emoji}
                  onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
                  className={field}
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                見出し
                <input
                  type="text"
                  value={draft.heading}
                  onChange={(e) => setDraft({ ...draft, heading: e.target.value })}
                  className={field}
                />
              </label>
              <label className="flex w-48 flex-col gap-1 text-[13px] font-bold">
                見出しの上の英字
                <input
                  type="text"
                  value={draft.eyebrow}
                  onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })}
                  className={field}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              紹介文（見出しの下に出ます。検索結果の説明文にも使われます）
              <textarea
                value={draft.lead}
                onChange={(e) => setDraft({ ...draft, lead: e.target.value })}
                className={`${field} min-h-20`}
              />
            </label>

            {draft.cards.length > 0 && (
              <div className="rounded-xl border border-line bg-white p-4">
                <div className="mb-2 text-[13px] font-bold text-navy">
                  大きなカード（ページの上のほうに出ます）
                </div>
                <p className="mb-3 text-[13px] text-muted">
                  リンク先と「○個掲載」の数は、実際のページと結びついているので変えられません。
                </p>
                {draft.cards.map((card, i) => (
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
                value={draft.topics_title}
                onChange={(e) => setDraft({ ...draft, topics_title: e.target.value })}
                className={field}
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              テーマ（1行に1つ。すべて消すと、このまとまりごと出なくなります）
              <textarea
                value={topicsText}
                onChange={(e) => setTopicsText(e.target.value)}
                className={`${field} min-h-40`}
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
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
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg">{row.emoji}</span>
                <span className="text-sm font-bold">{row.heading}</span>
                <span className="text-[13px] text-muted">
                  {PAGE_INFO[row.slug]?.path ?? row.slug}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-muted">{row.lead}</p>
              <p className="mt-1 text-[13px] text-muted">
                テーマ {row.topics.length}件
                {row.cards.length > 0 && ` ・ カード ${row.cards.length}件`}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(row)}
                  className={`${btn} text-navy`}
                >
                  編集
                </button>
                <a
                  href={PAGE_INFO[row.slug]?.path ?? "/"}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btn} text-navy`}
                >
                  ページを見る
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
