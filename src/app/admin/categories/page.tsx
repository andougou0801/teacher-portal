"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseClient } from "@/lib/supabaseClient";

type Row = {
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

const SETUP_MESSAGE =
  "この画面を使うには、supabase/007_site_categories.sql をSupabaseのSQL Editorで1回実行してください。";

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [draft, setDraft] = useState<Row | null>(null);
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
    setRows((data ?? []) as Row[]);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
  }, [load]);

  async function save() {
    if (!supabase || !draft) return;
    if (!draft.label.trim()) {
      setMessage("名前は必ず入れてください。");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("site_categories")
      .update({
        label: draft.label.trim(),
        icon: draft.icon.trim(),
        description: draft.description.trim(),
        status: draft.status,
        hidden: draft.hidden,
        updated_at: new Date().toISOString(),
      })
      .eq("id", draft.id);
    setSaving(false);
    if (error) {
      setMessage(`保存できませんでした：${error.message}`);
      return;
    }
    setMessage("保存しました。");
    setDraft(null);
    load();
  }

  async function toggleHidden(row: Row) {
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
      supabase
        .from("site_categories")
        .update({ sort_order: partner.sort_order })
        .eq("id", row.id),
      supabase
        .from("site_categories")
        .update({ sort_order: row.sort_order })
        .eq("id", partner.id),
    ]);
    load();
  }

  const btn =
    "rounded-full border border-line bg-white px-3 py-1 text-[13px] font-bold hover:bg-background";
  const field = "rounded-xl border border-line px-3 py-2 text-sm font-normal";

  return (
    <AdminShell title="トップページのカテゴリーの管理">
      <p className="mb-4 text-sm text-muted">
        トップページの「どこから探しますか？」に出るカテゴリーの、名前・絵文字・説明・並び順を変えられます。
        「非表示」にすると、トップページとフッターから消えます（ページ自体は残ります）。
        <br />
        <strong>リンク先（アドレス）は変えられません。</strong>
        実際のページと結びついているためです。
      </p>

      {message && (
        <p className="mb-4 rounded-xl bg-warn-bg px-4 py-2.5 text-sm text-warn">{message}</p>
      )}

      {draft && (
        <div className="mb-6 rounded-2xl border border-accent bg-[#F7FAFF] p-5">
          <h2 className="mb-3 text-sm font-bold text-navy">
            「{draft.slug}」を編集する
            <span className="ml-2 font-normal text-muted">（リンク先：{draft.href}）</span>
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex w-28 flex-col gap-1 text-[13px] font-bold">
                絵文字
                <input
                  type="text"
                  value={draft.icon}
                  onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
                  className={field}
                />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-[13px] font-bold">
                名前
                <input
                  type="text"
                  value={draft.label}
                  onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                  className={field}
                />
              </label>
              <label className="flex w-40 flex-col gap-1 text-[13px] font-bold">
                状態
                <select
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                  className={field}
                >
                  <option value="live">公開中</option>
                  <option value="coming-soon">準備中と表示</option>
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1 text-[13px] font-bold">
              説明（カードの下や検索ページに出ます）
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className={`${field} min-h-20`}
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
                <button
                  type="button"
                  onClick={() => setDraft({ ...row })}
                  className={`${btn} text-navy`}
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => toggleHidden(row)}
                  className={`${btn} text-navy`}
                >
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
